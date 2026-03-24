const mongoose = require('mongoose');

const TalukaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  // Store an array of place IDs to reference them easily
  places: [{ type: String }],
}, {
  timestamps: true,
});

module.exports = mongoose.models.Taluka || mongoose.model('Taluka', TalukaSchema);
