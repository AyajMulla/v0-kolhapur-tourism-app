const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env.local' });
const Place = require('./models/Place');

// Map missing local images -> real Wikipedia/Wikimedia URLs
const IMAGE_MAP = {
  '/pohale-caves-karveer.jpg':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Kolhapur_City_panorama.jpg/1280px-Kolhapur_City_panorama.jpg',
  '/jaysingrao-talav-kagal.jpg':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Kolhapur_city_view.jpg/1280px-Kolhapur_city_view.jpg',
  '/bahubali-statue-hatkanangle.jpg':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Panchganga_river_kolhapur.jpg/1280px-Panchganga_river_kolhapur.jpg',
  '/ramtirth-waterfall-ajara.jpg':
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Radhanagari_Wildlife_Sanctuary.jpg/1280px-Radhanagari_Wildlife_Sanctuary.jpg',
};

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  for (const [localPath, remoteUrl] of Object.entries(IMAGE_MAP)) {
    const result = await Place.updateMany(
      { image: localPath },
      { $set: { image: remoteUrl } }
    );
    console.log(`${localPath} → updated ${result.modifiedCount} record(s)`);
  }

  // Also fix any image field that starts with / and points to a non-existent local file pattern
  // that matches these newly imported places
  const fs = require('fs');
  const path = require('path');
  const publicDir = path.join(__dirname, '../public');

  const allPlaces = await Place.find({ image: /^\// });
  let fixedCount = 0;
  for (const place of allPlaces) {
    const imgFile = path.join(publicDir, place.image);
    if (!fs.existsSync(imgFile)) {
      await Place.updateOne(
        { _id: place._id },
        { $set: { image: '/placeholder.jpg' } }
      );
      console.log(`  Fixed missing: ${place.id} → ${place.image} → /placeholder.jpg`);
      fixedCount++;
    }
  }
  console.log(`\nTotal records with broken local paths fixed: ${fixedCount}`);

  await mongoose.disconnect();
  console.log('Done!');
}

fix().catch(err => { console.error(err); process.exit(1); });
