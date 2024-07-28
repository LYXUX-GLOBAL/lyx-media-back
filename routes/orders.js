const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');
const Order = require('../models/Order');
const Package = require('../models/Package');
const User = require('../models/User');

const router = express.Router();

// Create an order
router.post(
    '/',
    [
        auth,
        [
            check('packageId', 'Package ID is required').not().isEmpty(),
            check('totalPrice', 'Total price is required').isFloat(),
            check('totalUnit', 'Total unit is required').isInt(),
            check('link', 'Link is required').isURL(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { packageId, totalPrice, totalUnit, link } = req.body;

        try {
            const package = await Package.findById(packageId);
            if (!package) {
                return res.status(404).json({ msg: 'Package not found' });
            }

            const newOrder = new Order({
                customerId: req.user.id,
                packageId,
                totalPrice,
                totalUnit,
                link,
                status: 'pending', // Default status
            });

            const order = await newOrder.save();

            res.json(order);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Read all orders (Admin only)
router.get('/', [auth, adminCheck], async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customerId', 'username email')
            .populate('packageId', 'name _id');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Read orders by customer (Customer only)
router.get('/myorders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user.id })
            .populate('packageId', 'name _id');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update order status (Admin only)
router.put(
    '/:id/status',
    [auth, adminCheck, [check('status', 'Status is required').isIn(['pending', 'completed', 'cancelled'])]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { status } = req.body;

        try {
            let order = await Order.findById(req.params.id);

            if (!order) {
                return res.status(404).json({ msg: 'Order not found' });
            }

            order.status = status;
            await order.save();

            res.json(order);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;