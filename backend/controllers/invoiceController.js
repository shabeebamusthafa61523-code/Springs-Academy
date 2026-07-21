import Invoice from '../models/Invoice.js';
import FeeLedger from '../models/FeeLedger.js';
import mongoose from 'mongoose';

// Record payment / update invoice status
export const updateInvoiceStatus = async (req, res) => {
  const { invoiceId } = req.params;
  const { status, paymentMethod } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const previousStatus = invoice.status;
    invoice.status = status;
    if (status === 'Paid') {
      invoice.paymentMethod = paymentMethod || 'Cash';
      invoice.paidOn = new Date();
    } else {
      invoice.paymentMethod = 'N/A';
      invoice.paidOn = null;
    }

    await invoice.save();

    // Recalculate Student Fees Ledger
    const studentId = invoice.studentId;
    
    // Find all paid invoices for this student
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
      message: 'Invoice status updated and ledger reconciled successfully',
      invoice,
      ledger
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({}).populate('studentId', 'name rollNumber email');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
