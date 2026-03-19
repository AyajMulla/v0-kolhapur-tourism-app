import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, required: true },
  priceRange: { type: String },
  amenities: [{ type: String }],
  address: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);
