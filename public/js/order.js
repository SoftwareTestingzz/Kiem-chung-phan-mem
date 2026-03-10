document.addEventListener("DOMContentLoaded", () => {
    const cancelButtons = document.querySelectorAll(".btn-cancel-order");

    cancelButtons.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();

            const orderId = btn.dataset.id;
            if (!orderId) return;

            // Confirm SweetAlert
            const confirmResult = await Swal.fire({
                icon: "warning",
                title: "Hủy đơn hàng?",
                text: "Bạn có chắc chắn muốn hủy đơn này?",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Không"
            });

            if (!confirmResult.isConfirmed) return;

            try {
                // Gửi yêu cầu hủy đơn
                const res = await fetch(`/orders/${orderId}/cancel`, {
                    method: "POST"
                });

                // Vì server redirect → res.redirect = true
                if (res.redirected) {
                    await Swal.fire({
                        icon: "success",
                        title: "Đã hủy đơn hàng",
                        text: "Đơn hàng đã được hủy thành công!"
                    });
                    window.location.href = res.url;
                    return;
                }

                // Nếu không redirect, thử parse JSON (phòng trường hợp server trả JSON)
                const data = await res.json().catch(() => null);

                if (data && data.success) {
                    await Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: data.message
                    });
                    window.location.reload();
                } else {
                    Swal.fire("Lỗi", data?.message || "Không thể hủy đơn hàng!", "error");
                }

            } catch (err) {
                console.error(err);
                Swal.fire("Lỗi", "Không thể hủy đơn hàng!", "error");
            }
        });
    });
});
