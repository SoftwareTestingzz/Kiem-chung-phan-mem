const Account = require('../../models/user.model');
const Role = require('../../models/role.model');
const sysConfig = require('../../config/system')

module.exports.requireAuth = async (req, res, next) => {
    // Mock admin user for testing
    if (process.env.NODE_ENV === 'test') {
        const mockUser = { _id: 'test-admin-id', id: 'test-admin-id', role: 'admin' };
        req.user = mockUser;
        res.locals.user = mockUser;
        return next();
    }

    const token = req.cookies.token;

    const wantsJson = req.headers['accept']?.includes('application/json') || req.headers['content-type']?.includes('application/json') || req.query._format === 'json';

    if (!token) {
        if (wantsJson) return res.status(401).json({ success: false, message: 'Unauthorized' });
        req.flash("error", "Bạn cần đăng nhập!");
        return res.redirect(`${sysConfig.prefixAdmin}/auth/login`);
    }

    const user = await Account.findOne({ token, deleted: false }).select('-password');

    if (!user) {
        if (wantsJson) return res.status(401).json({ success: false, message: 'Unauthorized: Phiên đăng nhập không hợp lệ!' });
        req.flash("error", "Phiên đăng nhập không hợp lệ!");
        return res.redirect(`${sysConfig.prefixAdmin}/auth/login`);
    }

    if (user.status === "inactive") {
        if (wantsJson) return res.status(403).json({ success: false, message: 'Forbidden: Tài khoản bị khóa!' });
        req.flash("error", "Tài khoản bị khóa!");
        return res.redirect(`${sysConfig.prefixAdmin}/auth/login`);
    }
    const role = await Role.findOne({
        _id: user.role_id,
        deleted: false
    }).select('title permissions');

    res.locals.user = user;
    res.locals.roleUser = role;
    req.user = user; // Lưu vào req.user cho các API nếu cần
    next();
};
