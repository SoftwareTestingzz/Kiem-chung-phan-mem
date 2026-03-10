const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const blogRoutes = require('./blog.route');  
const categoryRoutes = require('./category.route');
const roleRoutes = require('./role.route');
const accountRoutes = require('./account.route');
const orderAdminRoutes = require('./orders.route');
const authRoutes = require('./auth.route');
const testDataRoutes = require('./testData.route');

const authMiddleware = require('../../middlewares/admin/auth.middleware')
const systemConfig = require('../../config/system');

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + '/dashboard', authMiddleware.requireAuth ,dashboardRoutes);

    app.use(PATH_ADMIN + '/products', authMiddleware.requireAuth, productRoutes);

    app.use(PATH_ADMIN + '/blog', authMiddleware.requireAuth, blogRoutes);

    app.use(PATH_ADMIN + '/categories', authMiddleware.requireAuth, categoryRoutes);

    app.use(PATH_ADMIN + '/roles', authMiddleware.requireAuth, roleRoutes);

    app.use(PATH_ADMIN + '/accounts', authMiddleware.requireAuth, accountRoutes);

    app.use(PATH_ADMIN + '/orders', authMiddleware.requireAuth, orderAdminRoutes);

    app.use(PATH_ADMIN + '/test-data', authMiddleware.requireAuth, testDataRoutes);
 
    app.use(PATH_ADMIN + '/auth', authRoutes);
    
};

