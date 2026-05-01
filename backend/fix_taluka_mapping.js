const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env.local' });
const Hotel = require('./models/Hotel');
const Restaurant = require('./models/Restaurant');

const TALUKA_MAP = {
  // Hotels
  'sayaji-kolhapur': { id: 'kolhapur-city', name: 'Kolhapur City' },
  'pavilion-hotel': { id: 'kolhapur-city', name: 'Kolhapur City' },
  'panhala-resort': { id: 'panhala', name: 'Panhala' },
  'fort-view-hotel': { id: 'panhala', name: 'Panhala' },
  'radhanagari-eco-resort': { id: 'radhanagari', name: 'Radhanagari' },
  'bison-resort': { id: 'radhanagari', name: 'Radhanagari' },
  
  // Restaurants
  'dehati-restaurant': { id: 'kolhapur-city', name: 'Kolhapur City' },
  'parakh-thali': { id: 'kolhapur-city', name: 'Kolhapur City' },
  'panhala-pure-veg': { id: 'panhala', name: 'Panhala' },
  'fort-view-dhaba': { id: 'panhala', name: 'Panhala' }
};

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Update Hotels
  for (const [id, taluka] of Object.entries(TALUKA_MAP)) {
    await Hotel.updateOne(
      { id },
      { $set: { talukaId: taluka.id, talukaName: taluka.name } }
    );
    console.log(`Updated Hotel: ${id} -> ${taluka.name}`);
  }

  // Update Restaurants
  for (const [id, taluka] of Object.entries(TALUKA_MAP)) {
    await Restaurant.updateOne(
      { id },
      { $set: { talukaId: taluka.id, talukaName: taluka.name } }
    );
    console.log(`Updated Restaurant: ${id} -> ${taluka.name}`);
  }

  // For anything else, try to guess from address
  const hotels = await Hotel.find({ talukaName: { $exists: false } });
  for (const h of hotels) {
    if (h.address?.toLowerCase().includes('panhala')) {
      await Hotel.updateOne({ _id: h._id }, { $set: { talukaId: 'panhala', talukaName: 'Panhala' } });
    } else if (h.address?.toLowerCase().includes('kolhapur')) {
      await Hotel.updateOne({ _id: h._id }, { $set: { talukaId: 'kolhapur-city', talukaName: 'Kolhapur City' } });
    }
  }

  const restaurants = await Restaurant.find({ talukaName: { $exists: false } });
  for (const r of restaurants) {
    if (r.address?.toLowerCase().includes('panhala')) {
      await Restaurant.updateOne({ _id: r._id }, { $set: { talukaId: 'panhala', talukaName: 'Panhala' } });
    } else if (r.address?.toLowerCase().includes('kolhapur')) {
      await Restaurant.updateOne({ _id: r._id }, { $set: { talukaId: 'kolhapur-city', talukaName: 'Kolhapur City' } });
    }
  }

  await mongoose.disconnect();
  console.log('Done!');
}

fix().catch(console.error);
