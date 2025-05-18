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
exports.deleteEvent = exports.updateEvent = exports.getEventById = exports.getEvents = exports.createEvent = void 0;
const event_model_1 = require("../models/event.model");
const ticket_model_1 = require("../models/ticket.model");
const express_validator_1 = require("express-validator");
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const event = new event_model_1.Event(Object.assign(Object.assign({}, req.body), { organizer: req.user._id }));
        yield event.save();
        res.status(201).json(event);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.createEvent = createEvent;
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield event_model_1.Event.find({ isActive: true })
            .populate('organizer', 'firstName lastName email')
            .sort({ date: 1 });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getEvents = getEvents;
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_model_1.Event.findById(req.params.id)
            .populate('organizer', 'firstName lastName email');
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getEventById = getEventById;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const event = yield event_model_1.Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        // Check if user is the organizer
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this event' });
        }
        const updatedEvent = yield event_model_1.Event.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(updatedEvent);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield event_model_1.Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        // Check if user is the organizer or admin
        const isAdmin = req.user.role === 'admin';
        const isOrganizer = event.organizer.toString() === req.user._id.toString();
        if (!isAdmin && !isOrganizer) {
            return res.status(403).json({ error: 'Not authorized to delete this event' });
        }
        // 1. Először törüljük az összes jegyet, amely ehhez az eseményhez tartozik
        const deleteTicketsResult = yield ticket_model_1.Ticket.deleteMany({ event: req.params.id });
        console.log(`[BACKEND] Esemény törlése: ${event.title} (ID: ${req.params.id}). Törölt jegyek száma: ${deleteTicketsResult.deletedCount}`);
        // 2. Most törüljük magát az eseményt
        yield event_model_1.Event.findByIdAndDelete(req.params.id);
        // 3. Visszaadunk egy teljes információkkal ellátott választ
        res.json({
            message: 'Event deleted successfully',
            eventId: req.params.id,
            title: event.title,
            ticketsDeleted: deleteTicketsResult.deletedCount
        });
    }
    catch (error) {
        console.error('[BACKEND] Hiba az esemény törlése során:', error);
        res.status(500).json({ error: 'Server error', message: error.message });
    }
});
exports.deleteEvent = deleteEvent;
