const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env.local' });
const Place = require('./models/Place');

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Place.updateOne(
    { id: 'pawankhind-shahuwadi' },
    { $set: { image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Radhanagari_Wildlife_Sanctuary.jpg/1280px-Radhanagari_Wildlife_Sanctuary.jpg' } }
  );
  console.log('Fixed Pawankhind image URL');
  await mongoose.disconnect();
}

fix().catch(console.error);
