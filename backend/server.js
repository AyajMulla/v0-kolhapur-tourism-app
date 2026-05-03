const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Place = require('./models/Place');
const Hotel = require('./models/Hotel');
const Restaurant = require('./models/Restaurant');
const Taluka = require('./models/Taluka');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));

app.get('/', (req, res) => {
  res.send('Kolhapur Tourism API is running...');
});

// GET Talukas
app.get('/api/talukas', async (req, res) => {
  try {
    const talukas = await Taluka.find();
    res.json(talukas);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch talukas' });
  }
});

// GET Places
app.get('/api/places', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    console.error('fetch places error:', err);
    res.status(500).json({ error: 'Failed to fetch places', details: err.message });
  }
});

// GET Hotels
app.get('/api/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// GET Restaurants
app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
