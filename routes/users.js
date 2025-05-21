const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Listing = require('../models/listing');
const User = require('../models/user');

// Example middleware
const isLoggedIn = (req, res, next) => {
  if (!req.user) return res.redirect('/login');
  next();
};

router.get('/bookings', isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('listing').populate('user');
  const user = await User.findById(req.user._id);
  res.render('users/bookings', { bookings, virtualBank: user.virtualBank });
});

module.exports = router;
