import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';

// Dynamic import of CJS models
import PlaceModel from './models/Place.js';
import HotelModel from './models/Hotel.js';
import RestaurantModel from './models/Restaurant.js';
import TalukaModel from './models/Taluka.js';

// The local data to migrate
import { kolhapurTalukas, kolhapurRestaurants, kolhapurHotels } from '../data/tourism-data.backup.js';

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Non-destructive seeding: Use upsert instead of deleteMany
    console.log('Starting smart seeding (preserving existing edits)...');

    // 1. Insert Talukas and Places
    for (const taluka of kolhapurTalukas) {
      // Upsert Taluka record
      const placeIds = taluka.places.map(p => p.id);
      
      await TalukaModel.updateOne(
        { id: taluka.id },
        { 
          $setOnInsert: { 
            name: taluka.name,
            description: taluka.description,
          },
          $set: { 
            image: taluka.image,
            places: placeIds
          }
        },
        { upsert: true }
      );

      // Upsert individual Place records
      for (const place of taluka.places) {
        await PlaceModel.updateOne(
          { id: place.id },
          {
            $setOnInsert: {
              name: place.name,
              description: place.description,
            },
            $set: {
              image: place.image,
              category: place.category,
              rating: place.rating,
              visitDuration: place.visitDuration || "",
              bestTimeToVisit: place.bestTimeToVisit || "",
              coordinates: place.coordinates || [],
              nearbyRestaurants: place.nearbyRestaurants || [],
              nearbyHotels: place.nearbyHotels || [],
              talukaName: taluka.name,
              talukaId: taluka.id,
              visitorTips: place.visitorTips || []
            }
          },
          { upsert: true }
        );
      }
    }
    console.log(`Successfully upserted ${kolhapurTalukas.length} Talukas and all their Places`);

    // 2. Upsert Restaurants
    for (const restaurant of kolhapurRestaurants) {
      await RestaurantModel.updateOne(
        { id: restaurant.id },
        { $set: restaurant },
        { upsert: true }
      );
    }
    console.log(`Successfully upserted ${kolhapurRestaurants.length} Restaurants`);

    // 3. Upsert Hotels
    for (const hotel of kolhapurHotels) {
      await HotelModel.updateOne(
        { id: hotel.id },
        { $set: hotel },
        { upsert: true }
      );
    }
    console.log(`Successfully upserted ${kolhapurHotels.length} Hotels`);

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
