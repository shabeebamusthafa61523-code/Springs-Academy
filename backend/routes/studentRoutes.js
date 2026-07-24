import express from 'express';
import { registerStudent, getStudents, overrideLedger, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('Super Admin', 'Admin'), registerStudent)
  .get(protect, getStudents);

router.route('/:id')
  .put(protect, authorize('Super Admin', 'Admin'), updateStudent)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteStudent);

router.route('/:studentId/override')
  .put(protect, authorize('Super Admin'), overrideLedger);

export default router;
