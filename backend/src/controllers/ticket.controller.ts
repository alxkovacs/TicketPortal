import { Request, Response } from 'express';
import { Ticket } from '../models/ticket.model';
import { Event } from '../models/event.model';
import { validationResult } from 'express-validator';

export const purchaseTicket = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId, category, seatNumber, quantity = 1 } = req.body;
    
    // Biztosítsuk, hogy a mennyiség szám és legalább 1
    const ticketQuantity = Math.max(1, Number(quantity) || 1);

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Find the ticket category
    const ticketCategory = event.ticketCategories.find(
      (cat) => cat.name === category
    );
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
      const ticket = new Ticket({
        event: eventId,
        user: (req as any).user._id,
        category,
        price: ticketCategory.price,
        seatNumber: seatNumber ? `${seatNumber}-${i + 1}` : undefined,
        status: 'confirmed',
      });
      
      await ticket.save();
      tickets.push(ticket);
    }
    
    // Update available seats - a quantity-nek megfelelően csökkentjük
    ticketCategory.availableSeats -= ticketQuantity;
    await event.save();

    // Ha csak egy jegyet vásároltak, adjuk vissza azt, egyébként az összes jegyet
    res.status(201).json(ticketQuantity === 1 ? tickets[0] : tickets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getUserTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find({ user: (req as any).user._id })
      .populate('event', 'title date location')
      .sort({ purchaseDate: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('event', 'title date location')
      .populate('user', 'firstName lastName email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check if user is the owner or event organizer
    const event = await Event.findById(ticket.event);
    if (
      ticket.user.toString() !== (req as any).user._id.toString() &&
      event?.organizer.toString() !== (req as any).user._id.toString()
    ) {
      return res.status(403).json({ error: 'Not authorized to view this ticket' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const cancelTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check if user is the owner
    if (ticket.user.toString() !== (req as any).user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to cancel this ticket' });
    }

    // Update ticket status
    ticket.status = 'cancelled';
    await ticket.save();

    // Update available seats
    const event = await Event.findById(ticket.event);
    if (event) {
      const category = event.ticketCategories.find(
        (cat) => cat.name === ticket.category
      );
      if (category) {
        category.availableSeats += 1;
        await event.save();
      }
    }

    res.json({ message: 'Ticket cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 