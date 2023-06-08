const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const { fname, lname, email, password } = req.body;

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect('/signup?error=user-exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fname,
      lname,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.redirect('/Signin');
  } catch (error) {
    console.error('Error during signup:', error);
    res.redirect('/signup?error=signup-failed');
  }
});

module.exports = router;
