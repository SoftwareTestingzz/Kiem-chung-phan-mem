document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#checkoutForm");
    const btn = document.querySelector("#btnPlaceOrder");
    const selectedItemsInput = document.querySelector("#selectedItemsInput");
    const directItemsInput = document.querySelector('#directItemsInput');

    if (!form) return;

    // ✅ KIỂM TRA ĐĂNG NHẬP TRƯỚC KHI BẤM ĐẶT HÀNG
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!isLoggedIn) {
            Swal.fire({
                icon: "warning",
                title: "Chưa đăng nhập",
                text: "Vui lòng đăng nhập để đặt hàng",
                confirmButtonText: "Đăng nhập",
                showCancelButton: true,
                cancelButtonText: "Hủy"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/login";
                }
            });
            return;
        }

        // Debug kiểm tra dữ liệu
        console.log("Selected Items tại trang checkout:", selectedItemsInput?.value);

        // ============================
        // KIỂM TRA selectedItems hoặc directItems
        // ============================
        let parsedSelected = [];
        if (directItemsInput && directItemsInput.value) {
            try {
                parsedSelected = JSON.parse(directItemsInput.value);
            } catch (err) {
                return;
            }
        } else {
            if (!selectedItemsInput || !selectedItemsInput.value) return;

            try {
                parsedSelected = JSON.parse(selectedItemsInput.value);
            } catch (err) {
                return;
            }
        }

        if (!Array.isArray(parsedSelected) || parsedSelected.length === 0) return;

        // Disable nút để tránh spam
        btn.disabled = true;
        btn.innerText = "Đang xử lý...";

        // Lấy dữ liệu từ form
        const formData = new FormData(form);
        let data = Object.fromEntries(formData);

        // ⭐ THÊM selectedItems HOẶC directItems VÀO DATA GỬI LÊN BACKEND ⭐
        if (directItemsInput && directItemsInput.value) {
            data.directItems = directItemsInput.value;
        } else {
            data.selectedItems = selectedItemsInput.value;
        }

        try {
            const res = await fetch("/checkout/place-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const json = await res.json();

            if (json.success) {
                Swal.fire({
                    icon: "success",
                    title: "Đặt hàng thành công!",
                    text: "Mã đơn hàng: " + json.orderId,
                    confirmButtonText: "Xem đơn hàng"
                }).then(() => {
                    window.location.href = "/orders/" + json.orderId;
                });

            } else {
                // ✅ Nếu cần đăng nhập
                if (json.requireLogin) {
                    Swal.fire({
                        icon: "warning",
                        title: "Chưa đăng nhập",
                        text: json.message,
                        confirmButtonText: "Đăng nhập"
                    }).then(() => {
                        window.location.href = "/login";
                    });
                } else {
                    Swal.fire("Lỗi!", json.message, "error");
                }
            }

        } catch (error) {
            Swal.fire("Lỗi kết nối!", "Không thể gửi đơn hàng.", "error");

        } finally {
            btn.disabled = false;
            btn.innerText = "Đặt hàng";
        }

    });

});
