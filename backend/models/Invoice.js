import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  studentId: {
    type: mongoose.Schema.Types.Mixed,
    ref: 'Student',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    default: 'N/A'
  },
  paidOn: {
    type: Date,
    default: null
  },
  upiScreenshot: {
    type: String,
    default: null
  },
  particulars: {
    type: String,
    default: 'Installment / Course Tuition Fee'
  }
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
