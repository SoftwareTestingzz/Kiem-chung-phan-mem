document.addEventListener('DOMContentLoaded', () => {
    const buyBtn = document.querySelector('.btn-buy-now');
    const qtyInput = document.querySelector('.qty-input');
    const addCartBtn = document.querySelector('.btn-add-cart');

    if (!buyBtn || !addCartBtn || !qtyInput) return;

    buyBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const productId = buyBtn.getAttribute('data-id') || addCartBtn.getAttribute('data-id');
        const stock = parseInt(buyBtn.getAttribute('data-stock') || addCartBtn.getAttribute('data-stock') || '0');
        let qty = parseInt(qtyInput.value) || 1;

        if (qty < 1) qty = 1;
        if (stock && qty > stock) {
            Swal.fire({ icon: 'error', title: 'Số lượng vượt quá tồn kho' });
            return;
        }
        // Nếu chưa đăng nhập → hiển thị modal yêu cầu đăng nhập
        const logged = buyBtn.getAttribute('data-logged') === '1';
        if (!logged) {
            const result = await Swal.fire({
                icon: 'info',
                title: 'Bạn cần đăng nhập',
                text: 'Vui lòng đăng nhập để tiếp tục mua hàng',
                showCancelButton: true,
                confirmButtonText: 'Đăng nhập',
                cancelButtonText: 'Hủy'
            });

            if (result.isConfirmed) {
                window.location.href = '/login';
            }
            return;
        }

        // Đã đăng nhập → tiến hành direct checkout (không thêm vào giỏ)
        try {
            const payload = [{ productId, quantity: qty }];

            const confirm = await Swal.fire({
                icon: 'success',
                title: 'Chuyển tới thanh toán',
                text: 'Bạn sẽ được chuyển tới trang thanh toán',
                showConfirmButton: true,
                confirmButtonText: 'Tiếp tục'
            });

            if (!confirm.isConfirmed) return;

            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/checkout';
            form.style.display = 'none';

            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'directItems';
            input.value = JSON.stringify(payload);
            form.appendChild(input);

            document.body.appendChild(form);
            form.submit();

        } catch (err) {
            console.error('Buy Now Error:', err);
            Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Vui lòng thử lại' });
        }
    });
});
