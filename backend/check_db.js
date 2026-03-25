require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    console.log('Checking places...');
    const places = await Place.find();
    console.log(`Found ${places.length} places`);
    // Check for kagal-lake specifically
    const kagal = places.find(p => p.id === 'kagal-lake');
    if (kagal) {
      console.log('Kagal Lake data:', JSON.stringify(kagal, null, 2));
    } else {
      console.log('Kagal Lake not found in DB');
    }
    process.exit(0);
  } catch (err) {
    console.error('Check failed:', err);
    process.exit(1);
  }
}

check();
