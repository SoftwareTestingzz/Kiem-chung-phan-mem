
const accountService = require('../../services/admin/account.service');
const sysConfig = require('../../config/system');
const respond = require('../../helper/respond');

// Simple email format check
function isValidEmail(email) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

// Check if user is admin
function isAdmin(req) {
    return req.session && req.session.user && req.session.user.role === 'admin';
}

// =======================
// [GET] /admin/accounts
// =======================

module.exports.index = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).send('Forbidden');
        }
        const records = await accountService.getList();
        res.render('admin/pages/account/index', {
            pageTitle: 'Quản lý tài khoản',
            records
        });
    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${sysConfig.prefixAdmin}/dashboard`);
    }
};


// =======================
// [GET] /admin/accounts/create
// =======================
module.exports.create = async (req, res) => {
    try {
        const roles = await accountService.create();

        res.render('admin/pages/account/create', {
            pageTitle: 'Thêm mới tài khoản',
            roles
        });

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${sysConfig.prefixAdmin}/accounts`);
    }
};


// =======================
// [POST] /admin/account/create
// =======================
module.exports.createAccount = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện thao tác này!' });
        }
        const { email, password, role } = req.body;
        if (!email || !isValidEmail(email)) {
            return res.status(422).json({ success: false, message: 'Email không hợp lệ!' });
        }
        if (!password || password.length < 6) {
            return res.status(422).json({ success: false, message: 'Password phải từ 6 ký tự trở lên!' });
        }
        if (!role) {
            return res.status(422).json({ success: false, message: 'Role là bắt buộc!' });
        }
        await accountService.createAccount(req);
        return res.status(200).json({ success: true, message: 'Tạo tài khoản thành công!' });
    } catch (err) {
        const msg = err.message === "EMAIL_EXISTS"
            ? 'Email đã tồn tại, vui lòng chọn email khác!'
            : 'Có lỗi xảy ra, vui lòng thử lại!';
        return res.status(400).json({ success: false, message: msg });
    }
};

// =======================
// [PATCH] /admin/account/lock
// =======================
module.exports.lockAccount = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện thao tác này!' });
        }
        const { email } = req.body;
        if (!email || !isValidEmail(email)) {
            return res.status(422).json({ success: false, message: 'Email không hợp lệ!' });
        }
        await accountService.changeStatusByEmail(email, 'inactive');
        return res.status(200).json({ success: true, message: 'Đã khóa tài khoản!' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
};

// =======================
// [PATCH] /admin/account/unlock
// =======================
module.exports.unlockAccount = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện thao tác này!' });
        }
        const { email } = req.body;
        if (!email || !isValidEmail(email)) {
            return res.status(422).json({ success: false, message: 'Email không hợp lệ!' });
        }
        await accountService.changeStatusByEmail(email, 'active');
        return res.status(200).json({ success: true, message: 'Đã mở khóa tài khoản!' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
};

// =======================
// [DELETE] /admin/account/delete
// =======================
module.exports.deleteAccount = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện thao tác này!' });
        }
        const { email } = req.body;
        if (!email || !isValidEmail(email)) {
            return res.status(422).json({ success: false, message: 'Email không hợp lệ!' });
        }
        await accountService.deleteAccountByEmail(email);
        return res.status(200).json({ success: true, message: 'Xóa tài khoản thành công!' });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
};


// =======================
// [PATCH] /admin/accounts/change-status/:status/:id
// =======================
module.exports.changeStatus = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return respond(req, res, {
                status: 403,
                json: { success: false, message: 'Bạn không có quyền thực hiện thao tác này!' },
                redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`
            });
        }
        const { id, status } = req.params;
        if (!['active', 'inactive'].includes(status)) {
            return respond(req, res, {
                status: 422,
                json: { success: false, message: 'Trạng thái không hợp lệ!' },
                redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`
            });
        }
        await accountService.changeStatus(id, status);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Cập nhật trạng thái thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`
        });
    }
};

module.exports.deleteAccount = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return respond(req, res, {
                status: 403,
                json: { success: false, message: 'Bạn không có quyền thực hiện thao tác này!' },
                redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`
            });
        }
        await accountService.deleteAccount(req.params.id);
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Xóa tài khoản thành công!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`
        });
    } catch (err) {
        return respond(req, res, {
            status: 500,
            json: { success: false, message: 'Có lỗi xảy ra, vui lòng thử lại!' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}/accounts`
        });
    }
};


// =======================
// [GET] /admin/accounts/edit/:id
// =======================
module.exports.edit = async (req, res) => {
    try {
        const records = await accountService.edit(req);

        res.render('admin/pages/account/edit', {
            pageTitle: 'Chỉnh sửa tài khoản',
            ...records
        });

    } catch (err) {
        req.flash('error', 'Có lỗi xảy ra, vui lòng thử lại!');
        res.redirect(`${sysConfig.prefixAdmin}/accounts`);
    }
};


// =======================
// [PATCH] /admin/accounts/edit/:id
// 🔥 CẬP NHẬT SESSION KHI ADMIN SỬA CHÍNH MÌNH
// =======================
module.exports.editAccount = async (req, res) => {
    try {
        const updatedAccount = await accountService.editAccount(req);

        if (
            req.session.user &&
            req.session.user._id &&
            req.session.user._id.toString() === req.params.id.toString()
        ) {
            req.session.user.fullName = updatedAccount.fullName;
            req.session.user.avatar = updatedAccount.avatar;
            req.session.user.phone = updatedAccount.phone;
            req.session.user.address = updatedAccount.address;
        }

        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Cập nhật tài khoản thành công!' },
            redirect: `${sysConfig.prefixAdmin}/accounts/edit/${req.params.id}`
        });
    } catch (err) {
        const msg = err.message === "EMAIL_EXISTS"
            ? 'Email đã tồn tại, vui lòng chọn email khác!'
            : 'Có lỗi xảy ra, vui lòng thử lại!';
        return respond(req, res, {
            status: 400,
            json: { success: false, message: msg },
            redirect: `${sysConfig.prefixAdmin}/accounts/edit/${req.params.id}`
        });
    }
};


// =======================
// [GET] /admin/accounts/detail/:id
// =======================
module.exports.detail = async (req, res) => {
    try {
        const records = await accountService.detail(req);

        res.render('admin/pages/account/detail', {
            pageTitle: 'Chi tiết tài khoản',
            ...records
        });

    } catch (err) {
        req.flash('error', 'Không tìm thấy tài khoản!');
        res.redirect(`${sysConfig.prefixAdmin}/accounts`);
    }
};
