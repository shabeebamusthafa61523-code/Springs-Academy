import Course from '../models/Course.js';

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new course
export const createCourse = async (req, res) => {
  let { name, duration, fee, details } = req.body || {};
  if (typeof req.body === 'string') {
    name = req.body;
  }
  
  if (!name && req.body && typeof req.body === 'object') {
    name = req.body.name || req.body.title || req.body.courseName;
  }

  if (!name) {
    return res.status(400).json({ message: 'Course name is required' });
  }

  try {
    const existingCourse = await Course.findOne({ name: new RegExp(`^${name.trim()}$`, 'i') });
    if (existingCourse) {
      if (duration) existingCourse.duration = duration;
      if (fee !== undefined) existingCourse.fee = parseFloat(fee);
      if (details !== undefined) existingCourse.details = details;
      await existingCourse.save();
      return res.status(200).json(existingCourse);
    }

    const course = await Course.create({
      name: name.trim(),
      duration: duration || '6 Months',
      fee: fee !== undefined ? parseFloat(fee) : 0,
      details: details || ''
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, duration, fee, details } = req.body;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (name) course.name = name;
    if (duration) course.duration = duration;
    if (fee !== undefined) course.fee = fee;
    if (details !== undefined) course.details = details;

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    await Course.findByIdAndDelete(id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
