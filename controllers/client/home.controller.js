const productService = require('../../services/client/product.service');
const categoryService = require('../../services/client/category.service');

// [GET] /
module.exports.index = async (req, res) => {
    try {
        // pagination: default 20 products per page on homepage
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const perPage = 20;

        // get full product list then slice for home page
        const [allProducts, categoriesMenu] = await Promise.all([
            productService.getList(),
            categoryService.getMenuCategories()
        ]);

        const totalItems = (allProducts && allProducts.length) || 0;
        const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
        const currentPage = Math.min(page, totalPages);
        const start = (currentPage - 1) * perPage;
        const end = start + perPage;

        const productsHome = (allProducts || []).slice(start, end);

        res.render('client/pages/home/index', {
            pageTitle: 'Trang chủ',
            productsHome,
            categoriesMenu,
            // pagination meta for view
            page: currentPage,
            perPage,
            totalPages,
            totalItems
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};
