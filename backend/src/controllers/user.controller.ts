import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Event } from '../models/event.model';
import { validationResult } from 'express-validator';

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email } = req.body;
    const userId = (req as any).user._id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already taken' });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { firstName, lastName, email } },
      { new: true, select: '-password' }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById((req as any).user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getOrganizerEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({ organizer: (req as any).user._id })
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 