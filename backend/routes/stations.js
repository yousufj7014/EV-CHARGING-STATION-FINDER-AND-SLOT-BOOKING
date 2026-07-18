import express from 'express';
import Station from '../models/Station.js';

const router = express.Router();

// Get stations near a specific location
router.get('/nearby', async (req, res) => {
  const { lng, lat, maxDistance = 5000 } = req.query; // maxDistance in meters
  try {
    const stations = await Station.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    res.json(stations);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create a station (for setup/seeding)
router.post('/', async (req, res) => {
  try {
    const newStation = new Station(req.body);
    const station = await newStation.save();
    res.json(station);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router;
