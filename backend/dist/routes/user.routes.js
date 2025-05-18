"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// Validation middleware
const updateProfileValidation = [
    (0, express_validator_1.body)('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    (0, express_validator_1.body)('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Please enter a valid email'),
];
const changePasswordValidation = [
    (0, express_validator_1.body)('currentPassword').notEmpty().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long'),
];
// Routes
router.put('/profile', auth_middleware_1.auth, updateProfileValidation, user_controller_1.updateProfile);
router.put('/change-password', auth_middleware_1.auth, changePasswordValidation, user_controller_1.changePassword);
router.get('/my-events', auth_middleware_1.auth, user_controller_1.getOrganizerEvents);
exports.userRoutes = router;
