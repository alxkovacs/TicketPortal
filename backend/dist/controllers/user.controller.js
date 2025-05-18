"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizerEvents = exports.changePassword = exports.updateProfile = void 0;
const user_model_1 = require("../models/user.model");
const event_model_1 = require("../models/event.model");
const express_validator_1 = require("express-validator");
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { firstName, lastName, email } = req.body;
        const userId = req.user._id;
        // Check if email is already taken by another user
        if (email) {
            const existingUser = yield user_model_1.User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already taken' });
            }
        }
        const user = yield user_model_1.User.findByIdAndUpdate(userId, { $set: { firstName, lastName, email } }, { new: true, select: '-password' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.updateProfile = updateProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { currentPassword, newPassword } = req.body;
        const user = yield user_model_1.User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check current password
        const isMatch = yield user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }
        // Update password
        user.password = newPassword;
        yield user.save();
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.changePassword = changePassword;
const getOrganizerEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield event_model_1.Event.find({ organizer: req.user._id })
            .sort({ date: 1 });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getOrganizerEvents = getOrganizerEvents;
