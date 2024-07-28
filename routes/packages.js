const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');
const Package = require('../models/Package');

const router = express.Router();

// Create a package
router.post(
    '/',
    [
        auth,
        adminCheck,
        [
            check('websiteId', 'Website ID is required').not().isEmpty(),
            check('socialMedia', 'Social media is required').not().isEmpty(),
            check('type', 'Type is required').not().isEmpty(),
            check('minUnit', 'Minimum units is required').isInt(),
            check('maxUnit', 'Maximum units is required').isInt(),
            check('unitPrice', 'Unit price is required').isFloat(),
            check('discount', 'Discount is required').isFloat(),
            check('header', 'Header is required').not().isEmpty(),
            check('description', 'Description is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            websiteId,
            socialMedia,
            type,
            minUnit,
            maxUnit,
            unitPrice,
            discount,
            header,
            description,
        } = req.body;

        try {
            const newPackage = new Package({
                websiteId,
                socialMedia,
                type,
                minUnit,
                maxUnit,
                unitPrice,
                discount,
                header,
                description,
            });

            const package = await newPackage.save();

            res.json(package);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Read all packages
router.get('/', auth, async (req, res) => {
    try {
        const packages = await Package.find().populate('websiteId', 'name _id');
        res.json(packages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Read a single package by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const package = await Package.findById(req.params.id).populate('websiteId', 'name _id');

        if (!package) {
            return res.status(404).json({ msg: 'Package not found' });
        }

        res.json(package);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a package
router.put(
    '/:id',
    [
        auth,
        adminCheck,
        [
            check('websiteId', 'Website ID is required').not().isEmpty(),
            check('socialMedia', 'Social media is required').not().isEmpty(),
            check('type', 'Type is required').not().isEmpty(),
            check('minUnit', 'Minimum units is required').isInt(),
            check('maxUnit', 'Maximum units is required').isInt(),
            check('unitPrice', 'Unit price is required').isFloat(),
            check('discount', 'Discount is required').isFloat(),
            check('header', 'Header is required').not().isEmpty(),
            check('description', 'Description is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            websiteId,
            socialMedia,
            type,
            minUnit,
            maxUnit,
            unitPrice,
            discount,
            header,
            description,
        } = req.body;

        try {
            let package = await Package.findById(req.params.id);

            if (!package) {
                return res.status(404).json({ msg: 'Package not found' });
            }

            package.websiteId = websiteId;
            package.socialMedia = socialMedia;
            package.type = type;
            package.minUnit = minUnit;
            package.maxUnit = maxUnit;
            package.unitPrice = unitPrice;
            package.discount = discount;
            package.header = header;
            package.description = description;

            await package.save();

            res.json(package);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Delete a package
router.delete('/:id', [auth, adminCheck], async (req, res) => {
    try {
        const package = await Package.findById(req.params.id);

        if (!package) {
            return res.status(404).json({ msg: 'Package not found' });
        }

        await package.remove();

        res.json({ msg: 'Package removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;