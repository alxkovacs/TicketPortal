import { Event } from '../../events/models/event.model';

export interface Ticket {
  id: string;
  event: Event;
  quantity: number;
  price: number;
  status: 'active' | 'cancelled';
  createdAt: Date;
}

export enum TicketStatus {
  Active = 'active',
  Cancelled = 'cancelled',
  Refunded = 'refunded'
} 