const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Listing = require("../models/listing"); // needed for wishlist display
const { isLoggedIn } = require("../middleware");

// Add/remove listing from wishlist
router.post("/wishlist/:listingId", isLoggedIn, async (req, res) => {
    const { listingId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.wishlist.indexOf(listingId);
    if (index > -1) {
        user.wishlist.splice(index, 1); // remove if exists
    } else {
        user.wishlist.push(listingId); // add if not exists
    }
    await user.save();
    res.redirect("back");
});

// Show wishlist page
router.get("/wishlist", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.render("users/wishlist.ejs", { listings: user.wishlist });
});

// DELETE wishlist item
router.delete("/wishlist/:id", isLoggedIn, async (req, res) => {
  const listingId = req.params.id;
  const user = req.user;

  try {
    await User.findByIdAndUpdate(user._id, {
      $pull: { wishlist: listingId },
    });
    req.flash("success", "Removed from wishlist.");
    res.redirect("/wishlist");
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to remove from wishlist.");
    res.redirect("/wishlist");
  }
});


module.exports = router;
