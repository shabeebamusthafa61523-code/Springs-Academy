import express from 'express';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';

const router = express.Router();

router.route('/')
  .get(getCourses)
  .post(createCourse);

router.route('/:id')
  .put(updateCourse)
  .delete(deleteCourse);

export default router;
