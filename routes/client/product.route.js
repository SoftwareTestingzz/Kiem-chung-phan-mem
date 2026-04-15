const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/product.controller');

// Middleware bắt đăng nhập đơn giản
const Account = require('../../models/user-client');

async function requireLogin(req, res, next) {
  if (!req.session || !req.session.user) {
    const token = req.cookies?.tokenClient;
    if (token) {
      try {
        const user = await Account.findOne({ token, deleted: false });
        if (user) {
          req.session.user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar
          };
          return next();
        }
      } catch (error) {
        // noop
      }
    }

    return res.redirect('/login');
  }
  next();
}

router.get('/products', controller.index);

// Trang chi tiết
router.get('/detail/:slug', controller.detail);

// Gửi bình luận (chỉ user đã login)
router.post('/detail/:slug/comment', requireLogin, controller.comment);

module.exports = router;
