const sysConfig = require("../../config/system");

const validateAccount = (isEdit = false) => {
    return (req, res, next) => {
        const { fullName, email, password, confirmPassword, phone, role_id } = req.body;

        if (!fullName || fullName.trim().length < 2) {
            req.flash("error", "Họ tên phải có ít nhất 2 ký tự!");
            return res.redirect("back");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            req.flash("error", "Email không hợp lệ!");
            return res.redirect("back");
        }

        if (!isEdit) {
            if (!password || password.length < 6) {
                req.flash("error", "Mật khẩu phải có ít nhất 6 ký tự!");
                return res.redirect("back");
            }

            if (password !== confirmPassword) {
                req.flash("error", "Xác nhận mật khẩu không khớp!");
                return res.redirect("back");
            }
        } else {
            if (password) {
                if (password.length < 6) {
                    req.flash("error", "Mật khẩu mới phải có ít nhất 6 ký tự!");
                    return res.redirect("back");
                }

                if (password !== confirmPassword) {
                    req.flash("error", "Xác nhận mật khẩu mới không khớp!");
                    return res.redirect("back");
                }
            }
        }

        if (phone) {
            const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
            if (!phoneRegex.test(phone)) {
                req.flash("error", "Số điện thoại không hợp lệ!");
                return res.redirect("back");
            }
        }

        if (!role_id || role_id.trim() === "") {
            req.flash("error", "Vui lòng chọn phân quyền!");
            return res.redirect("back");
        }

        next();
    };
};

module.exports.createPost = validateAccount(false);
module.exports.editPatch  = validateAccount(true);
