require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');

async function findEmptyCoords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kolhapur-tourism');
    
    const places = await Place.find();
    const empty = places.filter(p => !p.coordinates || p.coordinates.length === 0 || (p.coordinates[0] === 0 && p.coordinates[1] === 0));
    
    console.log(`Found ${empty.length} places with missing/empty coordinates.`);
    empty.forEach(p => {
      console.log(`- ${p.name} (ID: ${p.id}, Taluka: ${p.talukaName})`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

findEmptyCoords();
