// Alap interface a közös tulajdonságokkal
export interface EventBase {
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl?: string;
  organizer?: string;
  ticketCategories: TicketCategory[];
  availableTickets: number;
}

// Új esemény létrehozásához használt interface (ID nélkül)
export interface NewEvent extends EventBase {}

// Létező esemény kezeléséhez (ID-val)
export interface Event extends EventBase {
  _id: string;
}

export interface TicketCategory {
  _id: string;
  name: string;
  price: number;
  availableSeats: number; // Backend API az "availableSeats" nevet várja, nem "availableTickets"-et
} 