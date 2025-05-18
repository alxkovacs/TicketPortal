"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const event_controller_1 = require("../controllers/event.controller");
const router = (0, express_1.Router)();
// Validation middleware
const eventValidation = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('date').isISO8601().withMessage('Valid date is required'),
    (0, express_validator_1.body)('location').notEmpty().withMessage('Location is required'),
    (0, express_validator_1.body)('ticketCategories').isArray().withMessage('Ticket categories must be an array'),
    (0, express_validator_1.body)('ticketCategories.*.name').notEmpty().withMessage('Category name is required'),
    (0, express_validator_1.body)('ticketCategories.*.price').isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('ticketCategories.*.availableSeats')
        .isInt({ min: 0 })
        .withMessage('Available seats must be a positive number'),
];
// Routes
router.get('/', event_controller_1.getEvents);
router.get('/:id', event_controller_1.getEventById);
router.post('/', auth_middleware_1.auth, eventValidation, event_controller_1.createEvent);
router.put('/:id', auth_middleware_1.auth, eventValidation, event_controller_1.updateEvent);
router.delete('/:id', auth_middleware_1.auth, event_controller_1.deleteEvent);
exports.eventRoutes = router;
