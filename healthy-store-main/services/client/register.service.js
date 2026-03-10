const bcrypt = require("bcrypt");
const User = require("../../models/user-client");
const PendingRegistration = require("../../models/pending-registration.model");
const { generateOTP } = require("../../helper/generateOtp");
const mailService = require("../../helper/sendMail");
 
module.exports.registerStep1 = async (req) => {
    const { fullName, email, password } = req.body;

    const userExists = await User.findOne({ email, deleted: false });
    if (userExists) {
        throw new Error("EMAIL_EXISTS");
    }

    const pendingExists = await PendingRegistration.findOne({ email });
    if (pendingExists) {
        await PendingRegistration.deleteOne({ email });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await PendingRegistration.create({
        fullName,
        email,
        password: hashedPassword,
        otp: hashedOTP,
        expiresAt: Date.now() + 3 * 60 * 1000 // 3 minutes
    });

    await mailService.sendOTP(email, otp);

    req.session.registerEmail = email;
};

module.exports.verifyOtpStep2 = async (req) => {
    const email = req.session.registerEmail;
    const { otp } = req.body;

    if (!email) {
        throw new Error("Phiên đăng ký đã hết hạn!");
    }

    if (!otp) {
        throw new Error("OTP không được để trống!");
    }

    const pending = await PendingRegistration.findOne({ email });

    if (!pending) {
        throw new Error("OTP không chính xác!");
    }

    if (pending.expiresAt < Date.now()) {
        await PendingRegistration.deleteOne({ email });
        throw new Error("OTP đã hết hạn!");
    }

    const isOtpValid = await bcrypt.compare(otp, pending.otp);
    if (!isOtpValid) {
        throw new Error("OTP không chính xác!");
    }

    req.session.registerOtpVerified = true;
};

module.exports.createAccountStep3 = async (req) => {
    const email = req.session.registerEmail;

    if (!email) {
        throw new Error("Phiên đăng ký đã hết hạn!");
    }

    if (!req.session.registerOtpVerified) {
        throw new Error("Chưa xác thực OTP!");
    }

    const pending = await PendingRegistration.findOne({ email });

    if (!pending) {
        throw new Error("Thông tin đăng ký không hợp lệ!");
    }

    await User.create({
        fullName: pending.fullName,
        email: pending.email,
        password: pending.password
    });

    await PendingRegistration.deleteOne({ email });

    delete req.session.registerEmail;
    delete req.session.registerOtpVerified;
};

module.exports.resendOtpRegister = async (req) => {
    const email = req.session.registerEmail;

    if (!email) {
        throw new Error("Phiên đăng ký đã hết hạn!");
    }

    await PendingRegistration.deleteOne({ email });

    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);

    const pending = new PendingRegistration({
        fullName: (await PendingRegistration.findOne({ email }))?.fullName,
        email,
        password: (await PendingRegistration.findOne({ email }))?.password,
        otp: hashedOTP,
        expiresAt: Date.now() + 3 * 60 * 1000
    });

    await pending.save();

    await mailService.sendOTP(email, otp);
};