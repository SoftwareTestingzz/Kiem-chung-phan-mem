const Account = require('../../models/user.model')
const bcrypt = require("bcrypt");

module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body

    const user = await Account.findOne({
        email: email,
        deleted: false
    })

    if (!user) {
        throw new Error("EMAIL_NOT_FOUND")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error("PASSWORD_ERROR")
    }

    if (user.status === "inactive") {
        throw new Error("ACCOUNT_BLOCK")
    }

    res.cookie('token', user.token)
    return
};

module.exports.logout = ( res) => {
    res.clearCookie('token');
};
