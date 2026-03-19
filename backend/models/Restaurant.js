const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, required: true },
  priceRange: { type: String },
  specialties: [{ type: String }],
  address: { type: String, required: true },
  phone: { type: String },
  openHours: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.models.Restaurant || mongoose.model('Restaurant', RestaurantSchema);
