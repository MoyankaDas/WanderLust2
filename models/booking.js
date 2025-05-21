const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  listing: { type: Schema.Types.ObjectId, ref: 'Listing' },
  package: String,
  customBedrooms: Number,
  customBathrooms: Number,
  price: Number,
  virtualBank: { type: Number, default: 100000 },
  cardNumber: String,
  expiry: String,
  cvv: String,
  accountNumber: String,
  ifsc: String,
  checkIn: Date,
  checkOut: Date,
  phone: String,
  adults: Number,
  children: Number,
  orphans: Number,
  pets: Number,
  createdAt: { type: Date, default: Date.now },
 
});

module.exports = mongoose.model('Booking', bookingSchema);
