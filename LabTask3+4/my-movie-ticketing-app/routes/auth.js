const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

router.get('/signin', (req, res) => {
  res.render('Signin');
});

router.post('/signin', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/auth/signin');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/TicketsManage');
    });
  })(req, res, next);
});

router.get('/signup', (req, res) => {
  res.render('Signup');
});

router.post('/signup', async (req, res) => {
  const { fname, lname, email, password } = req.body;

  try {
    const newUser = new User({ fname, lname, email, password });

    await newUser.save();

    res.redirect('/auth/signin');
  } catch (err) {
    console.error(err);
    req.flash('error', 'User registration failed.');
    res.redirect('/auth/signup');
  }
});

// router.get('/logout', (req, res) => {
//   req.logout();
//   res.redirect('/signin');
// });

module.exports = router;
