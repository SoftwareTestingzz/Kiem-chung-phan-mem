const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product" },
                title: { type: String, required: true },
                price: { type: Number, required: true },
                thumbnail: { type: String, default: "" },
                quantity: { type: Number, required: true, min: 1 }
            }
        ],

        total: {
            type: Number,
            required: true,
            min: 0
        },

        shippingInfo: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true }
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
            default: "pending"
        },

        // ⭐ Đơn bị hủy → ẩn khỏi Admin
        isHiddenForAdmin: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
