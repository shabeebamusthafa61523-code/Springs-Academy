import express from 'express';
import {
  getEmployees,
  updateEmployeeHR,
  submitExpenseClaim,
  getExpenseClaims,
  reviewExpenseClaim
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/employees')
  .get(protect, getEmployees);

router.route('/employees/:employeeId')
  .put(protect, authorize('Super Admin', 'Admin'), updateEmployeeHR);

router.route('/expenses')
  .post(protect, submitExpenseClaim)
  .get(protect, getExpenseClaims);

router.route('/expenses/:claimId')
  .put(protect, authorize('Super Admin', 'Admin'), reviewExpenseClaim);

export default router;
