const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/', (req, res) => {
  res.render('Signin');
});


router.post('/', passport.authenticate('local', {
  successRedirect: '/TicketsManage', 
  failureRedirect: '/Signin?error=invalid-credentials', 
  failureFlash: true 
}));

module.exports = router;
