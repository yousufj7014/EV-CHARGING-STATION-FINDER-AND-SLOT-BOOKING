import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
  slot: { type: String, required: true },
  date: { type: String, required: true } // Format: YYYY-MM-DD
});

export default mongoose.model('Booking', BookingSchema);
