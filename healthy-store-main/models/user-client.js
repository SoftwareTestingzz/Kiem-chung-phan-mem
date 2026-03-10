const mongoose = require("mongoose");
const crypto = require("crypto");

const userClientSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },
        token: {
            type: String,
            default: () => crypto.randomBytes(32).toString("hex")
        },
        status: String,
        avatar: {
            type: String,
            default: '/images/avatar-default.svg'
        },
        phone: {
            type: String,
            default: ""
        },
        gender: {
            type: String,
            enum: ["male", "female", "other", ""],
            default: ""
        },
        birthday: {
            type: String,
            default: ""
        },
        address: {
            type: String,
            default: ""
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true 
    }
);

module.exports = mongoose.model("UserClient", userClientSchema, "user-clients");
