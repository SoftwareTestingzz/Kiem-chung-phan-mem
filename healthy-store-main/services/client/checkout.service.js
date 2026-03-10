const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

// helper price calc (same logic as cart.service)
function calcPrice(product) {
    const discount = product.discountPercentage || 0;
    return Math.round(product.price * (100 - discount) / 100);
}

/* ======================================================
   LẤY DANH SÁCH SẢN PHẨM ĐƯỢC CHỌN ĐỂ THANH TOÁN
====================================================== */
module.exports.getSelectedItems = async (req, selectedItems) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) {
            throw new Error("Bạn chưa đăng nhập!");
        }

        if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
            
        }

        const cart = await Cart.findOne({ userId });
        if (!cart || !cart.items || cart.items.length === 0) {
            
        }

        // Lọc các item được chọn
        const selected = cart.items.filter(item =>
            selectedItems.includes(item.productId.toString())
        );

        if (selected.length === 0) {
            
        }

        const total = selected.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        return {
            items: selected,
            total
        };

    } catch (err) {
        console.error("Get Selected Items Error:", err);
    
    }
};



/* ======================================================
   TẠO ĐƠN HÀNG – KIỂM TRA TỒN KHO – TRỪ KHO – XÓA GIỎ
====================================================== */
module.exports.createOrder = async (req, selectedItems) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) {
            throw new Error("Bạn chưa đăng nhập!");
        }

        if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
            
        }

        const { name, phone, address } = req.body;

        // Kiểm tra thông tin giao hàng
        if (!name || !phone || !address) {
            throw new Error("Vui lòng nhập đầy đủ thông tin giao hàng!");
        }

        const cart = await Cart.findOne({ userId });
        if (!cart || !cart.items || cart.items.length === 0) {
            
        }

        // Lọc các item được chọn
        const selected = cart.items.filter(item =>
            selectedItems.includes(item.productId.toString())
        );

        if (selected.length === 0) {
          
        }

        /* ======================================================
           KIỂM TRA TỒN KHO
        ====================================================== */
        for (const item of selected) {
            const product = await Product.findById(item.productId);

            if (!product) {
                
            }

            if (product.stock < item.quantity) {
                throw new Error(
                  
                );
            }
        }

        /* ======================================================
           TRỪ TỒN KHO
        ====================================================== */
        for (const item of selected) {
            const product = await Product.findById(item.productId);
            product.stock -= item.quantity;
            await product.save();
        }

        /* ======================================================
           TẠO ĐƠN HÀNG
        ====================================================== */
        const totalPrice = selected.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            userId,
            items: selected,
            total: totalPrice,
            shippingInfo: {
                name,
                phone,
                address
            },
            status: "pending",
            createdAt: new Date()
        });

        /* ======================================================
           XÓA ITEM ĐÃ ĐẶT KHỎI GIỎ HÀNG
        ====================================================== */
        cart.items = cart.items.filter(
            item => !selectedItems.includes(item.productId.toString())
        );

        await cart.save();

        return order;

    } catch (err) {
        console.error("Create Order Error:", err);
        throw new Error(err.message || "Không thể tạo đơn hàng!");
    }
};


/* ======================================================
   LẤY DANH SÁCH SẢN PHẨM TỪ PAYLOAD (DIRECT ITEMS)
   payload = [{ productId, quantity }, ...]
====================================================== */
module.exports.getSelectedItemsFromPayload = async (req, payload) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) {
            throw new Error("Bạn chưa đăng nhập!");
        }

        if (!Array.isArray(payload) || payload.length === 0) {
            throw new Error("Không có sản phẩm để thanh toán!");
        }

        const items = [];
        for (const p of payload) {
            const pid = p.productId || p.id || p.product || '';
            const qty = parseInt(p.quantity) || 1;

            const product = await Product.findById(pid);
            if (!product) throw new Error('Sản phẩm không tồn tại!');

            const price = calcPrice(product);

            if (qty > product.stock) throw new Error('Không đủ hàng cho sản phẩm: ' + (product.title || ''));

            items.push({
                productId: product._id,
                title: product.title,
                price,
                thumbnail: product.thumbnail,
                quantity: qty,
                maxStock: product.stock
            });
        }

        const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

        return { items, total };
    } catch (err) {
        console.error('Get Selected Items From Payload Error:', err);
        throw err;
    }
};


/* ======================================================
   TẠO ĐƠN HÀNG TRỰC TIẾP TỪ PAYLOAD (KHÔNG CHẠY QUA GIỎ)
   payload = [{ productId, quantity }, ...]
====================================================== */
module.exports.createOrderFromPayload = async (req, payload) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) {
            throw new Error("Bạn chưa đăng nhập!");
        }

        if (!Array.isArray(payload) || payload.length === 0) {
            throw new Error("Không có sản phẩm để đặt hàng!");
        }

        const { name, phone, address } = req.body;
        if (!name || !phone || !address) throw new Error('Vui lòng nhập đầy đủ thông tin giao hàng!');

        // Build selected items from payload and check stock
        const selected = [];
        for (const p of payload) {
            const pid = p.productId || p.id || p.product || '';
            const qty = parseInt(p.quantity) || 1;

            const product = await Product.findById(pid);
            if (!product) throw new Error('Sản phẩm không tồn tại!');

            if (product.stock < qty) throw new Error('Không đủ hàng cho sản phẩm: ' + (product.title || ''));

            const price = calcPrice(product);

            selected.push({
                productId: product._id,
                title: product.title,
                price,
                thumbnail: product.thumbnail,
                quantity: qty
            });
        }

        // Trừ tồn kho
        for (const item of selected) {
            const product = await Product.findById(item.productId);
            product.stock -= item.quantity;
            await product.save();
        }

        const totalPrice = selected.reduce((sum, i) => sum + i.price * i.quantity, 0);

        const order = await Order.create({
            userId,
            items: selected,
            total: totalPrice,
            shippingInfo: { name, phone, address },
            status: 'pending',
            createdAt: new Date()
        });

        return order;
    } catch (err) {
        console.error('Create Order From Payload Error:', err);
        throw new Error(err.message || 'Không thể tạo đơn hàng từ payload');
    }
};
