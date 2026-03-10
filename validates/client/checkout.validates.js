const { body } = require("express-validator");

module.exports.placeOrderValidates = [
    body("name")
        .notEmpty().withMessage("Vui lòng nhập tên người nhận")
        .trim(),

    body("phone")
        .notEmpty().withMessage("Vui lòng nhập số điện thoại")
        // Chuẩn số VN: 0 + (3|5|7|8|9) + 8 số
        .matches(/^(0)(3|5|7|8|9)[0-9]{8}$/)
        .withMessage("Số điện thoại không hợp lệ"),

    body("address")
        .notEmpty().withMessage("Vui lòng nhập địa chỉ nhận hàng"),

    body("selectedItems")
        .notEmpty().withMessage("Không có sản phẩm nào được chọn")
];
