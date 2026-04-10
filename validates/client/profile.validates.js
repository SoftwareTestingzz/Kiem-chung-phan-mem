const { body } = require("express-validator");

module.exports.updateProfileValidates = [
    body("fullName")
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage("Tên phải có ít nhất 2 ký tự")
        .notEmpty().withMessage("Tên không được để trống"),

    body("phone")
        .optional()
        .trim()
        .custom((value) => {
            // Nếu phone được gửi và không rỗng, validate format
            if (value && value.length > 0) {
                const phoneRegex = /^(0)(3|5|7|8|9)[0-9]{8}$/;
                if (!phoneRegex.test(value)) {
                    throw new Error("Số điện thoại không hợp lệ");
                }
            }
            return true;
        }),

    body("gender")
        .optional()
        .isIn(["male", "female", "other", ""]).withMessage("Giới tính không hợp lệ"),

    body("address")
        .optional()
        .trim()
];
