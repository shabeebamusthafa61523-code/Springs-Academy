import mongoose from 'mongoose';

const extraIncomeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: 'Miscellaneous'
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  date: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  paymentMethod: {
    type: String,
    default: 'Cash'
  }
}, { timestamps: true });

const ExtraIncome = mongoose.model('ExtraIncome', extraIncomeSchema);
export default ExtraIncome;
