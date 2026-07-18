import mongoose from 'mongoose';

const StationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  chargerType: { type: String, enum: ['CCS2', 'Type2', 'CHAdeMO'], required: true },
  slots: { type: [String], default: ['09:00', '12:00', '15:00', '18:00'] }
});

StationSchema.index({ location: '2dsphere' });
export default mongoose.model('Station', StationSchema);
