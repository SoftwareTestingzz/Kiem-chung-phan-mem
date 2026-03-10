const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            index: true
        },
        otp: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true,
            expires: 0
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-passwords");
