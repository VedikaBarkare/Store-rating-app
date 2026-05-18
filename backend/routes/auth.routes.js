import express from 'express';
import { registerUser, loginUser, updatePassword, getProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update-password', protect, updatePassword);
router.get('/profile', protect, getProfile);

export default router;
