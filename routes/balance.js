// routes/balance.js
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const { isLoggedIn } = require("../middleware");

// middleware/isAdmin.js
let isAdmin = function (req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("Access denied: Admins only");
  }
};


router.get("/balance-sheet", isLoggedIn, isAdmin, async (req, res) => {

  // Aggregate booking info by listing
  // const bookingSummary = await Booking.aggregate([
  //   {
  //     $group: {
  //       _id: "$listing",
  //       bookingCount: { $sum: 1 },
  //       packageName: { $first: "$package" } // get one package name
  //     }
  //   }
  // ]);

  // // Load related listings
  // const listingIds = bookingSummary.map(b => b._id);
  // const listings = await Listing.find({ _id: { $in: listingIds } });

  // // Combine data
  // const data = bookingSummary.map(summary => {
  //   const listing = listings.find(l => l._id.toString() === summary._id.toString());
  //   return {
  //     title: listing ? listing.title : "Unknown",
  //     bookings: summary.bookingCount,
  //     package: summary.packageName || "Custom"
  //   };
  // });

  // res.render("admin/balanceSheet", { listings: data });

  const bookings = await Booking.find({})
    .populate("listing", "title")  // only fetch title
    .populate("user", "username")  // only fetch username
    .sort({ date: -1 }); // most recent first

  const balanceData = bookings.map(booking => ({
    title: booking.listing?.title || "Unknown",
    package: booking.package || "Custom",
    totalPrice: booking.price || 0,
    bookingDate: booking.createdAt.toDateString(),
    username: booking.user?.username || "Unknown"
  }));

  const totalRevenue = balanceData.reduce((sum, b) => sum + b.totalPrice, 0);


  res.render("admin/balanceSheet", { bookings: balanceData, totalRevenue  });
});

module.exports = router;
