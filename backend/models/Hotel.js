const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, required: true },
  image: { type: String },
  priceRange: { type: String },
  amenities: [{ type: String }],
  address: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  talukaId: { type: String },
  talukaName: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);
