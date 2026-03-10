const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
    {
        fullName: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        otp: { 
            type: String, 
            required: true 
        },
        expiresAt: { 
            type: Date, 
            required: true 
        },
        deleted: { 
            type: Boolean, 
            default: false 
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("PendingRegistration", pendingRegistrationSchema);
