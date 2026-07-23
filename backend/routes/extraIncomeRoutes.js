import express from 'express';
import { getExtraIncomes, createExtraIncome, deleteExtraIncome } from '../controllers/extraIncomeController.js';

const router = express.Router();

router.route('/')
  .get(getExtraIncomes)
  .post(createExtraIncome);

router.route('/:id')
  .delete(deleteExtraIncome);

export default router;
