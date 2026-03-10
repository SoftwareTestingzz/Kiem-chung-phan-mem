document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".otp-group input");
    const hiddenInput = document.getElementById("otp-hidden");
    const verifyForm = document.querySelector('form[action="/password/verify-otp"]');
    const resendForm = document.querySelector('form[action="/password/resend-otp"]');

    let resendCountdown = 0;

    if (!inputs.length) return;

    // ===== AUTO FOCUS + GỘP OTP =====
    inputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            if (input.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            hiddenInput.value = Array.from(inputs).map(i => i.value).join("");
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !input.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    // ===== VERIFY OTP =====
    if (verifyForm) {
        verifyForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const otp = hiddenInput.value;

            if (otp.length !== 6) {
                Swal.fire({
                    icon: "warning",
                    title: "Thiếu OTP",
                    text: "Vui lòng nhập đủ 6 chữ số"
                });
                return;
            }

            try {
                const res = await fetch("/password/verify-otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ otp })
                });

                const result = await res.json();

                if (result.success) {
                    await Swal.fire({
                        icon: "success",
                        title: "Xác thực thành công",
                        text: result.message
                    });

                    window.location.href = "/password/reset-password";
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Lỗi",
                        text: result.message
                    }).then(() => {
                        inputs.forEach(input => input.value = "");
                        hiddenInput.value = "";

                        inputs[0].focus();
                    });
                }
            } catch {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: "Không thể xác thực OTP"
                });
            }
        });
    }

    // ===== RESEND OTP =====
    if (resendForm) {
        resendForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (resendCountdown > 0) return;

            try {
                const res = await fetch("/password/resend-otp", {
                    method: "POST"
                });

                const result = await res.json();

                if (result.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Đã gửi OTP",
                        text: result.message
                    });

                    inputs.forEach(i => i.value = "");
                    startCountdown(60, resendForm.querySelector("button"));
                }
            } catch {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: "Không thể gửi lại OTP"
                });
            }
        });
    }

    function startCountdown(seconds, btn) {
        resendCountdown = seconds;
        btn.disabled = true;

        const timer = setInterval(() => {
            btn.textContent = `Gửi lại OTP (${resendCountdown}s)`;
            resendCountdown--;

            if (resendCountdown < 0) {
                clearInterval(timer);
                btn.disabled = false;
                btn.textContent = "Gửi lại OTP";
            }
        }, 1000);
    }
});
