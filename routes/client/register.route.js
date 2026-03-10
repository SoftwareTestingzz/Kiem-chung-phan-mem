const express = require("express");
const router = express.Router();

const registerController = require("../../controllers/client/register.controller");
const { registerValidates } = require("../../validates/client/register.validates");

// ✅ GET /register - hiển thị form đăng ký
router.get("/", registerController.renderRegister);

// ✅ POST /register - bước 1: gửi OTP
router.post("/", registerValidates, registerController.handleRegister);

// ✅ GET /register/verify-otp - hiển thị form xác nhận OTP
router.get("/verify-otp", registerController.renderVerifyOtp);

// ✅ POST /register/verify-otp - bước 2: xác nhận OTP
router.post("/verify-otp", registerController.verifyOtp);

// ✅ POST /register/create-account - bước 3: tạo tài khoản
router.post("/create-account", registerController.createAccount);

// ✅ POST /register/resend-otp - gửi lại OTP
router.post("/resend-otp", registerController.resendOtp);

module.exports = router;
