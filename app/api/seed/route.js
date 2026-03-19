import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Place from '@/lib/models/Place';
import Restaurant from '@/lib/models/Restaurant';
import Hotel from '@/lib/models/Hotel';
import { touristPlaces, restaurants, hotels } from '@/data/tourism-data';

export async function GET() {
  try {
    await connectToDatabase();

    // Clear existing data to avoid duplicates on re-run
    await Place.deleteMany({});
    await Restaurant.deleteMany({});
    await Hotel.deleteMany({});

    // Insert new data
    await Place.insertMany(touristPlaces);
    await Restaurant.insertMany(restaurants);
    await Hotel.insertMany(hotels);

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Failed to seed database: ' + error.message }, { status: 500 });
  }
}
