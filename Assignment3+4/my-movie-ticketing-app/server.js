const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static('public'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



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
      const response = {
        message: 'Ticket added successfully',
        ticket: savedTicket
      };
      const formattedResponse = JSON.stringify(response, null, 2);
      res.setHeader('Content-Type', 'application/json');
      res.send(formattedResponse);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error saving ticket' });
    });
});

// Retrieve all tickets
app.get('/tickets', (req, res) => {
  Ticket.find()
    .then(tickets => {
      const response = {
        ticket: tickets
      };
      const formattedResponse = JSON.stringify(response, null, 1);
      res.setHeader('Content-Type', 'application/json');
      res.send(formattedResponse);
    })
    .catch(error => {
      res.status(500).json({ error: 'Error retrieving tickets' });
    });
});

//Retrieve single ticket
app.post('/tickets/id', (req, res) => {
  const { ticketId } = req.body;
  
  Ticket.findOne({ ticketId: ticketId }) // Use 'ticketId' in the query
    .then(ticket => {
      if (ticket) {
        const response = {
          ticket: ticket
        };
        const formattedResponse = JSON.stringify(response, null, 1);
        res.setHeader('Content-Type', 'application/json');
        res.send(formattedResponse);
      } else {
        res.status(404).json({ error: 'Ticket not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Error retrieving ticket' });
    });
});

// Update a ticket by ID
app.post('/tickets/upd', (req, res) => {
  const { ticketId } = req.body;
  const { time, tickets } = req.body;

  Ticket.findOneAndUpdate({ ticketId: ticketId }, { time, tickets }, { new: true })
    .then(updatedTicket => {
      if (updatedTicket) {
        const response = {
          message: 'Ticket updated successfully',
          ticket: updatedTicket
        };
        const formattedResponse = JSON.stringify(response, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.send(formattedResponse);
      } else {
        res.status(404).json({ error: 'Ticket not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Error updating ticket' });
    });
});

// Delete a ticket by ID
app.post('/tickets/del', (req, res) => {
  const { ticketId } = req.body;

  Ticket.findOneAndDelete({ ticketId: ticketId })
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
const TicketsUpRouter = require('./routes/TicketsManage');

app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/QT', quickTicketsRouter);
app.use('/Contact', contactRouter);
app.use('/Signin', signInRouter);
app.use('/Signup', signUpRouter);
app.use('/TicketsManage', TicketsUpRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
