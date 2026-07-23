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
  },
  dob: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  fatherName: { type: String, default: '' },
  motherName: { type: String, default: '' },
  parentsPhone: { type: String, default: '' },
  address: { type: String, default: '' },
  qualification: { type: String, default: '' },
  profileImage: { type: String, default: null },
  idPhoto: { type: String, default: null },
  sslcPhoto: { type: String, default: null }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
