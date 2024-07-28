const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const adminCheck = require('../middleware/adminCheck');
const Website = require('../models/Website');

const router = express.Router();

// Create a website (Admin only)
router.post(
    '/',
    [
        auth,
        adminCheck,
        [
            check('name', 'Name is required').not().isEmpty(),
            check('link', 'Link is required').isURL(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, link } = req.body;

        try {
            const newWebsite = new Website({
                name,
                link,
            });

            const website = await newWebsite.save();

            res.json({ id: website._id, name: website.name });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Read all websites
router.get('/', auth, async (req, res) => {
    try {
        const websites = await Website.find().select('name _id link');
        res.json(websites);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a website (Admin only)
router.put(
    '/:id',
    [
        auth,
        adminCheck,
        [
            check('name', 'Name is required').not().isEmpty(),
            check('link', 'Link is required').isURL(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, link } = req.body;

        try {
            let website = await Website.findById(req.params.id);

            if (!website) {
                return res.status(404).json({ msg: 'Website not found' });
            }

            website.name = name;
            website.link = link;

            await website.save();

            res.json({ id: website._id, name: website.name, link: website.link });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Delete a website (Admin only)
router.delete('/:id', [auth, adminCheck], async (req, res) => {
    try {
        const website = await Website.findById(req.params.id);

        if (!website) {
            return res.status(404).json({ msg: 'Website not found' });
        }

        await Website.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Website removed', id: website._id, name: website.name });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;