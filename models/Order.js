const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Order Schema
const OrderSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    packageId: {
        type: Schema.Types.ObjectId,
        ref: 'Package',
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    totalUnit: {
        type: Number,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', OrderSchema);