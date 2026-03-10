const Order = require('../models/order.model');
const UserClient = require('../models/user-client');
const Product = require('../models/product.model');

module.exports = async () => {
    // Lấy danh sách khách hàng và sản phẩm đã có trong DB
    const users = await UserClient.find({ deleted: false }).limit(5);
    const products = await Product.find({ deleted: false, status: 'active' }).limit(10);

    if (users.length === 0) {
        console.log('  ⚠ Không có khách hàng nào, bỏ qua seed đơn hàng.');
        return;
    }
    if (products.length === 0) {
        console.log('  ⚠ Không có sản phẩm nào, bỏ qua seed đơn hàng.');
        return;
    }

    const statuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];

    const ordersTemplate = [
        {
            userIndex: 0,
            items: [
                { productIndex: 0, quantity: 2 },
                { productIndex: 3, quantity: 1 }
            ],
            shippingInfo: {
                name: "Nguyễn Văn An",
                phone: "0901234567",
                address: "123 Nguyễn Huệ, Quận 1, TP.HCM"
            },
            status: "completed"
        },
        {
            userIndex: 1,
            items: [
                { productIndex: 1, quantity: 1 },
                { productIndex: 5, quantity: 2 }
            ],
            shippingInfo: {
                name: "Trần Thị Bình",
                phone: "0912345678",
                address: "456 Lê Lợi, Quận 3, TP.HCM"
            },
            status: "shipping"
        },
        {
            userIndex: 2,
            items: [
                { productIndex: 7, quantity: 3 }
            ],
            shippingInfo: {
                name: "Phạm Minh Châu",
                phone: "0923456789",
                address: "789 Hai Bà Trưng, Quận Bình Thạnh, TP.HCM"
            },
            status: "confirmed"
        },
        {
            userIndex: 0,
            items: [
                { productIndex: 2, quantity: 1 },
                { productIndex: 6, quantity: 1 },
                { productIndex: 8, quantity: 2 }
            ],
            shippingInfo: {
                name: "Nguyễn Văn An",
                phone: "0901234567",
                address: "123 Nguyễn Huệ, Quận 1, TP.HCM"
            },
            status: "pending"
        },
        {
            userIndex: 3,
            items: [
                { productIndex: 4, quantity: 1 }
            ],
            shippingInfo: {
                name: "Lê Quốc Dũng",
                phone: "0934567890",
                address: "321 Đinh Tiên Hoàng, Quận Bình Thạnh, TP.HCM"
            },
            status: "cancelled",
            isHiddenForAdmin: false
        },
        {
            userIndex: 4,
            items: [
                { productIndex: 9, quantity: 1 },
                { productIndex: 0, quantity: 1 }
            ],
            shippingInfo: {
                name: "Hoàng Thị Mai",
                phone: "0945678901",
                address: "654 Cách Mạng Tháng 8, Quận Tân Bình, TP.HCM"
            },
            status: "completed"
        },
        {
            userIndex: 1,
            items: [
                { productIndex: 3, quantity: 2 },
                { productIndex: 5, quantity: 1 }
            ],
            shippingInfo: {
                name: "Trần Thị Bình",
                phone: "0912345678",
                address: "456 Lê Lợi, Quận 3, TP.HCM"
            },
            status: "completed"
        }
    ];

    const existingCount = await Order.countDocuments();
    if (existingCount > 0) {
        console.log(`  ~ Đã có ${existingCount} đơn hàng trong DB, bỏ qua seed đơn hàng.`);
        return;
    }

    for (const template of ordersTemplate) {
        const user = users[template.userIndex] || users[0];

        const items = template.items
            .filter(item => products[item.productIndex])
            .map(item => {
                const product = products[item.productIndex];
                const discountedPrice = product.discountPercentage > 0
                    ? Math.round(product.price * (1 - product.discountPercentage / 100))
                    : product.price;
                return {
                    productId: product._id,
                    title: product.title,
                    price: discountedPrice,
                    thumbnail: product.thumbnail || '',
                    quantity: item.quantity
                };
            });

        if (items.length === 0) continue;

        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        await Order.create({
            userId: user._id,
            items,
            total,
            shippingInfo: template.shippingInfo,
            status: template.status,
            isHiddenForAdmin: template.isHiddenForAdmin || false
        });

        console.log(`  ✓ Đã tạo đơn hàng cho: ${template.shippingInfo.name} (${template.status}) - ${total.toLocaleString('vi-VN')}đ`);
    }
};
