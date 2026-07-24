import Invoice from '../models/Invoice.js';
import FeeLedger from '../models/FeeLedger.js';
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

// Record direct fee payment and reconcile student ledger
export const recordFeePayment = async (req, res) => {
  const { studentId, amount, date, paymentMethod, upiScreenshot } = req.body;
  try {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ message: 'Valid payment amount is required' });
    }

    // 1. Find oldest pending invoice for student and mark as Paid
    let pendingInvoices = await Invoice.find({ studentId, status: 'Pending' }).sort({ dueDate: 1 });
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
      // Create new paid receipt invoice
      const count = await Invoice.countDocuments();
      const invoiceNumber = `INV-2026-${String(count + 1).padStart(5, '0')}`;
      invoiceUpdated = await Invoice.create({
        invoiceNumber,
        studentId,
        amount: numericAmount,
        dueDate: date || new Date().toISOString().split('T')[0],
        status: 'Paid',
        paymentMethod: paymentMethod || 'Cash',
        paidOn: date ? new Date(date) : new Date(),
        upiScreenshot: upiScreenshot || null,
        particulars: `Fee Collection Receipt - ${paymentMethod || 'Cash'}`
      });
    }

    // 2. Recalculate Student FeeLedger
    const paidInvoices = await Invoice.find({ studentId, status: 'Paid' });
    const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const ledger = await FeeLedger.findOne({ studentId });
    if (ledger) {
      ledger.amountPaid = totalPaid;
      ledger.balanceDue = Math.max(0, ledger.totalPackageAmount - totalPaid);
      ledger.paymentStatus = ledger.balanceDue === 0 ? 'Fully Paid' : ledger.amountPaid > 0 ? 'Partially Paid' : 'Unpaid';
      await ledger.save();
    }

    res.status(200).json({
      message: 'Fee payment recorded successfully in MongoDB Atlas',
      invoice: invoiceUpdated,
      ledger
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create custom installment invoice for a student
export const createInvoice = async (req, res) => {
  const { studentId, amount, dueDate, particulars } = req.body;
  try {
    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-2026-${String(count + 1).padStart(5, '0')}`;

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
