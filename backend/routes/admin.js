const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Place = require('../models/Place');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');

// Apply both auth and admin middlewares to EVERY route in this file
router.use(auth, admin);

// --- USER MANAGEMENT (Admin Only) ---

// @route   GET /api/admin/users
// @desc    Get all admin users
router.get('/users', async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/admin/users/create-admin
// @desc    Create a new admin user (Restricted to existing admins)
router.post('/users/create-admin', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields (name, email, password)' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({
      msg: 'Admin user created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

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
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    const place = await Place.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
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
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    const hotel = await Hotel.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
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
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    const rest = await Restaurant.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
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
