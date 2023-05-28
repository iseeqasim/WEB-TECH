const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  movie: {
    type: String,
    required: true
  },
  cinema: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  tickets: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
