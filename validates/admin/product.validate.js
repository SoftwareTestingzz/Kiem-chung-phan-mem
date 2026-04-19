const sysConfig = require('../../config/system');
const respond = require('../../helper/respond');

module.exports.createPost = (req, res, next) => {

    if (!req.body.title) {
        return respond(req, res, {
            status: 400,
            json: { success: false, message: 'Thiếu title' }
        });
    }

    if (req.body.title.length > 255) {
        return respond(req, res, {
            status: 400,
            json: { success: false, message: 'Title quá dài' }
        });
    }

    if (req.body.price !== undefined && req.body.price !== '') {
        const price = Number(req.body.price);
        if (isNaN(price) || price < 0) {
            return respond(req, res, {
                status: 400,
                json: { success: false, message: 'Price không hợp lệ' }
            });
        }
    }

    if (req.body.stock !== undefined && req.body.stock !== '') {
        const stock = Number(req.body.stock);
        if (isNaN(stock) || stock < 0) {
            return respond(req, res, {
                status: 400,
                json: { success: false, message: 'Stock không hợp lệ' }
            });
        }
    }

    next();
};