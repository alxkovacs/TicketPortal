"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
const ticket_controller_1 = require("../controllers/ticket.controller");
const ticket_model_1 = require("../models/ticket.model");
const router = (0, express_1.Router)();
// Validation middleware
const purchaseTicketValidation = [
    (0, express_validator_1.body)('eventId').notEmpty().withMessage('Event ID is required'),
    (0, express_validator_1.body)('category').notEmpty().withMessage('Ticket category is required'),
    (0, express_validator_1.body)('seatNumber').optional().isString().withMessage('Seat number must be a string'),
];
// Routes
// FONTOS: A sorrend számít! Az Express a legfelső illeszkedő útvonalat fogja használni
// 1. Új végpont minden jegy lekéréséhez - ezt MINDENKÉPPEN a paraméterezett útvonalak elé kell tenni
// Ez a végpont nincs védve, hogy gyorsan láthassuk az adatokat
router.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('[BACKEND] Minden jegy lekérése kérés érkezett');
        const tickets = yield ticket_model_1.Ticket.find({})
            .populate('event', 'title date location')
            .sort({ purchaseDate: -1 });
        console.log(`[BACKEND] Összes talált jegy: ${tickets.length} db`);
        res.json(tickets);
    }
    catch (error) {
        console.error('[BACKEND] Hiba a jegyek lekérése során:', error);
        res.status(500).json({ error: 'Server error' });
    }
}));
// 2. Standard API végpontok
router.get('/my-tickets', auth_middleware_1.auth, ticket_controller_1.getUserTickets);
router.post('/', auth_middleware_1.auth, purchaseTicketValidation, ticket_controller_1.purchaseTicket);
// 3. Paraméterezett útvonalak - ezeknek mindig a végén kell lenniük
router.get('/:id', auth_middleware_1.auth, ticket_controller_1.getTicketById);
router.post('/:id/cancel', auth_middleware_1.auth, ticket_controller_1.cancelTicket);
exports.ticketRoutes = router;
