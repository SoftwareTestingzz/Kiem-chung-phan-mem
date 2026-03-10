const productService = require('../../services/client/product.service');
const Order = require('../../models/order.model');
const Comment = require('../../models/comment.model');

// Dùng lại helper search + service danh mục
const searchHelper = require('../../helper/search');
const categoryService = require('../../services/client/category.service');

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
        res.render('client/pages/products/index', {
            pageTitle: 'Trang danh sách sản phẩm',
            products: pagedProducts,
            categoriesMenu,
            // cho Pug/JS dùng lại keyword ban đầu (nếu muốn set vào ô search)
            keyword,
            // pagination meta
            page: currentPage,
            perPage,
            totalPages,
            totalItems
        });
    } catch (error) {
        console.log(error);
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
            return res.render('client/pages/products/detail', {
                pageTitle: 'Sản phẩm không tồn tại',
                product: null,
                comments: [],
                avgRating: 0,
                canReview: false,
                hasReviewed: false,
                categoriesMenu
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

        res.render('client/pages/products/detail', {
            pageTitle: product.title,
            product,
            comments,
            avgRating,
            canReview,
            hasReviewed,
            categoriesMenu
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};

// [POST] /detail/:slug/comment
module.exports.comment = async (req, res) => {
    try {
        const slug = req.params.slug;

        // Chưa đăng nhập thì cho về trang login
        if (!req.session || !req.session.user) {
            return res.redirect('/login');
        }

        const user = req.session.user;
        const { rating, content } = req.body;

        // Lấy sản phẩm
        const product = await productService.detail(slug);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Kiểm tra đã từng review sản phẩm này chưa
        const existingComment = await Comment.findOne({
            productId: product._id,
            userId: user._id
        });

        if (existingComment) {
            
            return res.status(400).send('Bạn chỉ có thể đánh giá sản phẩm này một lần.');
        }

        // Kiểm tra đã từng mua sản phẩm này chưa (đơn completed)
        const order = await Order.findOne({
            userId: user._id,
            'items.productId': product._id,
            status: 'completed'
        });

        if (!order) {
            return res.status(403).send('Bạn cần mua sản phẩm này trước khi bình luận');
        }

        // Validate rating + content
        const ratingNumber = Number(rating);
        if (!ratingNumber || ratingNumber < 1 || ratingNumber > 5) {
            return res.status(400).send('Số sao không hợp lệ');
        }

        if (!content || !content.trim()) {
            return res.status(400).send('Nội dung bình luận không được để trống');
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

        res.redirect('/detail/' + slug);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
