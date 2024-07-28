const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create OTP Schema
const OtpSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // OTP will automatically be deleted after 5 minutes
    },
});

module.exports = mongoose.model('Otp', OtpSchema);