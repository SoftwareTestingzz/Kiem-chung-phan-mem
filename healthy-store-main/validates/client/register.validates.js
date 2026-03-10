const { body } = require("express-validator");

module.exports.registerValidates = [
    body("fullName")
        .notEmpty().withMessage("Họ tên không được để trống")
        .trim(),

    body("email")
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không đúng định dạng")
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Mật khẩu không được để trống")
        .isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự")
        .matches(/[A-Z]/).withMessage("Mật khẩu phải có ít nhất 1 chữ in hoa")
        .matches(/[a-z]/).withMessage("Mật khẩu phải có ít nhất 1 chữ thường")
        .matches(/[0-9]/).withMessage("Mật khẩu phải có ít nhất 1 chữ số")
        .matches(/[^A-Za-z0-9]/).withMessage("Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),

    body("confirmPassword")
        .notEmpty().withMessage("Vui lòng nhập lại mật khẩu")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Mật khẩu xác nhận không khớp");
            }
            return true;
        })
];
