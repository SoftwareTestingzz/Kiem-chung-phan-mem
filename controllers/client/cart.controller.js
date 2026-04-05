const cartService = require("../../services/client/cart.service");

/* ===================================================
   HELPER: Sanitize error messages (bảo mật)
=================================================== */
function sanitizeError(err) {
    // Ẩn thông tin kỹ thuật database
    if (err.name === 'CastError') {
        return "Mã sản phẩm không hợp lệ";
    }
    if (err.name === 'ValidationError') {
        return "Dữ liệu không hợp lệ";
    }
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
        return "Lỗi hệ thống, vui lòng thử lại sau";
    }
    
    // Chỉ trả message an toàn từ service
    return err.message || "Đã xảy ra lỗi";
}

/* ===================================================
   [POST] /cart/add  → Thêm sản phẩm vào giỏ hàng
=================================================== */
module.exports.add = async (req, res) => {
    try {
        // ✅ Kiểm tra đăng nhập
        if (!req.session.user) {
            return res.status(400).json({
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
        // ✅ Log lỗi chi tiết cho dev (không gửi cho client)
        console.error('[CART-ADD-ERROR]', err);
        
        return res.status(400).json({
            success: false,
            message: sanitizeError(err)
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
            return res.status(400).json({
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
        console.error('[CART-UPDATE-ERROR]', err);
        
        return res.status(400).json({
            success: false,
            message: sanitizeError(err)
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
            return res.status(400).json({
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
        console.error('[CART-DELETE-ERROR]', err);
        
        return res.status(400).json({
            success: false,
            message: sanitizeError(err)
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
            return res.status(400).json({
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
        return res.status(400).json({
            success: false,
            message: err.message || "Không thể xóa giỏ hàng!"
        });
    }
};


/* ===================================================
   [GET] /cart  → Trang hiển thị giỏ hàng
=================================================== */
module.exports.index = async (req, res) => {
    const isApi = req.headers.accept && req.headers.accept.includes('application/json');
    try {
        const result = await cartService.getCart(req);

        if (isApi) {
            return res.json({ success: true, cart: result.cart, total: result.total });
        }

        return res.render("client/pages/cart/index", {
            pageTitle: "Giỏ hàng",
            cart: result.cart,
            total: result.total
        });

    } catch (err) {
        if (isApi) {
            return res.status(400).json({ success: false, message: "Không thể tải giỏ hàng!!!" });
        }
        return res.render("client/pages/cart/index", {
            pageTitle: "Giỏ hàng",
            cart: [],
            total: 0,
            error: "Không thể tải giỏ hàng!!!"
        });
    }
};
