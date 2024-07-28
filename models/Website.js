const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Website Schema
const WebsiteSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Website', WebsiteSchema);