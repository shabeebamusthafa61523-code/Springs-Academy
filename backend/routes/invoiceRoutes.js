import express from 'express';
import { getInvoices, updateInvoiceStatus } from '../controllers/invoiceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getInvoices);

router.route('/:invoiceId')
  .put(protect, authorize('Super Admin', 'Admin'), updateInvoiceStatus);

export default router;
