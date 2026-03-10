const cartService = require("../../services/client/cart.service");

/* ===================================================
   [POST] /cart/add  → Thêm sản phẩm vào giỏ hàng
=================================================== */
module.exports.add = async (req, res) => {
    try {
        // ✅ Kiểm tra đăng nhập
        if (!req.session.user) {
            return res.json({
                success: false,
                message: "Vui lòng đăng nhập để thêm vào giỏ hàng!",
                requireLogin: true
            });
        }

        const { productId, quantity } = req.body;

        await cartService.addToCart(req, productId, quantity);

        return res.json({
            success: true,
            message: "Đã thêm vào giỏ hàng!"
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message || "Lỗi thêm sản phẩm vào giỏ!"
        });
    }
};


/* ===================================================
   [POST] /cart/update  → Cập nhật số lượng sản phẩm
=================================================== */
module.exports.update = async (req, res) => {
    try {
        // ✅ Kiểm tra đăng nhập
        if (!req.session.user) {
            return res.json({
                success: false,
                message: "Vui lòng đăng nhập để cập nhật giỏ hàng!",
                requireLogin: true
            });
        }

        const { productId, quantity } = req.body;

        await cartService.updateQuantity(req, productId, quantity);

        return res.json({
            success: true,
            message: "Cập nhật giỏ hàng thành công!"
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message || "Lỗi cập nhật giỏ hàng!"
        });
    }
};


/* ===================================================
   [POST] /cart/delete  → Xóa 1 sản phẩm khỏi giỏ
=================================================== */
module.exports.delete = async (req, res) => {
    try {
        // ✅ Kiểm tra đăng nhập
        if (!req.session.user) {
            return res.json({
                success: false,
                message: "Vui lòng đăng nhập để xóa sản phẩm!",
                requireLogin: true
            });
        }

        const { productId } = req.body;

        await cartService.removeItem(req, productId);

        return res.json({
            success: true,
            message: "Đã xóa sản phẩm khỏi giỏ!"
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message || "Lỗi xóa sản phẩm!"
        });
    }
};


/* ===================================================
   [POST] /cart/clear  → Xóa toàn bộ giỏ hàng
=================================================== */
module.exports.clear = async (req, res) => {
    try {
        // ✅ Kiểm tra đăng nhập
        if (!req.session.user) {
            return res.json({
                success: false,
                message: "Vui lòng đăng nhập để xóa giỏ hàng!",
                requireLogin: true
            });
        }

        await cartService.clearCart(req);

        return res.json({
            success: true,
            message: "Đã xóa toàn bộ giỏ hàng!"
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message || "Không thể xóa giỏ hàng!"
        });
    }
};


/* ===================================================
   [GET] /cart  → Trang hiển thị giỏ hàng
=================================================== */
module.exports.index = async (req, res) => {
    try {
        const result = await cartService.getCart(req);

        return res.render("client/pages/cart/index", {
            pageTitle: "Giỏ hàng",
            cart: result.cart,
            total: result.total
        });

    } catch (err) {
        return res.render("client/pages/cart/index", {
            pageTitle: "Giỏ hàng",
            cart: [],
            total: 0,
            error: "Không thể tải giỏ hàng!!!"
        });
    }
};
