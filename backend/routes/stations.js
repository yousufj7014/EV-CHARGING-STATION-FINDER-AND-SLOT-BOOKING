import express from 'express';
import Station from '../models/Station.js';

const router = express.Router();

// Get all stations
router.get('/', async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get nearby stations
router.get('/nearby', async (req, res) => {
  const { lng, lat, maxDistance = 5000 } = req.query;
  try {
    const stations = await Station.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    res.json(stations);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create station
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
