module.exports = function respond(req, res, { status = 200, json, render, redirect }) {

    const wantsJson =
        req.xhr ||
        req.headers.accept?.includes('application/json') ||
        req.headers['content-type']?.includes('application/json') ||
        req.query._format === 'json';

    // ✅ Ưu tiên JSON cho API
    if (wantsJson && json) {
        return res.status(status).json(json);
    }

    // ✅ Browser flow
    if (!wantsJson && redirect) {
        return res.redirect(redirect);
    }

    if (!wantsJson && render) {
        return res.render(render.view, render.data);
    }

    // ✅ fallback
    if (json) {
        // browser fallback
        if (!wantsJson) {
            if (status === 404) {
                return res.status(404).render('client/pages/error/404', {
                    pageTitle: '404 Not Found'
                });
            }

            const referer = req.get('Referer');
            if (referer) return res.redirect(referer);
        }

        return res.status(status).json(json);
    }
};