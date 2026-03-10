const Role = require('../models/role.model');

const rolesData = [
    {
        title: "Super Admin",
        description: "Quản trị viên cấp cao nhất với toàn quyền hệ thống",
        permissions: [
            'products_view', 'products_create', 'products_edit', 'products_delete',
            'categories_view', 'categories_create', 'categories_edit', 'categories_delete',
            'roles_view', 'roles_create', 'roles_edit', 'roles_delete', 'roles_permissions',
            'accounts_view', 'accounts_create', 'accounts_edit', 'accounts_delete',
            'blogs_view', 'blogs_create', 'blogs_edit', 'blogs_delete',
            'orders_view', 'orders_edit'
        ]
    },
    {
        title: "Quản lý sản phẩm",
        description: "Có quyền quản lý sản phẩm và danh mục",
        permissions: [
            'products_view', 'products_create', 'products_edit', 'products_delete',
            'categories_view', 'categories_create', 'categories_edit', 'categories_delete'
        ]
    },
    {
        title: "Nhân viên kho",
        description: "Chỉ có quyền xem sản phẩm và quản lý đơn hàng",
        permissions: [
            'products_view',
            'categories_view',
            'orders_view', 'orders_edit'
        ]
    },
    {
        title: "Biên tập viên",
        description: "Quản lý blogs và xem sản phẩm",
        permissions: [
            'products_view',
            'blogs_view', 'blogs_create', 'blogs_edit', 'blogs_delete'
        ]
    }
];

module.exports = async () => {
    for (const roleData of rolesData) {
        const existing = await Role.findOne({ title: roleData.title, deleted: false });
        if (!existing) {
            await Role.create(roleData);
            console.log(`  ✓ Đã tạo nhóm quyền: ${roleData.title}`);
        } else {
            await Role.updateOne({ _id: existing._id }, { permissions: roleData.permissions, description: roleData.description });
            console.log(`  ~ Đã cập nhật nhóm quyền: ${roleData.title}`);
        }
    }
};
