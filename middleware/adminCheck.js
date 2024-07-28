const User = require('../models/User');

const adminCheck = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = adminCheck;