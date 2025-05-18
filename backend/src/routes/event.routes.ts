import { Router } from 'express';
import { body } from 'express-validator';
import { auth, adminAuth } from '../middleware/auth.middleware';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from '../controllers/event.controller';

const router = Router();

// Validation middleware
const eventValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('ticketCategories').isArray().withMessage('Ticket categories must be an array'),
  body('ticketCategories.*.name').notEmpty().withMessage('Category name is required'),
  body('ticketCategories.*.price').isNumeric().withMessage('Price must be a number'),
  body('ticketCategories.*.availableSeats')
    .isInt({ min: 0 })
    .withMessage('Available seats must be a positive number'),
];

// Routes
router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', auth, eventValidation, createEvent);
router.put('/:id', auth, eventValidation, updateEvent);
router.delete('/:id', auth, deleteEvent);

export const eventRoutes = router; 