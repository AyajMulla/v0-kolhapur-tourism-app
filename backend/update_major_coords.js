require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');

const majorCoords = [
  { id: 'mahalaxmi-temple', coords: [16.6944, 74.2214] },
  { id: 'panhala-fort', coords: [16.8111, 74.1111] },
  { id: 'new-palace', coords: [16.7119, 74.2285] },
  { id: 'rankala-lake', coords: [16.6917, 74.2147] },
  { id: 'jyotiba-temple', coords: [16.7972, 74.1750] },
  { id: 'narsobawadi', coords: [16.6853, 74.5972] },
  { id: 'kopeshwar-temple', coords: [16.5911, 74.6547] },
  { id: 'radhanagari-dam', coords: [16.4167, 73.9833] },
  { id: 'dajipur-bison-reserve', coords: [16.4000, 73.9000] },
  { id: 'gaganbawada-hills', coords: [16.5500, 73.8333] },
  { id: 'kaneri-math', coords: [16.6341, 74.2541] },
  { id: 'vishalgad-fort', coords: [16.8741, 73.7433] }
];

async function updateCoords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kolhapur-tourism');
    
    for (const item of majorCoords) {
      const result = await Place.findOneAndUpdate(
        { id: item.id },
        { coordinates: item.coords },
        { new: true }
      );
      if (result) {
        console.log(`Updated coordinates for ${result.name}`);
      } else {
        console.log(`Place with ID ${item.id} not found`);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateCoords();
