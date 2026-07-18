import express from 'express';
import Booking from '../models/Booking.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to check authentication
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Book a slot with duplicate booking checks
router.post('/', auth, async (req, res) => {
  const { stationId, slot, date } = req.body;
  try {
    const existingBooking = await Booking.findOne({ stationId, slot, date });
    if (existingBooking) {
      return res.status(400).json({ msg: 'This slot is already booked for the selected date.' });
    }

    const newBooking = new Booking({ userId: req.user.id, stationId, slot, date });
    await newBooking.save();
    res.json({ msg: 'Booking confirmed successfully!', booking: newBooking });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Fetch all booked slots for a station on a specific date
router.get('/booked-slots', async (req, res) => {
  const { stationId, date } = req.query;
  try {
    const bookings = await Booking.find({ stationId, date });
    const bookedSlots = bookings.map(b => b.slot);
    res.json(bookedSlots);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router;
