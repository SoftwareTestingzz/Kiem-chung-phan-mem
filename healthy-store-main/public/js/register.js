document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('form[action="/register"]');
    
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        if (data.password !== data.confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Mật khẩu không khớp!"
            });
            return;
        }

        try {
            const res = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: result.message,
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.href = "/register/verify-otp";
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: result.message
                });
            }
        } catch (err) {
            console.error("Error:", err);
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Không thể gửi yêu cầu. Vui lòng thử lại."
            });
        }
    });
});
