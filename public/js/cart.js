// ===============================
// CART SYSTEM FRONT-END (FULL)
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // 1) THÊM SẢN PHẨM VÀO GIỎ
    // ============================================================

    const addButtons = document.querySelectorAll(".btn-add-cart");

    addButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // ✅ KIỂM TRA ĐĂNG NHẬP TRƯỚC
            if (!isLoggedIn) {
                Swal.fire({
                    icon: "warning",
                    title: "Chưa đăng nhập",
                    text: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
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

            const id = btn.dataset.id;
            const title = btn.dataset.title;
            const image = btn.dataset.image;
            const stock = parseInt(btn.dataset.stock);

            Swal.fire({
                title: "Chọn số lượng",
                html: `
                    <p><strong>${title}</strong></p>
                    <img src="${image}" style="width:130px;border-radius:10px;margin-bottom:10px;">
                    <input id="qtyInput" type="number" min="1" max="${stock}" value="1" class="swal2-input">
                    <p style="font-size:14px;color:#777;">Tồn kho: ${stock}</p>
                `,
                confirmButtonText: "Thêm vào giỏ",
                showCancelButton: true,
                cancelButtonText: "Hủy",
                preConfirm: () => {
                    const qty = parseInt(document.getElementById("qtyInput").value);
                    if (qty < 1 || qty > stock) {
                        Swal.showValidationMessage(`Số lượng phải từ 1 → ${stock}`);
                        return false;
                    }
                    return qty;
                }
            }).then(result => {
                if (result.isConfirmed) addToCart(id, result.value);
            });
        });
    });

    async function addToCart(productId, quantity) {
        try {
            const res = await fetch("/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity })
            });

            const data = await res.json();

            if (data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Đã thêm vào giỏ hàng!",
                    timer: 1200,
                    showConfirmButton: false
                }).then(() => location.reload());
            } else {
                // ✅ Nếu cần đăng nhập, chuyển hướng
                if (data.requireLogin) {
                    Swal.fire({
                        icon: "warning",
                        title: "Chưa đăng nhập",
                        text: data.message,
                        confirmButtonText: "Đăng nhập"
                    }).then(() => {
                        window.location.href = "/login";
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Lỗi!",
                        text: data.message
                    });
                }
            }

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Lỗi hệ thống",
                text: "Vui lòng thử lại!"
            });
        }
    }



    // ============================================================
    // 2) CẬP NHẬT SỐ LƯỢNG
    // ============================================================

    const qtyInputs = document.querySelectorAll(".qty-box");

    qtyInputs.forEach(input => {
        input.addEventListener("change", async () => {
            const id = input.dataset.id;
            let qty = parseInt(input.value);

            if (qty < 1) qty = 1;

            try {
                await fetch("/cart/update", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: id, quantity: qty })
                });

                updateTotal();
            } catch (err) {
                Swal.fire({ icon: "error", title: "Không thể cập nhật!" });
            }
        });
    });



    // ============================================================
    // 3) XÓA 1 SẢN PHẨM
    // ============================================================

    const deleteButtons = document.querySelectorAll(".btn-delete");

    deleteButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;

            Swal.fire({
                icon: "warning",
                title: "Xóa sản phẩm?",
                showCancelButton: true,
                confirmButtonText: "Xóa",
                cancelButtonText: "Hủy"
            }).then(async (result) => {
                if (!result.isConfirmed) return;

                try {
                    const res = await fetch("/cart/delete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ productId: id })
                    });

                    const data = await res.json();

                    if (data.success) {
                        location.reload();
                    } else {
                        // ✅ Nếu cần đăng nhập
                        if (data.requireLogin) {
                            Swal.fire({
                                icon: "warning",
                                title: "Chưa đăng nhập",
                                text: data.message,
                                confirmButtonText: "Đăng nhập"
                            }).then(() => {
                                window.location.href = "/login";
                            });
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Lỗi",
                                text: data.message
                            });
                        }
                    }
                } catch (err) {
                    Swal.fire({ icon: "error", title: "Không thể xóa sản phẩm!" });
                }
            });
        });
    });



    // ============================================================
    // 4) XÓA TOÀN BỘ GIỎ
    // ============================================================

    const clearBtn = document.getElementById("btnClearAll");

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            Swal.fire({
                icon: "warning",
                title: "Xóa toàn bộ giỏ hàng?",
                showCancelButton: true,
                confirmButtonText: "Xóa hết",
                cancelButtonText: "Hủy"
            }).then(async (result) => {
                if (!result.isConfirmed) return;

                await fetch("/cart/clear", { method: "POST" });
                location.reload();
            });
        });
    }



    // ============================================================
    // 5) TÍNH TỔNG TIỀN SẢN PHẨM ĐÃ CHỌN (TRANG GIỎ HÀNG)
    // ============================================================

    const checkboxes = document.querySelectorAll(".select-item");
    const totalDisplay = document.getElementById("selectedTotal") || document.getElementById("totalPrice");
    const hiddenInput = document.getElementById("selectedItemsInput");

    function updateTotal() {
        if (!checkboxes || checkboxes.length === 0) return;

        let selectedIds = [];
        let total = 0;

        document.querySelectorAll("tbody tr").forEach(row => {
            const cb = row.querySelector(".select-item");
            if (cb && cb.checked) {
                const id = cb.dataset.id;
                const price = parseFloat(row.querySelector(".price").dataset.value);
                const qty = parseInt(row.querySelector(".qty-box").value);

                selectedIds.push(id);
                total += price * qty;
            }
        });

        if (hiddenInput) {
            hiddenInput.value = JSON.stringify(selectedIds);
        }

        if (totalDisplay) {
            // ✅ FORMAT VND – KHÔNG ĐỔI LOGIC
            totalDisplay.textContent = total.toLocaleString("vi-VN") + " VND";
        }
    }

    if (checkboxes && checkboxes.length > 0) {
        checkboxes.forEach(cb => cb.addEventListener("change", updateTotal));
        qtyInputs.forEach(input => input.addEventListener("change", updateTotal));
        updateTotal();
    }

    // ============================================================
    // NGĂT SUBMIT KHI KHÔNG CHỌN SẢN PHẨM (Tiến hành đặt hàng)
    // ============================================================
    const cartForm = document.querySelector("form[action='/checkout']");
    if (cartForm) {
        cartForm.addEventListener("submit", (e) => {
            const anyChecked = Array.from(document.querySelectorAll(".select-item")).some(cb => cb.checked);
            if (!anyChecked) {
                e.preventDefault();
                Swal.fire({
                    icon: "error",
                    title: "Vui lòng chọn sản phẩm đặt hàng!"
                });
                return false;
            }
        });
    }
});
