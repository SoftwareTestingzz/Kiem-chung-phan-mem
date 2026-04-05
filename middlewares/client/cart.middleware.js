const Cart = require("../../models/cart.model");

module.exports.cartTotal = async (req, res, next) => {
    // 1. Nếu là test environment && không có user -> skip nhanh
    if (process.env.NODE_ENV === "test" && !req.session?.user && !req.user) {
        res.locals.cartTotal = 0;
        return next();
    }

    // 2. Nếu không có user bình thường
    if (!req.session?.user && !req.user) {
        res.locals.cartTotal = 0;
        return next();
    }

    try {
        const userId = req.session?.user?._id || req.user?._id;
        if (!userId) {
            res.locals.cartTotal = 0;
            return next();
        }

        const cart = await Cart.findOne({ userId });

        res.locals.cartTotal = cart
            ? cart.items.reduce((sum, item) => sum + item.quantity, 0)
            : 0;

    } catch (err) {
        console.error("Cart Middleware Error:", err);
        res.locals.cartTotal = 0;
    }

    next();
};
