require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/Place');
const fs = require('fs');
const path = require('path');

async function fixMissingWithPlaceholder() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kolhapur-tourism');
    
    const places = await Place.find();
    const publicDir = path.join(__dirname, '..', 'public');
    const placeholderPath = path.join(publicDir, 'placeholder.jpg');
    
    if (!fs.existsSync(placeholderPath)) {
      console.error('Error: public/placeholder.jpg not found!');
      process.exit(1);
    }
    
    let fixedCount = 0;
    
    places.forEach(place => {
      if (!place.image) return;
      
      const imgName = place.image.startsWith('/') ? place.image.substring(1) : place.image;
      const fullPath = path.join(publicDir, imgName);
      
      if (!fs.existsSync(fullPath)) {
        fs.copyFileSync(placeholderPath, fullPath);
        console.log(`Fixed: ${imgName} (for ${place.name})`);
        fixedCount++;
      }
    });
    
    console.log(`Successfully fixed ${fixedCount} missing images with placeholders.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixMissingWithPlaceholder();
