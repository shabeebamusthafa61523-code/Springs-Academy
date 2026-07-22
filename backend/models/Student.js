import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  batchId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Dropped'],
    default: 'Active'
  },
  isConfidentialFee: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
