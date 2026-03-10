const Order = require('../../models/order.model');
const User = require('../../models/user.model');
const Product = require('../../models/product.model');

// Tạo dữ liệu test
module.exports.createTestData = async (req, res) => {
    try {
        // Lấy user và product đầu tiên
        const user = await User.findOne({ deleted: false });
        const product = await Product.findOne({ deleted: false });

        if (!user || !product) {
            return res.status(400).json({ error: 'User or Product not found' });
        }

        const testOrders = [];
        
        // Tạo đơn hàng cho 30 ngày gần nhất
        for (let i = 0; i < 30; i++) {
            const orderDate = new Date();
            orderDate.setDate(orderDate.getDate() - i);
            orderDate.setHours(Math.floor(Math.random() * 24), 0, 0, 0);

            const quantity = Math.floor(Math.random() * 5) + 1;
            const price = product.price || 100000;
            const total = quantity * price;

            testOrders.push({
                userId: user._id,
                items: [{
                    productId: product._id,
                    title: product.title || 'Test Product',
                    price: price,
                    thumbnail: product.thumbnail || '',
                    quantity: quantity
                }],
                total: total,
                shippingInfo: {
                    name: 'Khách hàng test',
                    phone: '0123456789',
                    address: 'Hà Nội'
                },
                status: 'completed',
                createdAt: orderDate,
                updatedAt: orderDate
            });
        }

        // Xóa dữ liệu test cũ trước khi thêm mới
        await Order.deleteMany({ 
            'shippingInfo.name': 'Khách hàng test' 
        });

        // Thêm dữ liệu test
        const result = await Order.insertMany(testOrders);

        res.json({
            success: true,
            message: `Đã tạo ${result.length} đơn hàng test`,
            count: result.length
        });
    } catch (error) {
        console.error('Error creating test data:', error);
        res.status(500).json({ error: error.message });
    }
};
