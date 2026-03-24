import 'dotenv/config';
import mongoose from 'mongoose';

// Dynamic import of CJS models
import PlaceModel from './models/Place.js';
import HotelModel from './models/Hotel.js';
import RestaurantModel from './models/Restaurant.js';
import TalukaModel from './models/Taluka.js';

// The local data to migrate
import { kolhapurTalukas, kolhapurRestaurants, kolhapurHotels } from '../data/tourism-data.js';

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await PlaceModel.deleteMany({});
    await HotelModel.deleteMany({});
    await RestaurantModel.deleteMany({});
    await TalukaModel.deleteMany({});
    console.log('Cleared existing collections');

    // 1. Insert Talukas and Places
    for (const taluka of kolhapurTalukas) {
      // Create Taluka record (without embedding full place objects, just the place IDs)
      const placeIds = taluka.places.map(p => p.id);
      
      await TalukaModel.create({
        id: taluka.id,
        name: taluka.name,
        description: taluka.description,
        image: taluka.image,
        places: placeIds
      });

      // Create individual Place records
      for (const place of taluka.places) {
        await PlaceModel.create({
          id: place.id,
          name: place.name,
          description: place.description,
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
        });
      }
    }
    console.log(`Successfully migrated ${kolhapurTalukas.length} Talukas and all their Places`);

    // 2. Insert Restaurants
    if (kolhapurRestaurants && kolhapurRestaurants.length > 0) {
       for (const rest of kolhapurRestaurants) {
         await RestaurantModel.create({
            id: rest.id,
            name: rest.name,
            cuisine: rest.cuisine,
            rating: rest.rating,
            priceRange: rest.priceRange,
            specialties: rest.specialties || [],
            address: rest.address,
            phone: rest.phone,
            openHours: rest.openHours
         });
       }
       console.log(`Successfully migrated ${kolhapurRestaurants.length} Restaurants`);
    }

    // 3. Insert Hotels
    if (kolhapurHotels && kolhapurHotels.length > 0) {
       for (const hotel of kolhapurHotels) {
         await HotelModel.create({
            id: hotel.id,
            name: hotel.name,
            category: hotel.category,
            rating: hotel.rating,
            priceRange: hotel.priceRange,
            amenities: hotel.amenities || [],
            address: hotel.address,
            phone: hotel.phone,
            website: hotel.website
         });
       }
       console.log(`Successfully migrated ${kolhapurHotels.length} Hotels`);
    }

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
