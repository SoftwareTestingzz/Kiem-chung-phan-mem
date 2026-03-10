const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadToCloud = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "healthy-store"
        });

        fs.unlinkSync(filePath);

        return result;
    } catch (err) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        throw err;
    }
};

module.exports = uploadToCloud;
