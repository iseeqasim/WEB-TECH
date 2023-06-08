const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: Number,
    required: true,
  },
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

const Ticket = mongoose.model('Ticket', ticketSchema);

// Create a new ticket
// const newTicket = new Ticket({
//   ticketId: 001,
//   movie: 'Avengers: Endgame',
//   cinema: 'Cineplex',
//   date: new Date('2023-06-01'),
//   time: '18:00',
//   tickets: 2
// });

// // Save the ticket to the database
// newTicket.save()
//   .then(savedTicket => {
//     console.log('Ticket saved:', savedTicket);
//   })
//   .catch(error => {
//     console.error('Error saving ticket:', error);
//   });

module.exports = Ticket;
