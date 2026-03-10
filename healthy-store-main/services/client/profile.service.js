const User = require("../../models/user-client"); // ⭐ ĐÚNG MODEL CLIENT
const uploadToCloud = require("../../helper/uploadCloud");

// KIỂM TRA LOGIN
module.exports.checkLogin = (sessionUser) => {
    return !!sessionUser;
};

// CHUẨN BỊ DATA UPDATE
module.exports.prepareUpdateData = async (req) => {
    const currentUser = req.session.user;

    let avatar = currentUser.avatar || null;

    // Upload avatar nếu có
    if (req.file) {
        const uploadResult = await uploadToCloud(req.file.path);
        avatar = uploadResult.secure_url;
    }

    const data = {};

    if (req.body.fullName !== undefined) data.fullName = req.body.fullName;
    if (req.body.gender !== undefined) data.gender = req.body.gender;
    if (req.body.birthday !== undefined) data.birthday = req.body.birthday;
    if (req.body.phone !== undefined) data.phone = req.body.phone;
    if (req.body.address !== undefined) data.address = req.body.address;
    if (avatar !== null) data.avatar = avatar;

    return {
        id: currentUser._id,
        data
    };
};

// UPDATE USER TRONG DB
module.exports.updateUserInDatabase = async (id, data) => {
    if (!id) {
        throw new Error("USER_ID_MISSING");
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: data },
        {
            new: true,           // ⭐ BẮT BUỘC
            runValidators: true
        }
    ).select("-password");

    if (!updatedUser) {
        throw new Error("USER_NOT_FOUND");
    }

    return updatedUser;
};
