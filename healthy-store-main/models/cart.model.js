const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            title: String,
            price: Number,
            thumbnail: String,
            quantity: Number,
            maxStock: Number
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema);
