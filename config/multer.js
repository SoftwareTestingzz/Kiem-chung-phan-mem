const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const path = require('path');

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/pjpeg', 'image/x-png'];
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(extension)) {
        return cb(null, true);
    }

    return cb(new Error('INVALID_FILE_TYPE'), false);
};

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter
});

module.exports = upload;