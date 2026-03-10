const Account = require('../../models/user-client');

module.exports.requireAuthClient = async (req, res, next) => {
    try {
        const token = req.cookies.tokenClient;

        if (!token) {
            return res.redirect("/login");
        }

        const user = await Account.findOne({
            token,
            deleted: false
        }).select("-password");

        if (!user) {
            res.clearCookie("tokenClient");
            return res.redirect("/login");
        }

        res.locals.user = user;
        req.session.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.redirect("/login");
    }
};
