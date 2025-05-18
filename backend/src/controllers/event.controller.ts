import { Request, Response } from 'express';
import { Event } from '../models/event.model';
import { Ticket } from '../models/ticket.model';
import { validationResult } from 'express-validator';

export const createEvent = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = new Event({
      ...req.body,
      organizer: (req as any).user._id,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ isActive: true })
      .populate('organizer', 'firstName lastName email')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName email');
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== (req as any).user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is the organizer or admin
    const isAdmin = (req as any).user.role === 'admin';
    const isOrganizer = event.organizer.toString() === (req as any).user._id.toString();
    
    if (!isAdmin && !isOrganizer) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    // 1. Először törüljük az összes jegyet, amely ehhez az eseményhez tartozik
    const deleteTicketsResult = await Ticket.deleteMany({ event: req.params.id });
    console.log(`[BACKEND] Esemény törlése: ${event.title} (ID: ${req.params.id}). Törölt jegyek száma: ${deleteTicketsResult.deletedCount}`);

    // 2. Most törüljük magát az eseményt
    await Event.findByIdAndDelete(req.params.id);

    // 3. Visszaadunk egy teljes információkkal ellátott választ
    res.json({ 
      message: 'Event deleted successfully', 
      eventId: req.params.id,
      title: event.title,
      ticketsDeleted: deleteTicketsResult.deletedCount
    });
  } catch (error) {
    console.error('[BACKEND] Hiba az esemény törlése során:', error);
    res.status(500).json({ error: 'Server error' });
  }
};