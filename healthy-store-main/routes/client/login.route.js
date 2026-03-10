const express = require("express");
const router = express.Router();

const loginController = require("../../controllers/client/login.controller");
const { loginValidates } = require("../../validates/client/login.validates");

// Hiển thị form đăng nhập
router.get("/", loginController.renderLogin);

// Xử lý đăng nhập + validate
router.post("/", loginValidates, loginController.handleLogin);

// Đăng xuất
router.get("/logout", loginController.logout);

module.exports = router;
