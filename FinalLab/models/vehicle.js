const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registration_number: String,
  make: String,
  model: String,
  color: String,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
