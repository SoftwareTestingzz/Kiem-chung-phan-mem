const Account = require('../../models/user.model');

module.exports.requireAuthAPI = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await Account.findOne({ token, deleted: false }).select('-password');

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (user.status === "inactive") {
            return res.status(403).json({ error: 'Account is inactive' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth API error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};
