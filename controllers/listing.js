const Listing = require("../models/listing.js");
const OpenCage = require('opencage-api-client');

module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("./listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing Does Not Exist");
        res.redirect("/listings");
    }
    console.log(listing);
    const similarListings = await Listing.find({
        location: listing.location,
        _id: { $ne: listing._id }
    }).limit(6);
    res.render("./listings/show.ejs", { listing, currUser: req.user ,similarListings});
};



module.exports.createListing = async (req, res) => {
    const location = req.body.listing.location; // Address from the form

    // Call OpenCage Geocoder API
    const geocodeResponse = await OpenCage.geocode({ q: location, key: process.env.OPENCAGE_API_KEY });

    // Check for geocoding result
    if (geocodeResponse.results.length > 0) {
        const coordinates = geocodeResponse.results[0].geometry;
        console.log("Coordinates: ", coordinates);

        // If geocoding is successful, store it in the listing
        let url = req.file.url;
        let filename = req.file.public_id;

        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = {
            type: "Point",
            coordinates: [coordinates.lng, coordinates.lat] // Store [longitude, latitude]
        };

        // Save the listing
        let saved = await newListing.save();
        console.log(saved.geometry);
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } else {
        req.flash("error", "Could not find location");
        res.redirect("/listings/new");
    }
};



module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing Does Not Exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/h_200");

    res.render("./listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.file) {
        let url = req.file.url;
        let filename = req.file.public_id;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}