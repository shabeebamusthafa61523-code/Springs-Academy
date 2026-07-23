import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  duration: {
    type: String,
    default: '6 Months'
  },
  fee: {
    type: Number,
    default: 0
  },
  details: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;
