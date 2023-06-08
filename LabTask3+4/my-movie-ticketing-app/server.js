const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user'); // Require your User model
const Ticket = require('./models/Ticket');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'email', // Assuming the email is used as the username field
  passwordField: 'password' // Assuming the password field is named 'password'
}, (email, password, done) => {
  // Find the user by email in the database
  User.findOne({ email: email }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Invalid email or password' });
    }
    // Validate the password
    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }
      return done(null, user); // Authentication successful
    });
  });
}));

// Serialize and deserialize user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//PRG
app.get('/map', (req, res) => {
  Ticket.find()
    .then(tickets => {
      res.render('map', { tickets: tickets });
    })
    .catch(error => {
      res.status(500).json({ error: 'Error retrieving tickets' });
    });
});

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/Cinetick', {
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
const TicketsUpRouter = require('./routes/TicketsManage');
const apiRouter = require('./routes/api');
const authRoutes = require('./routes/auth');

app.use('/', homeRouter);
app.use('/home', homeRouter);
app.use('/QT', quickTicketsRouter);
app.use('/Contact', contactRouter);
app.use('/Signin', signInRouter);
app.use('/Signup', signUpRouter);
app.use('/TicketsManage', TicketsUpRouter);
app.use('/api', apiRouter);
app.use('/', authRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
