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
  const { name, duration, fee, details } = req.body;
  try {
    const courseExists = await Course.findOne({ name });
    if (courseExists) {
      return res.status(400).json({ message: 'Course with this name already exists' });
    }

    const course = await Course.create({
      name,
      duration,
      fee,
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
