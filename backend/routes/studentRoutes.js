import express from 'express';
import { registerStudent, getStudents, overrideLedger } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('Super Admin', 'Admin'), registerStudent)
  .get(protect, getStudents);

router.route('/:studentId/override')
  .put(protect, authorize('Super Admin'), overrideLedger);

export default router;
