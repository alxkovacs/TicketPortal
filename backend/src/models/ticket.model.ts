import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
  event: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  category: string;
  price: number;
  seatNumber?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    seatNumber: String,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema); 