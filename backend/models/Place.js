const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, required: true },
  visitDuration: { type: String },
  bestTimeToVisit: { type: String },
  coordinates: { type: [Number] },
  nearbyRestaurants: [{ type: String }],
  nearbyHotels: [{ type: String }],
  talukaName: { type: String },
  talukaId: { type: String },
  visitorTips: [{ type: String }]
}, {
  timestamps: true,
});

module.exports = mongoose.models.Place || mongoose.model('Place', PlaceSchema);
