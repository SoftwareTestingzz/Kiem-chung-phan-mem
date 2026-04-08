const mongoose = require('mongoose');
const respond = require('../../helper/respond');
const systemConfig = require('../../config/system');

// ✅ Validate ObjectId
module.exports.validateId = (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return respond(req, res, {
            status: 404,
            json: {
                success: false,
                message: 'ID không hợp lệ'
            },
            render: {
                view: 'client/pages/error/404',
                data: { pageTitle: '404 Not Found' }
            }
        });
    }

    next();
};

// ✅ Validate status (active/inactive)
module.exports.validateStatus = (req, res, next) => {
    const status = req.params.status;
    const validStatus = ['active', 'inactive'];

    if (!validStatus.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Trạng thái không hợp lệ'
        });
    }

    next();
};