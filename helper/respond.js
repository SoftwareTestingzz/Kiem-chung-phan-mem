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

    // 👇 fallback thông minh hơn cho browser
    if (json) {
        // Nếu là browser request (không muốn JSON)
        if (!wantsJson) {
            // 1. Nếu là 404 -> render trang 404
            if (status === 404) {
                return res.status(404).render('client/pages/error/404', {
                    pageTitle: '404 Not Found'
                });
            }

            // 2. Nếu có Referer -> redirect về trang trước
            const referer = req.get('Referer');
            if (referer) return res.redirect(referer);
        }

        // 3. Cuối cùng mới trả về JSON (cho API hoặc fallback cuối cùng)
        return res.status(status).json(json);
    }
};
