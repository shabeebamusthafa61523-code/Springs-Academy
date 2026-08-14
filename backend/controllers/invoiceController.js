import Invoice from '../models/Invoice.js';
import FeeLedger from '../models/FeeLedger.js';
import Student from '../models/Student.js';
import mongoose from 'mongoose';

// Record payment / update invoice status & details
export const updateInvoiceStatus = async (req, res) => {
  const { invoiceId } = req.params;
  const { status, paymentMethod, amount, date } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (status !== undefined) invoice.status = status;
    if (paymentMethod !== undefined) invoice.paymentMethod = paymentMethod;
    if (amount !== undefined && !isNaN(parseFloat(amount))) invoice.amount = parseFloat(amount);
    if (date !== undefined) invoice.paidOn = new Date(date);

    if (invoice.status === 'Paid' && !invoice.paidOn) {
      invoice.paidOn = new Date();
    } else if (invoice.status === 'Pending') {
      invoice.paymentMethod = 'N/A';
      invoice.paidOn = null;
    }

    await invoice.save();

    // Recalculate Student Fees Ledger
    const studentId = invoice.studentId;
    const paidInvoices = await Invoice.find({ studentId, status: 'Paid' });
    const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const ledger = await FeeLedger.findOne({ studentId });
    if (ledger) {
      ledger.amountPaid = totalPaid;
      ledger.balanceDue = Math.max(0, ledger.totalPackageAmount - totalPaid);

      if (ledger.balanceDue === 0 && ledger.totalPackageAmount > 0) {
        ledger.paymentStatus = 'Fully Paid';
      } else if (ledger.amountPaid > 0) {
        ledger.paymentStatus = 'Partially Paid';
      } else {
        ledger.paymentStatus = 'Unpaid';
      }

      await ledger.save();
    }

    res.json({
      message: 'Invoice status and payment details updated successfully in MongoDB Atlas',
      invoice,
      ledger
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper to generate guaranteed unique invoice number
const generateUniqueInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  const timeSuffix = Date.now().toString().slice(-4);
  const randomNum = Math.floor(100 + Math.random() * 900);
  let candidate = `INV-2026-${String(count + 1).padStart(4, '0')}-${timeSuffix}`;
  let exists = await Invoice.findOne({ invoiceNumber: candidate });
  let attempts = 0;
  while (exists && attempts < 10) {
    attempts++;
    candidate = `INV-2026-${String(count + 1 + attempts).padStart(4, '0')}-${Date.now().toString().slice(-4)}${randomNum}`;
    exists = await Invoice.findOne({ invoiceNumber: candidate });
  }
  return candidate;
};

// Record direct fee payment and reconcile student ledger
export const recordFeePayment = async (req, res) => {
  const { studentId, amount, date, paymentMethod, upiScreenshot } = req.body;
  try {
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ message: 'Valid payment amount is required' });
    }

    const studentIdStr = String(studentId);
    const studentIdObj = mongoose.Types.ObjectId.isValid(studentIdStr) ? new mongoose.Types.ObjectId(studentIdStr) : null;
    const queryIdFilter = studentIdObj ? { $in: [studentIdStr, studentIdObj] } : studentIdStr;

    // 1. Find oldest pending invoice for student and mark as Paid
    let pendingInvoices = await Invoice.find({ studentId: queryIdFilter, status: 'Pending' }).sort({ dueDate: 1 });
    let invoiceUpdated = null;

    if (pendingInvoices && pendingInvoices.length > 0) {
      const oldestInvoice = pendingInvoices[0];
      oldestInvoice.status = 'Paid';
      oldestInvoice.paymentMethod = paymentMethod || 'Cash';
      oldestInvoice.paidOn = date ? new Date(date) : new Date();
      if (upiScreenshot) oldestInvoice.upiScreenshot = upiScreenshot;
      await oldestInvoice.save();
      invoiceUpdated = oldestInvoice;
    } else {
      // Create new paid receipt invoice with guaranteed unique invoice number
      const invoiceNumber = await generateUniqueInvoiceNumber();
      invoiceUpdated = await Invoice.create({
        invoiceNumber,
        studentId: studentIdObj || studentIdStr,
        amount: numericAmount,
        dueDate: date || new Date().toISOString().split('T')[0],
        status: 'Paid',
        paymentMethod: paymentMethod || 'Cash',
        paidOn: date ? new Date(date) : new Date(),
        upiScreenshot: upiScreenshot || null,
        particulars: `Fee Collection Receipt - ${paymentMethod || 'Cash'}`
      });
    }

    // 2. Record payment entry in student document if found
    const studentDoc = await Student.findById(studentIdObj || studentIdStr).catch(() => null);
    if (studentDoc) {
      if (!studentDoc.payments) studentDoc.payments = [];
      const existingPay = studentDoc.payments.find(p => p.invoiceId && String(p.invoiceId) === String(invoiceUpdated._id));
      if (!existingPay) {
        studentDoc.payments.push({
          amount: numericAmount,
          date: date || new Date().toISOString().split('T')[0],
          paymentMethod: paymentMethod || 'Cash',
          upiScreenshot: upiScreenshot || null,
          invoiceId: invoiceUpdated._id
        });
        await studentDoc.save();
      }
    }

    // 3. Recalculate Student FeeLedger
    const paidInvoices = await Invoice.find({ studentId: queryIdFilter, status: 'Paid' });
    const totalPaidInvoices = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const manualPaymentsSum = (studentDoc?.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalPaid = Math.max(totalPaidInvoices, manualPaymentsSum);

    let ledger = await FeeLedger.findOne({ studentId: queryIdFilter });
    if (!ledger) {
      ledger = await FeeLedger.create({
        studentId: studentIdObj || studentIdStr,
        totalPackageAmount: 45000,
        amountPaid: totalPaid,
        balanceDue: Math.max(0, 45000 - totalPaid),
        paymentStatus: (45000 - totalPaid) === 0 ? 'Fully Paid' : totalPaid > 0 ? 'Partially Paid' : 'Unpaid'
      });
    } else {
      ledger.amountPaid = totalPaid;
      ledger.balanceDue = Math.max(0, ledger.totalPackageAmount - totalPaid);
      ledger.paymentStatus = ledger.balanceDue === 0 && ledger.totalPackageAmount > 0 ? 'Fully Paid' : ledger.amountPaid > 0 ? 'Partially Paid' : 'Unpaid';
      await ledger.save();
    }

    const updatedInvoices = await Invoice.find({ studentId: queryIdFilter });

    res.status(200).json({
      message: 'Fee payment recorded successfully in MongoDB Atlas',
      invoice: invoiceUpdated,
      student: studentDoc,
      ledger,
      invoices: updatedInvoices
    });
  } catch (error) {
    console.error("[Record Fee Payment Error]:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create custom installment invoice for a student
export const createInvoice = async (req, res) => {
  const { studentId, amount, dueDate, particulars } = req.body;
  try {
    const invoiceNumber = await generateUniqueInvoiceNumber();

    const invoice = await Invoice.create({
      invoiceNumber,
      studentId,
      amount: parseFloat(amount),
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      status: 'Pending',
      particulars: particulars || 'Additional Installment/Fee'
    });

    // Update FeeLedger package amount
    const ledger = await FeeLedger.findOne({ studentId });
    if (ledger) {
      ledger.totalPackageAmount += parseFloat(amount);
      ledger.balanceDue = Math.max(0, ledger.totalPackageAmount - ledger.amountPaid);
      ledger.paymentStatus = ledger.balanceDue === 0 ? 'Fully Paid' : ledger.amountPaid > 0 ? 'Partially Paid' : 'Unpaid';
      await ledger.save();
    }

    res.status(201).json({ invoice, ledger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all invoices
export const getInvoices = async (req, res) => {
  try {
    let invoices = await Invoice.find({}).populate('studentId', 'name rollNumber email isConfidentialFee');
    if (req.user && req.user.role !== 'Super Admin') {
      invoices = invoices.filter(inv => !inv.studentId || !inv.studentId.isConfidentialFee);
    }
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete payment log & reconcile student fee ledger
export const deletePaymentLog = async (req, res) => {
  const paymentId = req.params.paymentId || req.params.invoiceId || req.params.id;
  const { studentId } = req.body || {};

  try {
    console.log(`[Delete Payment Log] Attempting deletion for paymentId: ${paymentId}, studentId: ${studentId}`);
    let studentIdToReconcile = studentId;

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID is required for deletion' });
    }

    // 1. Check if paymentId corresponds to an Invoice document
    const invoice = await Invoice.findById(paymentId);
    if (invoice) {
      console.log(`[Delete Payment Log] Found Invoice document: ${invoice._id}, particulars: ${invoice.particulars}`);
      if (invoice.studentId) {
        studentIdToReconcile = studentIdToReconcile || (invoice.studentId._id ? String(invoice.studentId._id) : String(invoice.studentId));
      }

      if (invoice.particulars && invoice.particulars.startsWith('Fee Collection Receipt')) {
        // Dynamic fee receipt invoice created on payment -> delete document permanently from Atlas
        await Invoice.findByIdAndDelete(paymentId);
        console.log(`[Delete Payment Log] Deleted dynamic receipt invoice ${paymentId} from Atlas`);
      } else {
        // Original scheduled invoice -> revert status to Pending
        invoice.status = 'Pending';
        invoice.paidOn = null;
        invoice.paymentMethod = 'N/A';
        invoice.upiScreenshot = null;
        await invoice.save();
        console.log(`[Delete Payment Log] Reverted scheduled invoice ${paymentId} to Pending in Atlas`);
      }
    }

    // 2. Check if paymentId exists inside any Student.payments array
    if (!studentIdToReconcile) {
      const studentWithPay = await Student.findOne({ 'payments._id': paymentId });
      if (studentWithPay) {
        studentIdToReconcile = String(studentWithPay._id);
      }
    }

    if (studentIdToReconcile) {
      const student = await Student.findById(studentIdToReconcile);
      if (student && student.payments) {
        const initialCount = student.payments.length;
        student.payments = student.payments.filter(p => String(p._id) !== String(paymentId));
        if (student.payments.length !== initialCount) {
          await student.save();
          console.log(`[Delete Payment Log] Removed payment ${paymentId} from student.payments array in Atlas`);
        }
      }

      // 3. Recalculate Student Fees Ledger in Atlas
      const paidInvoices = await Invoice.find({ studentId: studentIdToReconcile, status: 'Paid' });
      const totalPaidInvoices = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

      const studentObj = await Student.findById(studentIdToReconcile);
      const manualPaymentsSum = (studentObj?.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
      const totalPaid = totalPaidInvoices + manualPaymentsSum;

      const ledger = await FeeLedger.findOne({ studentId: studentIdToReconcile });
      if (ledger) {
        ledger.amountPaid = totalPaid;
        ledger.balanceDue = Math.max(0, ledger.totalPackageAmount - totalPaid);
        ledger.paymentStatus = ledger.balanceDue === 0 && ledger.totalPackageAmount > 0 ? 'Fully Paid' : ledger.amountPaid > 0 ? 'Partially Paid' : 'Unpaid';
        await ledger.save();
        console.log(`[Delete Payment Log] Reconciled FeeLedger in Atlas: amountPaid=${totalPaid}, balanceDue=${ledger.balanceDue}`);
      }

      const updatedStudent = await Student.findById(studentIdToReconcile);
      const updatedInvoices = await Invoice.find({ studentId: studentIdToReconcile });

      return res.status(200).json({
        message: 'Payment log deleted and ledger reconciled successfully in MongoDB Atlas',
        student: updatedStudent,
        ledger,
        invoices: updatedInvoices
      });
    }

    res.status(200).json({ message: 'Payment log processed' });
  } catch (error) {
    console.error("[Delete Payment Log Error]:", error);
    res.status(500).json({ message: error.message });
  }
};
