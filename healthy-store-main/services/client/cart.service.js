const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

/* ======================================================
   HELPER FORMAT TIỀN VND
====================================================== */
function formatVND(value) {
    return value.toLocaleString("vi-VN") + " ₫";
}

/* ======================================================
   TÍNH GIÁ SAU GIẢM (%)
   👉 TRẢ VỀ SỐ (VND), KHÔNG FORMAT
====================================================== */
function calcPrice(product) {
    const discount = product.discountPercentage || 0;
    return Math.round(product.price * (100 - discount) / 100);
}

/* ======================================================
   LẤY GIỎ HÀNG CỦA USER
====================================================== */
module.exports.getCart = async (req) => {
    if (!req.session.user)
        return { cart: [], total: 0, totalFormatted: formatVND(0) };

    const userId = req.session.user._id;
    let cart = await Cart.findOne({ userId });

    if (!cart)
        return { cart: [], total: 0, totalFormatted: formatVND(0) };

    const total = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return {
        cart: cart.items,
        total,
        totalFormatted: formatVND(total)
    };
};

/* ======================================================
   THÊM SẢN PHẨM VÀO GIỎ
====================================================== */
module.exports.addToCart = async (req, productId, quantity) => {
    if (!req.session.user)
        throw new Error("Bạn phải đăng nhập!");

    const userId = req.session.user._id;
    const qty = parseInt(quantity);

    const product = await Product.findById(productId);
    if (!product) throw new Error("Sản phẩm không tồn tại");

    if (qty <= 0) throw new Error("Số lượng không hợp lệ");
    if (qty > product.stock) throw new Error("Không đủ hàng");

    const price = calcPrice(product); // 👉 VND

    let cart = await Cart.findOne({ userId });

    // Chưa có giỏ → tạo mới
    if (!cart) {
        await Cart.create({
            userId,
            items: [{
                productId,
                title: product.title,
                price, // VND
                thumbnail: product.thumbnail,
                quantity: qty,
                maxStock: product.stock
            }]
        });
        return true;
    }

    // Đã có giỏ
    let item = cart.items.find(i => i.productId.toString() === productId);

    if (item) {
        const newQty = item.quantity + qty;
        if (newQty > product.stock)
            throw new Error("Vượt quá tồn kho");

        item.quantity = newQty;
    } else {
        cart.items.push({
            productId,
            title: product.title,
            price, // VND
            thumbnail: product.thumbnail,
            quantity: qty,
            maxStock: product.stock
        });
    }

    await cart.save();
    return true;
};

/* ======================================================
   UPDATE SỐ LƯỢNG
====================================================== */
module.exports.updateQuantity = async (req, productId, qty) => {
    const userId = req.session.user._id;
    const quantity = parseInt(qty);

    let cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Giỏ hàng trống!");

    let item = cart.items.find(i => i.productId.toString() === productId);
    if (!item) throw new Error("Không tìm thấy sản phẩm");

    if (quantity <= 0) {
        cart.items = cart.items.filter(
            i => i.productId.toString() !== productId
        );
    } else {
        if (quantity > item.maxStock)
            throw new Error("Vượt quá tồn kho");

        item.quantity = quantity;
    }

    await cart.save();
    return true;
};

/* ======================================================
   XÓA 1 SẢN PHẨM
====================================================== */
module.exports.removeItem = async (req, productId) => {
    const userId = req.session.user._id;

    let cart = await Cart.findOne({ userId });
    if (!cart) return true;

    cart.items = cart.items.filter(
        i => i.productId.toString() !== productId
    );

    await cart.save();
    return true;
};

/* ======================================================
   XÓA TOÀN BỘ GIỎ HÀNG
====================================================== */
module.exports.clearCart = async (req) => {
    const userId = req.session.user._id;
    await Cart.deleteOne({ userId });
    return true;
};
