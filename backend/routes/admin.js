const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const Place = require('../models/Place');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');

// Apply both auth and admin middlewares to EVERY route in this file
router.use(auth, admin);

// --- PLACES CRUD ---
router.post('/places', async (req, res) => {
  try {
    const newPlace = new Place(req.body);
    await newPlace.save();
    res.json(newPlace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/places/:id', async (req, res) => {
  try {
    const place = await Place.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!place) return res.status(404).json({ msg: 'Place not found' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/places/:id', async (req, res) => {
  try {
    const place = await Place.findOneAndDelete({ id: req.params.id });
    if (!place) return res.status(404).json({ msg: 'Place not found' });
    res.json({ msg: 'Place deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- HOTELS CRUD ---
router.post('/hotels', async (req, res) => {
  try {
    const newHotel = new Hotel(req.body);
    await newHotel.save();
    res.json(newHotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndDelete({ id: req.params.id });
    if (!hotel) return res.status(404).json({ msg: 'Hotel not found' });
    res.json({ msg: 'Hotel deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- RESTAURANTS CRUD ---
router.post('/restaurants', async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.json(newRestaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/restaurants/:id', async (req, res) => {
  try {
    const rest = await Restaurant.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!rest) return res.status(404).json({ msg: 'Restaurant not found' });
    res.json(rest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/restaurants/:id', async (req, res) => {
  try {
    const rest = await Restaurant.findOneAndDelete({ id: req.params.id });
    if (!rest) return res.status(404).json({ msg: 'Restaurant not found' });
    res.json({ msg: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
