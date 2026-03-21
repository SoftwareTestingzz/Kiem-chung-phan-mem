const productService = require('../../services/client/product.service');
const Order = require('../../models/order.model');
const Comment = require('../../models/comment.model');

// Dùng lại helper search + service danh mục
const searchHelper = require('../../helper/search');
const categoryService = require('../../services/client/category.service');
const respond = require('../../helper/respond');

// Hàm bỏ dấu tiếng Việt (giống bên products.js)
const normalizeText = (str = "") =>
    str
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .toLowerCase();

// [GET] /products
module.exports.index = async (req, res) => {
    try {
        const categorySlug = req.query.category;
        const searchObject = searchHelper(req.query);   // lấy keyword từ ?keyword=...
        const keyword = searchObject.keyword || "";

        let products;

        // 1. Lấy danh sách sản phẩm từ service
        if (categorySlug) {
            // Hàm này bạn đã có trong services/client/product.service
            products = await productService.getListByCategorySlug(categorySlug);
        } else {
            products = await productService.getList();
        }

        products = products || [];

        // 2. Nếu có keyword → lọc lại theo title (bỏ dấu, giống phía client)
        if (keyword) {
            const kwNorm = normalizeText(keyword);
            products = products.filter((p) => {
                const titleNorm = normalizeText(p.title || "");
                return titleNorm.includes(kwNorm);
            });
        }

        // 3. Lấy danh mục cho menu + sidebar
        const categoriesMenu = await categoryService.getMenuCategories();

        // PAGINATION
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const perPage = Math.max(1, parseInt(req.query.perPage) || parseInt(req.query.limit) || 10);
        const totalItems = products.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

        // Clamp page
        const currentPage = Math.min(page, totalPages);
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;

        const pagedProducts = products.slice(start, end);

        // 4. Render ra trang products
        const renderData = {
            pageTitle: 'Trang danh sách sản phẩm',
            products: pagedProducts,
            categoriesMenu,
            keyword,
            page: currentPage,
            perPage,
            totalPages,
            totalItems
        };
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Lấy dữ liệu thành công', data: renderData },
            render: { view: 'client/pages/products/index', data: renderData }
        });
    } catch (error) {
        console.log(error);
        const wantsJson = req.headers['accept']?.includes('application/json') || req.query._format === 'json';
        if (wantsJson) return res.status(500).json({ success: false, message: 'Internal Server Error' });
        res.status(500).send('Internal Server Error');
    }
};

// [GET] /detail/:slug
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await productService.detail(slug);

        // Lấy danh mục cho header + sidebar
        const categoriesMenu = await categoryService.getMenuCategories();

        if (!product) {
            const renderData = {
                pageTitle: 'Sản phẩm không tồn tại',
                product: null,
                comments: [],
                avgRating: 0,
                canReview: false,
                hasReviewed: false,
                categoriesMenu
            };
            return respond(req, res, {
                status: 404,
                json: { success: false, message: 'Sản phẩm không tồn tại!', data: renderData },
                render: { view: 'client/pages/products/detail', data: renderData }
            });
        }

        // Lấy bình luận đã được duyệt của sản phẩm
        const comments = await Comment.find({ productId: product._id, deleted: false, status: 'approved' })
            .sort({ createdAt: -1 })
            .lean();

        // Tính điểm rating trung bình
        let avgRating = 0;
        if (comments.length > 0) {
            const sum = comments.reduce((total, c) => total + (c.rating || 0), 0);
            avgRating = sum / comments.length;
        }

        let canReview = false;
        let hasReviewed = false;

        if (req.session && req.session.user) {
            const userId = req.session.user._id;

            // Kiểm tra user đã từng đánh giá sản phẩm này chưa
            const existingComment = await Comment.findOne({
                productId: product._id,
                userId: userId
            });

            if (existingComment) {
                hasReviewed = true;
            }

            // Kiểm tra user đã từng mua sản phẩm này trong đơn đã hoàn tất chưa
            const order = await Order.findOne({
                userId: userId,
                'items.productId': product._id,
                status: 'completed'
            });

            // Chỉ cho review nếu đã mua và chưa review lần nào
            if (order && !existingComment) {
                canReview = true;
            }
        }

        const renderData = {
            pageTitle: product.title,
            product,
            comments,
            avgRating,
            canReview,
            hasReviewed,
            categoriesMenu
        };
        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Lấy dữ liệu thành công', data: renderData },
            render: { view: 'client/pages/products/detail', data: renderData }
        });
    } catch (error) {
        console.log(error);
        const wantsJson = req.headers['accept']?.includes('application/json') || req.query._format === 'json';
        if (wantsJson) return res.status(500).json({ success: false, message: 'Internal Server Error' });
        res.status(500).send('Internal Server Error');
    }
};

// [POST] /detail/:slug/comment
module.exports.comment = async (req, res) => {
    try {
        const slug = req.params.slug;

        // Chưa đăng nhập thì cho về trang login
        if (!req.session || !req.session.user) {
            return respond(req, res, {
                status: 401,
                json: { success: false, message: 'Vui lòng đăng nhập' },
                redirect: '/login'
            });
        }

        const user = req.session.user;
        const { rating, content } = req.body;

        const sendError = (status, msg) => {
            const wantsJson = req.headers['accept']?.includes('application/json') || req.query._format === 'json';
            if (wantsJson) return res.status(status).json({ success: false, message: msg });
            return res.status(status).send(msg);
        };

        // Lấy sản phẩm
        const product = await productService.detail(slug);
        if (!product) {
            return sendError(404, 'Product not found');
        }

        // Kiểm tra đã từng review sản phẩm này chưa
        const existingComment = await Comment.findOne({
            productId: product._id,
            userId: user._id
        });

        if (existingComment) {

            return sendError(400, 'Bạn chỉ có thể đánh giá sản phẩm này một lần.');
        }

        // Kiểm tra đã từng mua sản phẩm này chưa (đơn completed)
        const order = await Order.findOne({
            userId: user._id,
            'items.productId': product._id,
            status: 'completed'
        });

        if (!order) {
            return sendError(403, 'Bạn cần mua sản phẩm này trước khi bình luận');
        }

        // Validate rating + content
        const ratingNumber = Number(rating);
        if (!ratingNumber || ratingNumber < 1 || ratingNumber > 5) {
            return sendError(400, 'Số sao không hợp lệ');
        }

        if (!content || !content.trim()) {
            return sendError(400, 'Nội dung bình luận không được để trống');
        }

        // Tạo bình luận mới (mặc định status = 'pending')
        await Comment.create({
            productId: product._id,
            userId: user._id,
            userName: user.fullName || user.email,
            userEmail: user.email || '',
            rating: ratingNumber,
            content: content.trim()
        });

        return respond(req, res, {
            status: 200,
            json: { success: true, message: 'Bình luận thành công!' },
            redirect: '/detail/' + slug
        });
    } catch (error) {
        console.log(error);
        const wantsJson = req.headers['accept']?.includes('application/json') || req.query._format === 'json';
        if (wantsJson) return res.status(500).json({ success: false, message: 'Internal Server Error' });
        res.status(500).send('Internal Server Error');
    }
};
