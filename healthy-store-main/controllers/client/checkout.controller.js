const { validationResult } = require("express-validator");
const checkoutService = require("../../services/client/checkout.service");

module.exports = {

    /* ======================================================
       RENDER TRANG CHECKOUT
       (GIỮ NGUYÊN LUỒNG POST TỪ CART)
    ====================================================== */
    renderCheckout: async (req, res) => {
        try {
            // Chưa đăng nhập → chuyển login
            if (!req.session.user) {
                return res.redirect("/login");
            }

            // Nếu POST từ product (direct checkout) gửi `directItems`
            if (req.body.directItems) {
                let payload = [];
                try {
                    payload = JSON.parse(req.body.directItems);
                } catch (err) {
                    return res.redirect('/cart');
                }

                if (!Array.isArray(payload) || payload.length === 0) {
                    return res.redirect('/cart');
                }

                const data = await checkoutService.getSelectedItemsFromPayload(req, payload);

                return res.render("client/pages/checkout/index", {
                    pageTitle: "Thanh toán",
                    items: data.items,
                    total: data.total,
                    // gửi directItems để placeOrder có thể xử lý
                    directItems: JSON.stringify(payload),
                    selectedItems: JSON.stringify([]),
                    profile: {
                        fullName: req.session.user.fullName || "",
                        phone: req.session.user.phone || "",
                        address: req.session.user.address || ""
                    }
                });
            }

            let selectedItems = [];

            // Lấy selectedItems từ POST giỏ hàng
            if (req.body.selectedItems) {
                try {
                    selectedItems = JSON.parse(req.body.selectedItems);
                } catch (err) {
                    return res.redirect("/cart");
                }
            }

            // Không có sản phẩm được chọn
            if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
                return res.redirect("/cart");
            }

            // Lấy danh sách item + tổng tiền
            const data = await checkoutService.getSelectedItems(req, selectedItems);

            return res.render("client/pages/checkout/index", {
                pageTitle: "Thanh toán",
                items: data.items,
                total: data.total,
                selectedItems: JSON.stringify(selectedItems),
                profile: {
                    fullName: req.session.user.fullName || "",
                    phone: req.session.user.phone || "",
                    address: req.session.user.address || ""
                }
            });

        } catch (err) {
            console.error("Checkout Render Error:", err);
            
            return res.redirect("/cart");
        }
    },


    /* ======================================================
       PLACE ORDER – XỬ LÝ ĐẶT HÀNG
       (GIỮ NGUYÊN API JSON CHO checkout.js)
    ====================================================== */
    placeOrder: async (req, res) => {

        // Bắt lỗi validate (số điện thoại, địa chỉ, ...)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                success: false,
                message: errors.array()[0].msg
            });
        }

        // Chưa đăng nhập
        if (!req.session.user) {
            return res.json({
                success: false,
                message: "Bạn cần đăng nhập để đặt hàng!"
            });
        }

        let ids = [];

        // Support directItems payload (from product detail) or selectedItems from cart
        try {
            if (req.body.directItems) {
                ids = JSON.parse(req.body.directItems);
            } else {
                ids = JSON.parse(req.body.selectedItems);
            }
        } catch (err) {
            return res.json({ success: false, message: 'Dữ liệu không hợp lệ' });
        }

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.json({ success: false, message: 'Không có sản phẩm để đặt hàng' });
        }

        try {
            let order;
            if (req.body.directItems) {
                order = await checkoutService.createOrderFromPayload(req, ids);
            } else {
                order = await checkoutService.createOrder(req, ids);
            }

            return res.json({ success: true, message: 'Đặt hàng thành công!', orderId: order._id });

        } catch (err) {
            console.error("Place Order Error:", err);
            return res.json({
                success: false,
                message: err.message || "Lỗi hệ thống khi đặt hàng!"
            });
        }
    }
};
