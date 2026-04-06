/**
 * Helper: respond theo Accept header
 * - Nếu request có Accept: application/json → trả JSON
 * - Còn lại → render HTML hoặc redirect như cũ
 */
module.exports = function respond(req, res, { status = 200, json, render, redirect }) {
    // 1. Kiểm tra xem request có muốn JSON không
    const wantsJson =
        req.headers['accept']?.includes('application/json') ||
        req.headers['content-type']?.includes('application/json') ||
        req.xhr ||
        req.query._format === 'json';

    // 2. Nếu muốn JSON và có dữ liệu JSON -> trả JSON
    if (wantsJson && json) {
        return res.status(status).json(json);
    }

    // Nếu không phải JSON request
    if (redirect) return res.redirect(redirect);
    if (render) return res.render(render.view, render.data);

    // 👇 fallback thông minh hơn
    if (json) {
        // nếu là browser → redirect về trước
        const referer = req.get('Referer');
        if (referer) return res.redirect(referer);

        return res.status(status).json(json);
    }
};
