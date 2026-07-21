import mongoose from 'mongoose';

const feeLedgerSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    unique: true
  },
  totalPackageAmount: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true,
    default: 0
  },
  balanceDue: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partially Paid', 'Fully Paid'],
    default: 'Unpaid'
  }
}, { timestamps: true });

const FeeLedger = mongoose.model('FeeLedger', feeLedgerSchema);
export default FeeLedger;
