const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/latestdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Import the Ticket model
const Ticket = require('./models/Ticket');

// Create a new ticket
app.post('/tickets', (req, res) => {
  const { movie, cinema, date, time, tickets } = req.body;
  const newTicket = new Ticket({
    movie,
    cinema,
    date,
    time,
    tickets
  });

  newTicket.save()
    .then(savedTicket => {
      res.status(201).json(savedTicket);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error saving ticket' });
    });
});

// Retrieve all tickets
app.get('/tickets', (req, res) => {
  Ticket.find()
    .then(tickets => {
      res.json(tickets);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error retrieving tickets' });
    });
});

// Retrieve a single ticket by ID
app.get('/tickets/:id', (req, res) => {
  const { id } = req.params;

  Ticket.findById(id)
    .then(ticket => {
      if (ticket) {
        res.json(ticket);
      } else {
        res.status(404).json({ error: 'Ticket not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Error retrieving ticket' });
    });
});

// Update a ticket by ID
app.put('/tickets/:id', (req, res) => {
  const { id } = req.params;
  const { movie, cinema, date, time, tickets } = req.body;

  Ticket.findByIdAndUpdate(id, { movie, cinema, date, time, tickets }, { new: true })
    .then(updatedTicket => {
      if (updatedTicket) {
        res.json(updatedTicket);
      } else {
        res.status(404).json({ error: 'Ticket not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Error updating ticket' });
    });
});

// Delete a ticket by ID
app.delete('/tickets/:id', (req, res) => {
  const { id } = req.params;

  Ticket.findByIdAndDelete(id)
    .then(deletedTicket => {
      if (deletedTicket) {
        res.json({ message: 'Ticket deleted successfully' });
      } else {
        res.status(404).json({ error: 'Ticket not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Error deleting ticket' });
    });
});

// Define routes here
const homeRouter = require('./routes/Home');
const quickTicketsRouter = require('./routes/QT');
const contactRouter = require('./routes/Contact');
const signInRouter = require('./routes/Signin');
const signUpRouter = require('./routes/Signup');

app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/QT', quickTicketsRouter);
app.use('/Contact', contactRouter);
app.use('/Signin', signInRouter);
app.use('/Signup', signUpRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
