require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');
const fs = require('fs');
const path = require('path');

async function findMissingImages() {
  try {
    // Note: Adjusting the path to reach .env.local in the root if necessary
    // But since this is run from backend/, it might need help finding it.
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kolhapur-tourism');
    
    const places = await Place.find();
    console.log(`Found ${places.length} places in database.`);
    
    const publicDir = path.join(__dirname, '..', 'public');
    const missing = [];
    
    places.forEach(place => {
      if (!place.image) return;
      
      // Clean up the image path (remove leading slash)
      const imgName = place.image.startsWith('/') ? place.image.substring(1) : place.image;
      const fullPath = path.join(publicDir, imgName);
      
      if (!fs.existsSync(fullPath)) {
        missing.push({
          id: place.id,
          name: place.name,
          image: imgName,
          taluka: place.talukaName
        });
      }
    });
    
    console.log(`Found ${missing.length} missing images.`);
    if (missing.length > 0) {
      console.log('--- MISSING IMAGES ---');
      console.log(JSON.stringify(missing, null, 2));
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

findMissingImages();
