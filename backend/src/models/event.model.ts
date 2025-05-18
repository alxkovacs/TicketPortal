import mongoose, { Document, Schema } from 'mongoose';

export interface ITicketCategory {
  name: string;
  price: number;
  availableSeats: number;
  description?: string;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: mongoose.Types.ObjectId;
  ticketCategories: ITicketCategory[];
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ticketCategorySchema = new Schema<ITicketCategory>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0,
  },
  description: String,
});

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticketCategories: [ticketCategorySchema],
    imageUrl: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model<IEvent>('Event', eventSchema); 