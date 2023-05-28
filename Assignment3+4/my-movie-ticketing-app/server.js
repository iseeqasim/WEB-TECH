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

// Define routes here
const homeRouter = require('./routes/Home');
const quickTicketsRouter = require('./routes/QT');
const contactRouter = require('./routes/Contact');
const signInRouter = require('./routes/Signin');
const signUpRouter = require('./routes/Signup');

app.use('/Home', homeRouter);
app.use('/QT', quickTicketsRouter);
app.use('/Contact', contactRouter);
app.use('/Signin', signInRouter);
app.use('/Signup', signUpRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
