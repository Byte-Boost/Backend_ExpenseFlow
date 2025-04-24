const mongoose = require('mongoose');

const ProjectPreferenceSchema = new mongoose.Schema({
  projectId: { type: Number, required: true, unique: true }, 
  refundLimit: Number,
  expenseLimit: Number,
  quantityValues: [{
    type: Map,
    of: Number
  }]
});

module.exports = mongoose.model('ProjectPreference', ProjectPreferenceSchema);
