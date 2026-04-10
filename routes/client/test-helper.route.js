// Test helper routes - CHỈ DÙNG TRONG TEST
const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/test-helper.controller");

router.get("/get-register-otp", controller.getRegisterOtp);
router.get("/get-reset-otp", controller.getResetOtp);

module.exports = router;
