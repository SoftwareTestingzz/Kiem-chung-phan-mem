/**
 * Helper: respond theo Accept header
 * - Nếu request có Accept: application/json → trả JSON
 * - Còn lại → render HTML hoặc redirect như cũ
 */
module.exports = function respond(req, res, { status = 200, json, render, redirect }) {
    const wantsJson = req.headers['accept']?.includes('application/json')
        || req.headers['content-type']?.includes('application/json')
        || req.query._format === 'json';

    if (wantsJson) {
        return res.status(status).json(json);
    }
    if (redirect) return res.redirect(redirect);
    if (render) return res.render(render.view, render.data);
};
