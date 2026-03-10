const User = require("../../models/user-client");
const ForgotPassword= require("../../models/forgot-passsword.model");
const {generateOTP} = require("../../helper/generateOtp");
const bcrypt = require("bcrypt");
const mailService = require("../../helper/sendMail");

module.exports.forgotPasswordPost = async (req, res) => {
    const {email} = req.body;

    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        throw new Error("Email không tồn tại!");
    }

    await ForgotPassword.deleteOne({
        email: email
    });

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const objectForgotPassword = new ForgotPassword({
        email: email,
        otp: hashedOTP,
        expiresAt: Date.now() + 3 * 60 * 1000 // 3 minutes
    });

    await mailService.sendOTP(email, otp);

    await objectForgotPassword.save();     
};

module.exports.resendOTP = async (req) => {
    const email = req.session.resetPasswordEmail;

    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if (!user) {
        throw new Error("Email không tồn tại!");
    }

    await ForgotPassword.deleteOne({
        email: email
    });

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const objectForgotPassword = new ForgotPassword({
        email: email,
        otp: hashedOTP,
        expiresAt: Date.now() + 3 * 60 * 1000 // 3 minutes
    });

    await objectForgotPassword.save();
}

module.exports.verifyOtpPost = async (req) => {
    const email = req.session.resetPasswordEmail;
    const { otp } = req.body;

    if (!email) {
        throw new Error("Phiên xác thực đã hết hạn!");
    }

    if (!otp) {
        throw new Error("OTP không được để trống!");
    }

    const result = await ForgotPassword.findOne({ email });

    if (!result) {
        throw new Error("OTP không chính xác!");
    }

    if (result.expiresAt < Date.now()) {
        await ForgotPassword.deleteOne({ email });
        throw new Error("OTP đã hết hạn!");
    }

    const isOtpValid = await bcrypt.compare(otp, result.otp);
    
    if (!isOtpValid) {
        throw new Error("OTP không chính xác!");
    }

    req.session.otpVerified = true;
};


module.exports.resetPasswordPost = async (req) => {
    const email = req.session.resetPasswordEmail;
    const { password } = req.body;

    if (!email) {
        throw new Error("Phiên xác thực đã hết hạn!");
    }

    if (!req.session.otpVerified) {
        throw new Error("Chưa xác thực OTP!");
    }

    if (!password) {
        throw new Error("Mật khẩu không được để trống!");
    }

    const user = await User.findOne({ email, deleted: false });
    if (!user) {
        throw new Error("Email không tồn tại!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await ForgotPassword.deleteOne({ email });

    delete req.session.resetPasswordEmail;
    delete req.session.otpVerified;
};