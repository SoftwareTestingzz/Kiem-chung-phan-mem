/**
 * admin.seed.js
 * ─────────────────────────────────────────────────────────────
 * Khi export (module.exports): chỉ seed data, không connect/exit.
 *   → Dùng bởi index.seed.js hoặc index.js (server)
 *
 * Khi chạy trực tiếp (node seeds/admin.seed.js):
 *   → Tự connect, seed, rồi exit.
 * ─────────────────────────────────────────────────────────────
 */

const bcrypt = require('bcrypt');

// Models
const Role = require('../models/role.model');
const User = require('../models/user.model');

const ADMIN_EMAIL    = 'verdish@gmail.com';
const ADMIN_PASSWORD = 'verdishAdmin';

const ALL_PERMISSIONS = [
    'products_view', 'products_create', 'products_edit', 'products_delete',
    'categories_view', 'categories_create', 'categories_edit', 'categories_delete',
    'roles_view', 'roles_create', 'roles_edit', 'roles_delete', 'roles_permissions',
    'accounts_view', 'accounts_create', 'accounts_edit', 'accounts_delete',
    'blogs_view', 'blogs_create', 'blogs_edit', 'blogs_delete',
    'orders_view', 'orders_edit'
];

/** Core seed function – không connect/exit */
const seedAdmin = async () => {
    // ── Bước 1: Role "Super Admin" ───────────────────────────
    let adminRole = await Role.findOne({ title: 'Super Admin', deleted: false });

    if (!adminRole) {
        adminRole = await Role.create({
            title: 'Super Admin',
            description: 'Quản trị viên cấp cao nhất với toàn quyền hệ thống',
            permissions: ALL_PERMISSIONS
        });
        console.log('  ✓ Đã tạo nhóm quyền Super Admin!');
    } else {
        adminRole.permissions = ALL_PERMISSIONS;
        await adminRole.save();
        console.log('  ~ Đã cập nhật lại phân quyền Super Admin.');
    }

    // ── Bước 2: Tài khoản Admin ──────────────────────────────
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL, deleted: false });

    if (!existingAdmin) {
        const salt           = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        await User.create({
            fullName : 'Quản trị viên Super Admin',
            email    : ADMIN_EMAIL,
            password : hashedPassword,
            role_id  : adminRole._id.toString(),
            status   : 'active',
            phone    : '0123456789'
        });

        console.log(`  ✓ Đã tạo tài khoản Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    } else {
        existingAdmin.role_id = adminRole._id.toString();
        await existingAdmin.save();
        console.log(`  ~ Admin đã tồn tại (${ADMIN_EMAIL}), đã gán lại quyền.`);
    }
};

module.exports = seedAdmin;

/* ─── Chạy độc lập: node seeds/admin.seed.js ───────────────── */
if (require.main === module) {
    const mongoose = require('mongoose');
    const path     = require('path');
    require('dotenv').config({ path: path.join(__dirname, '../.env') });

    (async () => {
        try {
            if (!process.env.MONGO_URL) {
                console.error('❌ MONGO_URL chưa được cấu hình trong .env!');
                process.exit(1);
            }
            await mongoose.connect(process.env.MONGO_URL);
            console.log('✅ Kết nối Database thành công!');
            await seedAdmin();
            console.log('🎉 Seed Admin hoàn tất!');
            process.exit(0);
        } catch (err) {
            console.error('❌ Lỗi:', err.message);
            process.exit(1);
        }
    })();
}
