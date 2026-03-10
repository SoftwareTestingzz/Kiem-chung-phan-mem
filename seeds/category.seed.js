const Category = require('../models/category.model');

const categoriesData = [
    // Danh mục cha
    {
        title: "Thực phẩm chức năng",
        description: "Các sản phẩm thực phẩm bổ sung dinh dưỡng, tăng cường sức khỏe",
        thumbnail: "https://placehold.co/600x400/4ade80/ffffff?text=Thuc+Pham+Chuc+Nang",
        status: "active",
        position: 1,
        parent_category: ""
    },
    {
        title: "Thảo dược thiên nhiên",
        description: "Sản phẩm từ thảo dược và thiên nhiên",
        thumbnail: "https://placehold.co/600x400/86efac/ffffff?text=Thao+Duoc",
        status: "active",
        position: 2,
        parent_category: ""
    },
    {
        title: "Chăm sóc cơ thể",
        description: "Sản phẩm chăm sóc và làm đẹp cơ thể",
        thumbnail: "https://placehold.co/600x400/6ee7b7/ffffff?text=Cham+Soc+Co+The",
        status: "active",
        position: 3,
        parent_category: ""
    },
    {
        title: "Dinh dưỡng thể thao",
        description: "Sản phẩm hỗ trợ luyện tập thể thao và phát triển cơ bắp",
        thumbnail: "https://placehold.co/600x400/34d399/ffffff?text=Dinh+Duong+The+Thao",
        status: "active",
        position: 4,
        parent_category: ""
    }
];

// Danh mục con được tạo sau khi có id cha
const subCategoriesData = [
    // Con của "Thực phẩm chức năng"
    {
        title: "Vitamin tổng hợp",
        description: "Viên uống vitamin tổng hợp hàng ngày",
        thumbnail: "https://placehold.co/600x400/bbf7d0/333333?text=Vitamin",
        status: "active",
        position: 1,
        parentTitle: "Thực phẩm chức năng"
    },
    {
        title: "Omega 3 & Dầu cá",
        description: "Bổ sung axit béo omega-3 từ dầu cá",
        thumbnail: "https://placehold.co/600x400/bbf7d0/333333?text=Omega+3",
        status: "active",
        position: 2,
        parentTitle: "Thực phẩm chức năng"
    },
    {
        title: "Canxi & Xương khớp",
        description: "Hỗ trợ xương chắc khỏe và sức khỏe khớp",
        thumbnail: "https://placehold.co/600x400/bbf7d0/333333?text=Canxi",
        status: "active",
        position: 3,
        parentTitle: "Thực phẩm chức năng"
    },
    // Con của "Thảo dược thiên nhiên"
    {
        title: "Trà thảo dược",
        description: "Các loại trà thảo dược tốt cho sức khỏe",
        thumbnail: "https://placehold.co/600x400/d1fae5/333333?text=Tra+Thao+Duoc",
        status: "active",
        position: 1,
        parentTitle: "Thảo dược thiên nhiên"
    },
    {
        title: "Tinh dầu thiên nhiên",
        description: "Tinh dầu tự nhiên từ thực vật",
        thumbnail: "https://placehold.co/600x400/d1fae5/333333?text=Tinh+Dau",
        status: "active",
        position: 2,
        parentTitle: "Thảo dược thiên nhiên"
    },
    // Con của "Dinh dưỡng thể thao"
    {
        title: "Whey Protein",
        description: "Protein whey hỗ trợ tăng cơ hiệu quả",
        thumbnail: "https://placehold.co/600x400/a7f3d0/333333?text=Whey+Protein",
        status: "active",
        position: 1,
        parentTitle: "Dinh dưỡng thể thao"
    },
    {
        title: "BCAA & Amino Acids",
        description: "Amino acid chuỗi phân nhánh hỗ trợ phục hồi cơ",
        thumbnail: "https://placehold.co/600x400/a7f3d0/333333?text=BCAA",
        status: "active",
        position: 2,
        parentTitle: "Dinh dưỡng thể thao"
    }
];

module.exports = async () => {
    // Tạo danh mục cha
    const createdParents = {};
    for (const catData of categoriesData) {
        const existing = await Category.findOne({ title: catData.title, deleted: false });
        if (!existing) {
            const cat = await Category.create(catData);
            createdParents[catData.title] = cat._id.toString();
            console.log(`  ✓ Đã tạo danh mục cha: ${catData.title}`);
        } else {
            createdParents[catData.title] = existing._id.toString();
            console.log(`  ~ Danh mục cha đã tồn tại: ${catData.title}`);
        }
    }

    // Tạo danh mục con
    for (const subData of subCategoriesData) {
        const parentId = createdParents[subData.parentTitle] || '';
        const { parentTitle, ...subCatData } = subData;
        const existing = await Category.findOne({ title: subCatData.title, deleted: false });
        if (!existing) {
            await Category.create({ ...subCatData, parent_category: parentId });
            console.log(`  ✓ Đã tạo danh mục con: ${subCatData.title}`);
        } else {
            console.log(`  ~ Danh mục con đã tồn tại: ${subCatData.title}`);
        }
    }
};
