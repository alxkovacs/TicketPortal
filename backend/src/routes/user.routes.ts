import { Router } from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.middleware';
import {
  updateProfile,
  changePassword,
  getOrganizerEvents,
} from '../controllers/user.controller';

const router = Router();

// Validation middleware
const updateProfileValidation = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please enter a valid email'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
];

// Routes
router.put('/profile', auth, updateProfileValidation, updateProfile);
router.put('/change-password', auth, changePasswordValidation, changePassword);
router.get('/my-events', auth, getOrganizerEvents);

export const userRoutes = router; 