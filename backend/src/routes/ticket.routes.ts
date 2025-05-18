import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.middleware';
import {
  purchaseTicket,
  getUserTickets,
  getTicketById,
  cancelTicket,
} from '../controllers/ticket.controller';
import { Ticket } from '../models/ticket.model';

const router = Router();

// Validation middleware
const purchaseTicketValidation = [
  body('eventId').notEmpty().withMessage('Event ID is required'),
  body('category').notEmpty().withMessage('Ticket category is required'),
  body('seatNumber').optional().isString().withMessage('Seat number must be a string'),
];

// Routes
// FONTOS: A sorrend számít! Az Express a legfelső illeszkedő útvonalat fogja használni

// 1. Új végpont minden jegy lekéréséhez - ezt MINDENKÉPPEN a paraméterezett útvonalak elé kell tenni
// Ez a végpont nincs védve, hogy gyorsan láthassuk az adatokat
router.get('/all', async (req: Request, res: Response) => {
  try {
    console.log('[BACKEND] Minden jegy lekérése kérés érkezett');
    const tickets = await Ticket.find({})
      .populate('event', 'title date location')
      .sort({ purchaseDate: -1 });
    
    console.log(`[BACKEND] Összes talált jegy: ${tickets.length} db`);
    res.json(tickets);
  } catch (error) {
    console.error('[BACKEND] Hiba a jegyek lekérése során:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Standard API végpontok
router.get('/my-tickets', auth, getUserTickets);
router.post('/', auth, purchaseTicketValidation, purchaseTicket);

// 3. Paraméterezett útvonalak - ezeknek mindig a végén kell lenniük
router.get('/:id', auth, getTicketById);
router.post('/:id/cancel', auth, cancelTicket);

export const ticketRoutes = router;