const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Ticket = require('../models/Ticket');


router.use(express.urlencoded({ extended: true }));
router.use(express.json());


//Create a new ticket
router.post('/tickets', (req, res) => {
  const { ticketId, movie, cinema, date, time, tickets } = req.body;
  const newTicket = new Ticket({
    ticketId,
    movie,
    cinema,
    date,
    time,
    tickets
  });

  newTicket.save()
    .then(savedTicket => {
      res.redirect('/map'); // Redirect to the map.ejs page //PRG
    })
    .catch(error => {
      res.status(500).json({ error: 'Error saving ticket' });
    });
});


// Retrieve all tickets
router.get('/tickets', (req, res) => {
  Ticket.find()
    .then(tickets => {
      res.render('map', { tickets: tickets }); 
    })
    .catch(error => {
      res.status(500).json({ error: 'Error retrieving tickets' });
    });
});

//Retrieve single ticket
router.post('/tickets/id', (req, res) => {
  const { ticketId } = req.body;
  Ticket.findOne({ ticketId: ticketId })
    .then(ticket => {
      if (ticket) {
        res.render('map', { tickets: [ticket] }); 
      } else {
        res.status(404).json({ error: 'Ticket not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Error retrieving ticket' });
    });
});


// Update a ticket by ID
router.post('/tickets/upd', (req, res) => {
  const { ticketId } = req.body;
  const { time, tickets } = req.body;

  Ticket.findOneAndUpdate({ ticketId: ticketId }, { time, tickets }, { new: true })
    .then(updatedTicket => {
      if (updatedTicket) {
        res.render('map', { tickets: [updatedTicket] }); 
      } else {
        res.status(404).json({ error: 'Ticket not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Error updating ticket' });
    });
});


// Delete a ticket by ID
router.post('/tickets/del', (req, res) => {
  const { ticketId } = req.body;
  Ticket.findOneAndDelete({ ticketId: ticketId })
    .then(deletedTicket => {
      if (deletedTicket) {
        res.redirect('/map');
      } else {
        res.status(404).json({ error: 'Ticket not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Error deleting ticket' });
    });
});

module.exports = router;
