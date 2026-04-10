const respond = require('../../helper/respond');
const sysConfig = require('../../config/system');

module.exports = (err, req, res, next) => {
    if (!err) return next();

    // File sai định dạng
    if (err.message === 'INVALID_FILE_TYPE') {
        return respond(req, res, {
            status: 400,
            json: { success: false, message: 'File không đúng định dạng (jpg, png)' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}`
        });
    }

    // File quá size
    if (err.code === 'LIMIT_FILE_SIZE') {
        return respond(req, res, {
            status: 400,
            json: { success: false, message: 'File vượt quá dung lượng cho phép (2MB)' },
            redirect: req.get('Referer') || `${sysConfig.prefixAdmin}`
        });
    }

    next(err);
};