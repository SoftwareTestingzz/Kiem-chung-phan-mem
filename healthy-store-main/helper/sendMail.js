const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

transporter.verify((err) => {
    if (err) {
        console.error("❌ Mail config error:", err);
    } else {
        console.log("✅ Mail server ready");
    }
});

module.exports.sendOTP = async (email, otp) => {
    await transporter.sendMail({
        from: `"Verdish" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Mã xác thực OTP",
        html: `
            <div style="font-family:Arial">
                <h2>Mã OTP của bạn</h2>
                <p style="font-size:18px">
                    <b>${otp}</b>
                </p>
                <p>Mã có hiệu lực trong <b>3 phút</b>.</p>
                <p>Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>
            </div>
        `
    });
};
