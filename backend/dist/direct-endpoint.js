// Közvetlen jegy lekérési végpont JavaScript-ben
// Ezt a fájlt közvetlenül a dist mappába helyezzük, hogy azonnal használható legyen
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Ticket model közvetlen létrehozása MongoDB sémával
const ticketSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  purchaseDate: { type: Date, default: Date.now },
  seatNumber: { type: String }
}, {
  timestamps: true
});

// Ticket model regisztrálása, csak ha még nem létezik
const TicketModel = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

// Közvetlen API végpont minden jegy lekéréséhez - autentikáció nélkül
router.get('/tickets-direct', async (req, res) => {
  try {
    console.log('[BACKEND - DIRECT] Minden jegy lekérése kérés érkezett');
    const tickets = await TicketModel.find({}).sort({ purchaseDate: -1 });
    
    console.log(`[BACKEND - DIRECT] Összes talált jegy: ${tickets.length} db`);
    
    if (tickets.length > 0) {
      console.log('[BACKEND - DIRECT] Jegyek részletei:', tickets.map(t => ({
        id: t._id.toString(),
        kategoria: t.category,
        ar: t.price,
        statusz: t.status
      })));
    }
    
    res.json(tickets);
  } catch (error) {
    console.error('[BACKEND - DIRECT] Hiba a jegyek lekérése során:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

module.exports = router;
