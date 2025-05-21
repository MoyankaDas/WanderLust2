const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const Booking = require('../models/booking');
const packages = require('../data/packages');
const User = require('../models/user'); // e.g., array of objects
let { isLoggedIn } = require('../middleware');

isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl; // Save path to return after login
    return res.redirect('/login');
  }
  next();
};


// Show customize form
router.get('/listings/:id/customize', isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const bookings = await Booking.find({ listing: listing._id });
  const bookedDates = bookings.flatMap(b => {
    let current = new Date(b.checkIn);
    const end = new Date(b.checkOut);
    const blocked = [];
    while (current <= end) {
      blocked.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return blocked;
  });
  const user = await User.findById(req.user._id);

  res.render('bookings/customize', { listing, packages, bookedDates, virtualBank: user.virtualBank});
});

router.post('/listings/:id/book', isLoggedIn, async (req, res) => {
  const listingId = req.params.id;
  const { package, customBedrooms, customBathrooms, customBedroomsManual, customBathroomsManual, price, phone,
    adults,
    children,
    orphans,
    pets } = req.body;
  const bookingPrice = package ? price : parseFloat(price); // Use price from package or manual customization
  const [checkIn, checkOut] = req.body.bookingDates.split(" to ");

  // Get user details and check balance
  const user = await User.findById(req.user._id);
  if (user.virtualBank < bookingPrice) {
    req.flash("error", "Insufficient funds in your virtual bank.");
    return res.redirect("/listings/${listingId}/customize");
  }


  // Deduct the booking price from user's virtual bank
  user.virtualBank = parseFloat(user.virtualBank) - parseFloat(bookingPrice);

  await user.save();

  const booking = new Booking({
    user: req.user._id,
    listing: listingId,
    package: package || "Custom",
    customBedrooms: package ? customBedrooms : customBedroomsManual,
    customBathrooms: package ? customBathrooms : customBathroomsManual,
    price: bookingPrice,
    checkIn,
    checkOut,
    phone,
    adults,
    children,
    orphans,
    pets,
  });

  await booking.save();
  console.log(booking);
  req.flash("success", "Booking Successfully");
  res.redirect('/listings');
});


// Edit form
router.get('/bookings/:id/edit', async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('listing');
  res.render('bookings/edit', { booking, packages });
});


// Update booking
router.post('/bookings/:id/update', async (req, res) => {
  const {
    package,
    customBedrooms,
    customBathrooms,
    phone,
    checkIn,
    checkOut,
    adults,
    children,
    orphans,
    pets,
    price
  } = req.body;

  // Package price map (adjust these values as needed)
  const packagePrices = {
    "Classic Honeymoon Package": 2500,
    "Family Fun Package": 2000,
    "Adventure Package": 3000,
    "Luxury Retreat Package": 4500
  };

  let Price = 0;

  // Parse the dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Calculate the number of days of stay
  const daysOfStay = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24));

  if (daysOfStay <= 0) {
    req.flash("error", "Invalid date range. Check-out must be after check-in.");
    return res.redirect("/bookings/${req.params.id}/edit");
  }

  // const guestCount =
  //     (parseInt(adults) || 0) +
  //     (parseInt(children) || 0) +
  //     (parseInt(orphans) || 0) +
  //     (parseInt(pets) || 0);

  const guestCount = parseInt(adults) + (parseInt(children) * 0.5) + (parseInt(orphans) * 0.3) + (parseInt(pets) * 0.2);
    
  if (package && packagePrices[package]) {
    // Use fixed price if a known package is selected
  Price = (packagePrices[package]+ guestCount * 300)* daysOfStay;
  } else {
    // Manual pricing logic
    const bedrooms = parseInt(customBedrooms) || 0;
    const bathrooms = parseInt(customBathrooms) || 0;
    const guestCount =
      (parseInt(adults) || 0) +
      (parseInt(children) || 0) +
      (parseInt(orphans) || 0) +
      (parseInt(pets) || 0);

    Price = (bedrooms * 1000 + bathrooms * 500 + guestCount * 300)* daysOfStay;
  }

  const user = await User.findById(req.user._id);

  // Deduct the booking price from user's virtual bank
  console.log(Price);
  console.log(price);
  console.log(user.virtualBank);
  user.virtualBank = (parseFloat(user.virtualBank) - parseFloat(Price)) + parseInt(price);
  await user.save();
  console.log(user.virtualBank);
  // Build update object dynamically
  const updateData = {
    package: package || null,
    price:Price,
    phone,
    checkIn,
    checkOut,
    adults,
    children,
    orphans,
    pets
  };

  if (!package || !packagePrices[package]) {
    // Only include customization if package is not selected
    updateData.customBedrooms = customBedrooms;
    updateData.customBathrooms = customBathrooms;
  } else {
    // If package is selected, clear custom fields
    updateData.customBedrooms = undefined;
    updateData.customBathrooms = undefined;
  }

  await Booking.findByIdAndUpdate(req.params.id, updateData);
  req.flash("success", "Booking Edited Successfully");
  res.redirect('/users/bookings');
});

// Delete booking and refund balance
router.post('/bookings/:id/delete', async (req, res) => {
  const bookingId = req.params.id;

  // Find the booking by its ID
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect('/users/bookings');
  }

  // Refund the user their balance
  const user = await User.findById(booking.user);
  
  // Refund the booking price to the user's virtual bank balance
  user.virtualBank += booking.price;

  // Save the updated user balance
  await user.save();

  // Optionally, you can mark the booking as canceled (e.g., update its status before deletion)
  booking.status = 'canceled';
  await booking.save();

  // Delete the booking
  await Booking.findByIdAndDelete(bookingId);

  // Show success message
  req.flash("success", "Booking canceled and balance refunded");

  // Redirect to user's bookings page
  res.redirect('/users/bookings');
});


module.exports = router;