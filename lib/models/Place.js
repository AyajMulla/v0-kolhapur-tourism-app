import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, required: true },
  visitDuration: { type: String },
  bestTimeToVisit: { type: String },
  nearbyRestaurants: [{ type: String }],
  nearbyHotels: [{ type: String }],
  talukaName: { type: String },
  talukaId: { type: String }
}, {
  timestamps: true,
});

export default mongoose.models.Place || mongoose.model('Place', PlaceSchema);
