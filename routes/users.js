const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth'); // Import auth middleware
const adminCheck = require('../middleware/adminCheck'); // Import adminCheck middleware
const User = require('../models/User');
const Otp = require('../models/Otp');
const sendOtpEmail = require('../mailer');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret';

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};

// Admin Signup Route with OTP
router.post('/admin/signup', async (req, res) => {
    const { username, email, password, otp } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Check if OTP is valid
        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        user = new User({
            username,
            email,
            password,
            role: 'admin',
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        await Otp.deleteOne({ email, otp });

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Admin Request OTP Route
router.post('/admin/request-otp', async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const otp = generateOtp();

        // Save OTP to database
        const otpEntry = new Otp({
            email,
            otp,
            createdAt: Date.now(),
        });
        await otpEntry.save();

        // Send OTP to admin email
        await sendOtpEmail(otp, 'info@lyxux.com');

        res.json({ msg: 'OTP sent to admin email' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Regular User Signup Route without OTP
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
            role: 'user',
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.role });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
const { email, password } = req.body;
try {
    let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
        user: {
            id: user.id,
            role: user.role,
        },
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role });
    });
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
}
});

// Get All Users (Admin only)
router.get('/all', [auth, adminCheck], async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;