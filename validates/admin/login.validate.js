module.exports.loginValidate = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || email.trim() === "") {
        req.flash("error", "Vui lòng nhập email!");
        return res.redirect("back");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        req.flash("error", "Email không hợp lệ!");
        return res.redirect("back");
    }

    if (!password || password.trim() === "") {
        req.flash("error", "Vui lòng nhập mật khẩu!");
        return res.redirect("back");
    }

    next();
};
