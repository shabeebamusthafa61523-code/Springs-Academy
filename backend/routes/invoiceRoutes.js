import express from 'express';
import { getInvoices, updateInvoiceStatus, createInvoice, recordFeePayment } from '../controllers/invoiceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getInvoices)
  .post(protect, authorize('Super Admin', 'Admin'), createInvoice);

router.route('/pay')
  .post(protect, recordFeePayment);

router.route('/:invoiceId')
  .put(protect, authorize('Super Admin', 'Admin'), updateInvoiceStatus);

export default router;
