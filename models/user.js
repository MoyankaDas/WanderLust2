const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    virtualBank: {
        type: Number,
        default: 100000  // ₹1,00,000
    },
    
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],

    isAdmin: { type: Boolean, default: false } ,// ✅ NEW

   
})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;