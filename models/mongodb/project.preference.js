const mongoose = require('mongoose');

const ProjectPreferenceSchema = new mongoose.Schema({
  projectId: { type: Number, required: true, unique: true }, 
  colorTheme: String,
  managerName: String,
  priceLimit: Number,
  qtyPricePerUnit: Number
});

module.exports = mongoose.model('ProjectPreference', ProjectPreferenceSchema);
