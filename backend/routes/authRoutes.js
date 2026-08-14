import express from 'express';
import { registerUser, loginUser, getUserProfile, resetPasswordByPhone } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset-password-phone', resetPasswordByPhone);
router.get('/profile', protect, getUserProfile);

export default router;
