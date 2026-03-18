const { body } = require("express-validator");

module.exports.loginValidates = [
    body("email")
        .notEmpty().withMessage("Email không được để trống")
        .isEmail().withMessage("Email không đúng định dạng")
        .trim()
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Mật khẩu không được để trống")
];
