import Student from '../models/Student.js';
import FeeLedger from '../models/FeeLedger.js';
import Invoice from '../models/Invoice.js';

// Helper to generate Roll Number
const generateRollNumber = async () => {
  const count = await Student.countDocuments();
  const nextNum = String(count + 1).padStart(3, '0');
  const year = new Date().getFullYear();
  return `AG-${year}-ST${nextNum}`;
};

// Register Student & Generate Ledger & Invoices
export const registerStudent = async (req, res) => {
  const { name, email, batchId, courseName, totalPackageAmount, installments } = req.body;

  try {
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    const rollNumber = await generateRollNumber();

    // 1. Create Student
    const student = await Student.create({
      rollNumber,
      name,
      email,
      batchId,
      courseName,
      status: 'Active',
      isConfidentialFee: req.body.isConfidentialFee || false
    });

    // 2. Create Student Fees Ledger
    const ledger = await FeeLedger.create({
      studentId: student._id,
      totalPackageAmount,
      amountPaid: 0,
      balanceDue: totalPackageAmount,
      paymentStatus: 'Unpaid'
    });

    // 3. Create Dynamic Invoices
    const createdInvoices = [];
    const count = await Invoice.countDocuments();
    let currentInvoiceCounter = count + 1;

    if (installments && installments.length > 0) {
      // Custom installments provided
      for (let i = 0; i < installments.length; i++) {
        const inst = installments[i];
        const invoiceNum = `INV-2026-${String(currentInvoiceCounter++).padStart(5, '0')}`;
        const invoice = await Invoice.create({
          invoiceNumber: invoiceNum,
          studentId: student._id,
          amount: inst.amount,
          dueDate: inst.dueDate,
          status: 'Pending',
          particulars: inst.particulars || `Installment ${i + 1} - Course Tuition Fee`
        });
        createdInvoices.push(invoice);
      }
    } else {
      // Default: 3 installments split equally
      const installmentCount = 3;
      const amountPerInstallment = Math.round(totalPackageAmount / installmentCount);
      const today = new Date();

      for (let i = 0; i < installmentCount; i++) {
        const invoiceNum = `INV-2026-${String(currentInvoiceCounter++).padStart(5, '0')}`;
        // Calculate due dates at 30-day increments
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + (i * 30));
        const dueDateString = dueDate.toISOString().split('T')[0];

        const invoice = await Invoice.create({
          invoiceNumber: invoiceNum,
          studentId: student._id,
          amount: amountPerInstallment,
          dueDate: dueDateString,
          status: 'Pending',
          particulars: `${i === 0 ? 'First' : i === 1 ? 'Second' : 'Third'} Installment - Course Tuition Fee`
        });
        createdInvoices.push(invoice);
      }
    }

    res.status(201).json({
      student,
      ledger,
      invoices: createdInvoices
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all students along with their ledger and invoices
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    const studentsWithLedger = [];

    for (const student of students) {
      const ledger = await FeeLedger.findOne({ studentId: student._id });
      const invoices = await Invoice.find({ studentId: student._id });
      studentsWithLedger.push({
        ...student.toObject(),
        ledger,
        invoices
      });
    }

    res.json(studentsWithLedger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Override / Adjust package amount or write-off outstanding debt
export const overrideLedger = async (req, res) => {
  const { studentId } = req.params;
  const { newPackageAmount, writeOffAmount, discountAmount } = req.body;

  try {
    const ledger = await FeeLedger.findOne({ studentId });
    if (!ledger) {
      return res.status(404).json({ message: 'Ledger not found for student' });
    }

    if (newPackageAmount !== undefined) {
      ledger.totalPackageAmount = newPackageAmount;
    }

    if (discountAmount !== undefined) {
      ledger.totalPackageAmount -= discountAmount;
    }

    if (writeOffAmount !== undefined) {
      ledger.balanceDue = Math.max(0, ledger.balanceDue - writeOffAmount);
    } else {
      ledger.balanceDue = ledger.totalPackageAmount - ledger.amountPaid;
    }

    // Recalculate status
    if (ledger.balanceDue === 0) {
      ledger.paymentStatus = 'Fully Paid';
    } else if (ledger.amountPaid > 0) {
      ledger.paymentStatus = 'Partially Paid';
    } else {
      ledger.paymentStatus = 'Unpaid';
    }

    await ledger.save();
    res.json({ message: 'Ledger adjusted successfully', ledger });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
