document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('form[action="/password/reset-password"]');
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch("/password/reset-password", {
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
                    confirmButtonText: "Đăng nhập",
                    allowOutsideClick: false
                }).then(() => {
                    window.location.href = "/login";
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: result.message
                });
            }
        } catch {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Đã có lỗi xảy ra, vui lòng thử lại"
            });
        }
    });
});
