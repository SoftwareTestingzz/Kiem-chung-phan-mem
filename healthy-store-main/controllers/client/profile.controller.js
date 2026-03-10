const profileService = require("../../services/client/profile.service");

// [GET] /profile
module.exports.index = (req, res) => {
    try {
        if (!profileService.checkLogin(req.session.user)) {
            return res.redirect("/login");
        }

        res.render("client/pages/profile/index", {
            pageTitle: "Thông tin tài khoản",
            user: req.session.user
        });

    } catch (err) {
        console.error("PROFILE PAGE ERROR:", err);
        return res.redirect("/login");
    }
};

// [POST] /profile
module.exports.updateProfile = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            return res.status(401).json({
                success: false,
                message: "Bạn chưa đăng nhập!"
            });
        }

        // Chuẩn bị data update
        const updatePackage = await profileService.prepareUpdateData(req);

        // Update DB (DÙNG ID TRONG SESSION)
        const updatedUser = await profileService.updateUserInDatabase(
            updatePackage.id,
            updatePackage.data
        );

        // Update lại session
        req.session.user = {
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            phone: updatedUser.phone,
            gender: updatedUser.gender,
            birthday: updatedUser.birthday,
            address: updatedUser.address
        };

        return res.json({
            success: true,
            message: "Cập nhật thành công!",
            user: req.session.user
        });

    } catch (err) {
        console.error("UPDATE PROFILE ERROR:", err);

        return res.status(500).json({
            success: false,
            message: "Cập nhật thất bại!"
        });
    }
};
