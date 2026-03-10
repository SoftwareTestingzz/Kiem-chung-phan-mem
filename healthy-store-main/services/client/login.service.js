const Account = require('../../models/user-client');
const bcrypt = require("bcrypt");

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await Account.findOne({
        email,
        deleted: false
    });

    if (!user) {
        throw new Error("EMAIL_NOT_FOUND");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("PASSWORD_ERROR");
    }

    // cookie - ✅ Giữ token lâu hơn (7 ngày)
    res.cookie("tokenClient", user.token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7 ngày
    });

    // session
    req.session.user = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar
    };
};

module.exports.logout = (req, res) => {
    res.clearCookie("tokenClient");
    req.session.destroy(() => {});
};
