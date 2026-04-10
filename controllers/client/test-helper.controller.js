// Test helper controller - CHỈ DÙNG TRONG TEST
// KHÔNG DEPLOY LÊN PRODUCTION

const PendingRegistration = require("../../models/pending-registration.model");
const ForgotPassword = require("../../models/forgot-passsword.model");
const bcrypt = require("bcrypt");

// [GET] /test-helper/get-register-otp?email=xxx
module.exports.getRegisterOtp = async (req, res) => {
    // Chỉ cho phép trong development/test mode
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ success: false, message: 'Not allowed in production' });
    }

    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email required' });
        }

        const pending = await PendingRegistration.findOne({ email });
        
        if (!pending) {
            return res.status(404).json({ success: false, message: 'No pending registration found' });
        }

        // Trả về một OTP test cố định thay vì OTP thực
        // Vì OTP đã được hash, ta không thể lấy được OTP gốc
        // Giải pháp: Tạo OTP mới và update vào DB
        const testOtp = "123456";
        const hashedOtp = await bcrypt.hash(testOtp, 10);
        
        pending.otp = hashedOtp;
        pending.expiresAt = Date.now() + 10 * 60 * 1000; // 10 phút
        await pending.save();

        return res.json({
            success: true,
            otp: testOtp,
            email: email
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// [GET] /test-helper/get-reset-otp?email=xxx
module.exports.getResetOtp = async (req, res) => {
    // Chỉ cho phép trong development/test mode
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ success: false, message: 'Not allowed in production' });
    }

    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email required' });
        }

        const forgot = await ForgotPassword.findOne({ email });
        
        if (!forgot) {
            return res.status(404).json({ success: false, message: 'No reset request found' });
        }

        // Tạo OTP test cố định
        const testOtp = "123456";
        const hashedOtp = await bcrypt.hash(testOtp, 10);
        
        forgot.otp = hashedOtp;
        forgot.expiresAt = Date.now() + 10 * 60 * 1000; // 10 phút
        await forgot.save();

        return res.json({
            success: true,
            otp: testOtp,
            email: email
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
