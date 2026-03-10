document.addEventListener("DOMContentLoaded", () => {
    const btnEdit = document.querySelector(".btn-edit");
    const btnSave = document.querySelector(".btn-save");
    const btnCancel = document.querySelector(".btn-cancel");

    const inputs = document.querySelectorAll(".profile-input");
    const genderInputs = document.querySelectorAll("input[name='gender']");
    const avatarInput = document.querySelector("#avatarInput");
    const avatarPreview = document.querySelector("#avatarPreview");

    // BẬT CHẾ ĐỘ CHỈNH SỬA
    btnEdit.addEventListener("click", () => {
        inputs.forEach(i => i.disabled = false);
        genderInputs.forEach(i => i.disabled = false);
        avatarInput.disabled = false;

        btnEdit.style.display = "none";
        btnSave.style.display = "inline-block";
        btnCancel.style.display = "inline-block";
    });

    // HỦY CHỈNH SỬA → tải lại dữ liệu ban đầu
    btnCancel.addEventListener("click", () => {
        window.location.reload();
    });

    // PREVIEW ẢNH NGAY LẬP TỨC
    avatarInput.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            avatarPreview.src = URL.createObjectURL(file);
        }
    });

    // LƯU THÔNG TIN BẰNG AJAX (KHÔNG LOAD TRANG)
    btnSave.addEventListener("click", async () => {
        const form = document.querySelector("#profileForm");
        const formData = new FormData(form);

        try {
            const res = await fetch("/profile", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (!data.success) {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: data.message || "Không thể cập nhật thông tin!"
                });
                return;
            }

            // CẬP NHẬT HEADER (Tên + Avatar)
            if (data.user) {
                const headerName = document.querySelector("#headerUserName");
                if (headerName) headerName.textContent = data.user.fullName;

                const headerAvatar = document.querySelector(".avatar-small");
                if (headerAvatar && data.user.avatar) {
                    headerAvatar.src = data.user.avatar;
                }
            }

            // CẬP NHẬT ẢNH HIỂN THỊ LỚN
            if (data.user.avatar) {
                avatarPreview.src = data.user.avatar;
            }

            // KHÓA INPUT SAU KHI LƯU
            inputs.forEach(i => i.disabled = true);
            genderInputs.forEach(i => i.disabled = true);
            avatarInput.disabled = true;

            btnEdit.style.display = "inline-block";
            btnSave.style.display = "none";
            btnCancel.style.display = "none";

            // Popup đẹp bằng SweetAlert2
            Swal.fire({
                icon: "success",
                title: "Cập nhật thành công!",
                text: "Thông tin của bạn đã được lưu.",
                confirmButtonColor: "#4CAF50"
            });

        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Lỗi kết nối",
                text: "Không thể gửi cập nhật!"
            });
        }
    });
});
