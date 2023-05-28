const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('Contact'); // Replace 'page-name' with the appropriate EJS template name (without the file extension)
});

module.exports = router;
