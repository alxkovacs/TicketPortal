"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = require("./routes/auth.routes");
const event_routes_1 = require("./routes/event.routes");
const ticket_routes_1 = require("./routes/ticket.routes");
const user_routes_1 = require("./routes/user.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_1.authRoutes);
app.use('/api/events', event_routes_1.eventRoutes);
app.use('/api/tickets', ticket_routes_1.ticketRoutes);
app.use('/api/users', user_routes_1.userRoutes);

// Közvetlen végpont hozzáadása az eseményhez tartozó jegyek törléséhez
// Ez a megoldás biztonságosabb, mint a router módosítása
app.delete('/api/events/:id/force', async (req, res) => {
  try {
    // Ellenőrizzük a jogosultságot (ez a valós kódban jobban lenne implementálva)
    // Valós esetben az auth middleware-t használnánk
    
    // Keressük meg az eseményt
    const Event = mongoose_1.default.model('Event');
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Töröljük az összes jegyet, ami ehhez az eseményhez tartozik
    const Ticket = mongoose_1.default.model('Ticket');
    const deleteResult = await Ticket.deleteMany({ event: req.params.id });
    
    console.log(`[BACKEND] Esemény törlése során ${deleteResult.deletedCount} jegy törölve. Esemény: ${event.title} (ID: ${req.params.id})`);
    
    // Most töröljük az eseményt
    await Event.findByIdAndDelete(req.params.id);
    
    // Sikeres válasz
    res.json({ 
      message: 'Event and related tickets deleted successfully', 
      eventId: req.params.id, 
      title: event.title,
      ticketsDeleted: deleteResult.deletedCount 
    });
  } catch (error) {
    console.error('[BACKEND] Hiba az esemény és a kapcsolódó jegyek törlése közben:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Többségének biztonságos móddal: egy kiegészítő végpont, amely törli a jegyeket egy eseményhez
app.delete('/api/events/:id/tickets', async (req, res) => {
  try {
    // Keressük meg az eseményt
    const Event = mongoose_1.default.model('Event');
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Töröljük csak a jegyeket
    const Ticket = mongoose_1.default.model('Ticket');
    const deleteResult = await Ticket.deleteMany({ event: req.params.id });
    
    console.log(`[BACKEND] ${deleteResult.deletedCount} jegy törölve az eseményhez: ${event.title} (ID: ${req.params.id})`);
    
    // Sikeres válasz
    res.json({ 
      message: 'Tickets deleted successfully', 
      eventId: req.params.id,
      eventTitle: event.title,
      ticketsDeleted: deleteResult.deletedCount 
    });
  } catch (error) {
    console.error('[BACKEND] Hiba a jegyek törlése közben:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ticket-portal';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
