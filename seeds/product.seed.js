const Product = require('../models/product.model');
const Category = require('../models/category.model');

const productTemplates = [
    // Vitamin tổng hợp
    {
        title: "Vitamin tổng hợp Multivitamin A-Z",
        description: "<p>Viên uống Multivitamin A-Z cung cấp đầy đủ 13 loại vitamin thiết yếu và 10 khoáng chất quan trọng cho cơ thể. Giúp tăng cường hệ miễn dịch, hỗ trợ sức khỏe toàn diện và bổ sung năng lượng cho ngày dài hoạt động.</p><p><b>Thành phần:</b> Vitamin A, B1, B2, B6, B12, C, D3, E, K, Acid Folic, Biotin, Canxi, Kẽm, Sắt, Magie...</p><p><b>Cách dùng:</b> Uống 1 viên/ngày sau bữa ăn sáng.</p>",
        price: 320000,
        discountPercentage: 10,
        stock: 150,
        thumbnail: "https://placehold.co/600x600/4ade80/ffffff?text=Multivitamin+A-Z",
        status: "active",
        position: 1,
        categoryTitle: "Vitamin tổng hợp"
    },
    {
        title: "Centrum Silver Adults 50+",
        description: "<p>Centrum Silver Adults 50+ là công thức dinh dưỡng chuyên dành cho người trên 50 tuổi. Bổ sung đầy đủ vi chất dinh dưỡng thiết yếu, hỗ trợ sức khỏe tim mạch, mắt và hệ miễn dịch.</p><p><b>Cách dùng:</b> Uống 1 viên/ngày sau bữa ăn.</p>",
        price: 450000,
        discountPercentage: 0,
        stock: 80,
        thumbnail: "https://placehold.co/600x600/86efac/ffffff?text=Centrum+Silver",
        status: "active",
        position: 2,
        categoryTitle: "Vitamin tổng hợp"
    },
    {
        title: "Vitamin C 1000mg với Zinc",
        description: "<p>Viên sủi Vitamin C 1000mg kết hợp Kẽm (Zinc) giúp tăng cường hệ miễn dịch, chống oxy hóa mạnh mẽ. Hương chanh tươi mát, dễ uống.</p>",
        price: 185000,
        discountPercentage: 15,
        stock: 200,
        thumbnail: "https://placehold.co/600x600/bbf7d0/333333?text=Vitamin+C+1000mg",
        status: "active",
        position: 3,
        categoryTitle: "Vitamin tổng hợp"
    },
    // Omega 3 & Dầu cá
    {
        title: "Omega-3 Triple Strength Fish Oil 1200mg",
        description: "<p>Dầu cá Omega-3 Triple Strength cung cấp 1200mg axit béo omega-3 mỗi viên, gồm EPA và DHA. Hỗ trợ sức khỏe tim mạch, cải thiện trí nhớ và giảm viêm khớp hiệu quả.</p><p><b>Cách dùng:</b> Uống 1-2 viên/ngày trong bữa ăn.</p>",
        price: 290000,
        discountPercentage: 5,
        stock: 120,
        thumbnail: "https://placehold.co/600x600/6ee7b7/ffffff?text=Omega-3+Fish+Oil",
        status: "active",
        position: 1,
        categoryTitle: "Omega 3 & Dầu cá"
    },
    {
        title: "Nordic Naturals Omega-3 Lemon",
        description: "<p>Dầu cá chất lượng cao Nordic Naturals với hương chanh tự nhiên, không gây mùi tanh. Chứa EPA + DHA giúp hỗ trợ sức khỏe não bộ và tim mạch tối ưu.</p>",
        price: 520000,
        discountPercentage: 0,
        stock: 60,
        thumbnail: "https://placehold.co/600x600/a7f3d0/333333?text=Nordic+Omega-3",
        status: "active",
        position: 2,
        categoryTitle: "Omega 3 & Dầu cá"
    },
    // Canxi & Xương khớp
    {
        title: "Canxi Nano MK7 + Vitamin D3",
        description: "<p>Viên uống Canxi Nano với kích thước siêu nhỏ giúp hấp thụ tốt hơn đến 5 lần so với canxi thông thường. Kết hợp Vitamin D3 và K2 (MK7) giúp vận chuyển canxi vào xương hiệu quả.</p>",
        price: 265000,
        discountPercentage: 12,
        stock: 180,
        thumbnail: "https://placehold.co/600x600/34d399/ffffff?text=Canxi+Nano+MK7",
        status: "active",
        position: 1,
        categoryTitle: "Canxi & Xương khớp"
    },
    {
        title: "Glucosamine 1500mg + Chondroitin",
        description: "<p>Glucosamine kết hợp Chondroitin hỗ trợ tái tạo sụn khớp, giảm đau và viêm khớp. Sản phẩm phù hợp cho người bị thoái hóa khớp, đau lưng, đau gối.</p>",
        price: 380000,
        discountPercentage: 8,
        stock: 90,
        thumbnail: "https://placehold.co/600x600/6ee7b7/ffffff?text=Glucosamine",
        status: "active",
        position: 2,
        categoryTitle: "Canxi & Xương khớp"
    },
    // Trà thảo dược
    {
        title: "Trà Atiso Đà Lạt hộp 20 túi",
        description: "<p>Trà Atiso Đà Lạt được thu hái từ vùng cao nguyên tươi mát Đà Lạt, chưng cất theo quy trình khép kín. Hỗ trợ thanh nhiệt, giải độc gan, lợi mật, tiêu hóa tốt.</p><p><b>Cách dùng:</b> Hãm 1 túi với 200ml nước sôi, thưởng thức sau 3-5 phút.</p>",
        price: 75000,
        discountPercentage: 0,
        stock: 300,
        thumbnail: "https://placehold.co/600x600/bbf7d0/333333?text=Tra+Atiso",
        status: "active",
        position: 1,
        categoryTitle: "Trà thảo dược"
    },
    {
        title: "Trà xanh Matcha hữu cơ Nhật Bản",
        description: "<p>Matcha hữu cơ Nhật Bản cao cấp từ vùng Uji, Kyoto. Giàu chất chống oxy hóa EGCG, tăng cường trao đổi chất, hỗ trợ giảm cân và tăng cường năng lượng tự nhiên.</p>",
        price: 195000,
        discountPercentage: 5,
        stock: 150,
        thumbnail: "https://placehold.co/600x600/4ade80/ffffff?text=Matcha+Nhat",
        status: "active",
        position: 2,
        categoryTitle: "Trà thảo dược"
    },
    {
        title: "Trà hoa cúc Chamomile Trellis 30 gói",
        description: "<p>Trà hoa cúc chamomile tự nhiên giúp thư giãn, giảm căng thẳng và cải thiện giấc ngủ. Không cafein, an toàn cho người lớn và trẻ em trên 3 tuổi.</p>",
        price: 120000,
        discountPercentage: 0,
        stock: 200,
        thumbnail: "https://placehold.co/600x600/d1fae5/333333?text=Chamomile",
        status: "active",
        position: 3,
        categoryTitle: "Trà thảo dược"
    },
    // Tinh dầu
    {
        title: "Tinh dầu Tràm Trà (Tea Tree) 10ml",
        description: "<p>Tinh dầu Tràm Trà nguyên chất 100% từ Úc, có đặc tính kháng khuẩn, kháng nấm và kháng viêm tự nhiên. Dùng để chăm sóc da, trị mụn và làm sạch không khí.</p>",
        price: 145000,
        discountPercentage: 0,
        stock: 100,
        thumbnail: "https://placehold.co/600x600/a7f3d0/333333?text=Tea+Tree+Oil",
        status: "active",
        position: 1,
        categoryTitle: "Tinh dầu thiên nhiên"
    },
    {
        title: "Tinh dầu Oải Hương Lavender 15ml",
        description: "<p>Tinh dầu Oải Hương nguyên chất từ vùng Provence, Pháp. Mùi hương thư giãn, giảm căng thẳng, hỗ trợ giấc ngủ sâu và cải thiện tâm trạng.</p>",
        price: 165000,
        discountPercentage: 10,
        stock: 80,
        thumbnail: "https://placehold.co/600x600/86efac/ffffff?text=Lavender+Oil",
        status: "active",
        position: 2,
        categoryTitle: "Tinh dầu thiên nhiên"
    },
    // Whey Protein
    {
        title: "Gold Standard 100% Whey Protein 2lb",
        description: "<p>Gold Standard 100% Whey của Optimum Nutrition là sản phẩm protein #1 thế giới. Chứa 24g protein/khẩu phần từ whey isolate và whey concentrate. Hương Chocolate Fudge thơm ngon.</p><p><b>Cách dùng:</b> Hòa tan 1 muỗng (30g) với 170-230ml nước lạnh hoặc sữa. Dùng sau tập hoặc giữa các bữa ăn.</p>",
        price: 1250000,
        discountPercentage: 5,
        stock: 45,
        thumbnail: "https://placehold.co/600x600/34d399/ffffff?text=Whey+Gold+Standard",
        status: "active",
        position: 1,
        categoryTitle: "Whey Protein"
    },
    {
        title: "Whey Protein Dymatize ISO100 Hương Dâu 1.6lb",
        description: "<p>Dymatize ISO100 sử dụng 100% Whey Protein Isolate được thủy phân, hấp thụ cực nhanh sau tập luyện. Chứa 25g protein và dưới 1g đường mỗi khẩu phần. Hoàn hảo cho người muốn tăng cơ giảm mỡ.</p>",
        price: 890000,
        discountPercentage: 0,
        stock: 30,
        thumbnail: "https://placehold.co/600x600/6ee7b7/ffffff?text=ISO100+Dau",
        status: "active",
        position: 2,
        categoryTitle: "Whey Protein"
    },
    // BCAA
    {
        title: "BCAA 2:1:1 Xtend Original 30 lần dùng",
        description: "<p>Xtend BCAA Original chứa 7g BCAA (tỷ lệ 2:1:1), L-Glutamine và Citrulline Malate. Hỗ trợ phục hồi cơ bắp nhanh chóng, giảm đau nhức sau tập và duy trì hiệu suất luyện tập.</p>",
        price: 650000,
        discountPercentage: 8,
        stock: 55,
        thumbnail: "https://placehold.co/600x600/4ade80/ffffff?text=BCAA+Xtend",
        status: "active",
        position: 1,
        categoryTitle: "BCAA & Amino Acids"
    },
    {
        title: "Creatine Monohydrate 500g",
        description: "<p>Creatine Monohydrate nguyên chất 100%, không mùi không vị, dễ hòa tan. Tăng sức mạnh, bền bỉ và hỗ trợ phục hồi cơ bắp sau tập luyện cường độ cao.</p>",
        price: 320000,
        discountPercentage: 0,
        stock: 70,
        thumbnail: "https://placehold.co/600x600/bbf7d0/333333?text=Creatine",
        status: "active",
        position: 2,
        categoryTitle: "BCAA & Amino Acids"
    }
];

module.exports = async (adminUserId) => {
    // Lấy map tên danh mục -> id
    const categories = await Category.find({ deleted: false });
    const categoryMap = {};
    for (const cat of categories) {
        categoryMap[cat.title] = cat._id.toString();
    }

    for (const template of productTemplates) {
        const { categoryTitle, ...productData } = template;
        const existing = await Product.findOne({ title: productData.title, deleted: false });
        if (!existing) {
            await Product.create({
                ...productData,
                product_category: categoryMap[categoryTitle] || '',
                createdBy: {
                    account_id: adminUserId || '',
                    createdAt: new Date()
                }
            });
            console.log(`  ✓ Đã tạo sản phẩm: ${productData.title}`);
        } else {
            console.log(`  ~ Sản phẩm đã tồn tại: ${productData.title}`);
        }
    }
};
