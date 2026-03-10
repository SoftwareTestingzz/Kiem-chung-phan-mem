const { body } = require("express-validator");

module.exports.loginValidates = [
    body("email")
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không đúng định dạng")
        .trim()
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Mật khẩu không được để trống")
        .isLength({ min: 6 }).withMessage("Mật khẩu phải có ít nhất 6 ký tự")
        .matches(/[A-Z]/).withMessage("Mật khẩu phải có ít nhất 1 chữ in hoa")
        .matches(/[a-z]/).withMessage("Mật khẩu phải có ít nhất 1 chữ thường")
        .matches(/[0-9]/).withMessage("Mật khẩu phải có ít nhất 1 chữ số")
        .matches(/[^A-Za-z0-9]/).withMessage("Mật khẩu phải có ít nhất 1 ký tự đặc biệt")
];
