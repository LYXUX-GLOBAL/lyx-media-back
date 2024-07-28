const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Package Schema
const PackageSchema = new Schema({
    websiteId: {
        type: Schema.Types.ObjectId,
        ref: 'Website',
        required: true,
    },
    socialMedia: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    minUnit: {
        type: Number,
        required: true,
    },
    maxUnit: {
        type: Number,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    header: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Package', PackageSchema);