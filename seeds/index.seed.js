/**
 * HEALTHY STORE - MASTER SEED
 * ============================
 * Chạy lệnh: node seeds/index.seed.js
 *
 * Thứ tự seed:
 *  1. roles       → Nhóm quyền (Super Admin, Quản lý sản phẩm, ...)
 *  2. admin       → Tài khoản admin (verdish@gmail.com)
 *  3. categories  → Danh mục cha + danh mục con
 *  4. products    → Sản phẩm mẫu (thực phẩm chức năng, thảo dược, ...)
 *  5. blogs       → Bài viết blog mẫu
 *  6. user-client → Tài khoản khách hàng mẫu
 *  7. orders      → Đơn hàng mẫu với các trạng thái khác nhau
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/user.model');

const seedRoles = require('./role.seed');
const seedAdmin = require('./admin.seed');
const seedCategories = require('./category.seed');
const seedProducts = require('./product.seed');
const seedBlogs = require('./blog.seed');
const seedUserClients = require('./user-client.seed');
const seedOrders = require('./order.seed');

const runAllSeeds = async () => {
    try {
        if (!process.env.MONGO_URL) {
            console.error('❌ Error: MONGO_URL chưa được cấu hình trong .env file!');
            process.exit(1);
        }

        console.log('🔌 Đang kết nối MongoDB...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Kết nối MongoDB thành công!\n');

        // ─────────────────────────────────────────
        // 1. ROLES
        // ─────────────────────────────────────────
        console.log('📋 [1/7] Seeding Nhóm quyền...');
        await seedRoles();
        console.log('✅ Hoàn thành Roles!\n');

        // ─────────────────────────────────────────
        // 2. ADMIN ACCOUNT
        // ─────────────────────────────────────────
        console.log('👤 [2/7] Seeding Tài khoản Admin...');
        await seedAdmin();

        // Lấy ID admin để gán vào sản phẩm
        const adminUser = await User.findOne({ email: 'verdish@gmail.com', deleted: false });
        const adminId = adminUser ? adminUser._id.toString() : '';
        console.log('✅ Hoàn thành Admin Account!\n');

        // ─────────────────────────────────────────
        // 3. CATEGORIES
        // ─────────────────────────────────────────
        console.log('🗂️  [3/7] Seeding Danh mục sản phẩm...');
        await seedCategories();
        console.log('✅ Hoàn thành Categories!\n');

        // ─────────────────────────────────────────
        // 4. PRODUCTS
        // ─────────────────────────────────────────
        console.log('🛍️  [4/7] Seeding Sản phẩm...');
        await seedProducts(adminId);
        console.log('✅ Hoàn thành Products!\n');

        // ─────────────────────────────────────────
        // 5. BLOGS
        // ─────────────────────────────────────────
        console.log('📝 [5/7] Seeding Bài viết Blog...');
        await seedBlogs();
        console.log('✅ Hoàn thành Blogs!\n');

        // ─────────────────────────────────────────
        // 6. CLIENT USERS
        // ─────────────────────────────────────────
        console.log('👥 [6/7] Seeding Tài khoản Khách hàng...');
        await seedUserClients();
        console.log('✅ Hoàn thành User Clients!\n');

        // ─────────────────────────────────────────
        // 7. ORDERS
        // ─────────────────────────────────────────
        console.log('🛒 [7/7] Seeding Đơn hàng mẫu...');
        await seedOrders();
        console.log('✅ Hoàn thành Orders!\n');

        // ─────────────────────────────────────────
        // SUMMARY
        // ─────────────────────────────────────────
        console.log('═══════════════════════════════════════════');
        console.log('🎉 SEED HOÀN THÀNH! Thông tin đăng nhập:');
        console.log('═══════════════════════════════════════════');
        console.log('👤 Admin:');
        console.log('   Email   : verdish@gmail.com');
        console.log('   Mật khẩu: verdishAdmin');
        console.log('───────────────────────────────────────────');
        console.log('👥 Khách hàng mẫu (mật khẩu: 123456):');
        console.log('   nguyenvanan@gmail.com');
        console.log('   tranthiB@gmail.com');
        console.log('   phamminchau@gmail.com');
        console.log('   lequocdung@gmail.com');
        console.log('   hoangthimai@gmail.com');
        console.log('═══════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed thất bại:', error.message);
        console.error(error);
        process.exit(1);
    }
};

runAllSeeds();
