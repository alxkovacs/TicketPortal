export interface Event {
  id: string;
  title: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  availableTickets: number;
  totalTickets: number;
  imageUrl: string;
  category: string;
  organizer: string;
} 