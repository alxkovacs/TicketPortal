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
exports.cancelTicket = exports.getTicketById = exports.getUserTickets = exports.purchaseTicket = void 0;
const ticket_model_1 = require("../models/ticket.model");
const event_model_1 = require("../models/event.model");
const express_validator_1 = require("express-validator");
const purchaseTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { eventId, category, seatNumber, quantity = 1 } = req.body;
        // Biztosítsuk, hogy a mennyiség szám és legalább 1
        const ticketQuantity = Math.max(1, Number(quantity) || 1);
        // Find the event
        const event = yield event_model_1.Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        // Find the ticket category
        const ticketCategory = event.ticketCategories.find((cat) => cat.name === category);
        if (!ticketCategory) {
            return res.status(400).json({ error: 'Invalid ticket category' });
        }
        // Check if there are available seats for the requested quantity
        if (ticketCategory.availableSeats < ticketQuantity) {
            return res.status(400).json({
                error: 'Nincs elég szabad hely ebben a kategóriában',
                message: `Kért mennyiség: ${ticketQuantity}, elérhető: ${ticketCategory.availableSeats}`,
                requested: ticketQuantity,
                available: ticketCategory.availableSeats
            });
        }
        // Create multiple tickets based on quantity
        const tickets = [];
        for (let i = 0; i < ticketQuantity; i++) {
            const ticket = new ticket_model_1.Ticket({
                event: eventId,
                user: req.user._id,
                category,
                price: ticketCategory.price,
                seatNumber: seatNumber ? `${seatNumber}-${i + 1}` : undefined,
                status: 'confirmed',
            });
            yield ticket.save();
            tickets.push(ticket);
        }
        // Update available seats - a quantity-nek megfelelően csökkentjük
        ticketCategory.availableSeats -= ticketQuantity;
        yield event.save();
        // Ha csak egy jegyet vásároltak, adjuk vissza azt, egyébként az összes jegyet
        res.status(201).json(ticketQuantity === 1 ? tickets[0] : tickets);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.purchaseTicket = purchaseTicket;
const getUserTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tickets = yield ticket_model_1.Ticket.find({ user: req.user._id })
            .populate('event', 'title date location')
            .sort({ purchaseDate: -1 });
        res.json(tickets);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getUserTickets = getUserTickets;
const getTicketById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield ticket_model_1.Ticket.findById(req.params.id)
            .populate('event', 'title date location')
            .populate('user', 'firstName lastName email');
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        // Check if user is the owner or event organizer
        const event = yield event_model_1.Event.findById(ticket.event);
        if (ticket.user.toString() !== req.user._id.toString() &&
            (event === null || event === void 0 ? void 0 : event.organizer.toString()) !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to view this ticket' });
        }
        res.json(ticket);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getTicketById = getTicketById;
const cancelTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ticket = yield ticket_model_1.Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        // Check if user is the owner
        if (ticket.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to cancel this ticket' });
        }
        // Update ticket status
        ticket.status = 'cancelled';
        yield ticket.save();
        // Update available seats
        const event = yield event_model_1.Event.findById(ticket.event);
        if (event) {
            const category = event.ticketCategories.find((cat) => cat.name === ticket.category);
            if (category) {
                category.availableSeats += 1;
                yield event.save();
            }
        }
        res.json({ message: 'Ticket cancelled successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.cancelTicket = cancelTicket;
