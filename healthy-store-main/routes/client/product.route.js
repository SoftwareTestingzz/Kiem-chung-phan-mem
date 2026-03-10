const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/product.controller');

// Middleware bắt đăng nhập đơn giản
function requireLogin(req, res, next) {
  if (!req.session || !req.session.user) {
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
