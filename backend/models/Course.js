import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  duration: {
    type: String,
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  details: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;
