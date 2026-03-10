document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[action="/password/forgot"]');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[name="email"]').value;
            
            try {
                const response = await fetch('/password/forgot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: data.message || 'Mã OTP đã được gửi vào email của bạn',
                        confirmButtonText: 'OK'
                    });
                    
                    window.location.href = `/password/verify-otp`;
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: data.message || 'Có lỗi xảy ra, vui lòng thử lại'
                    });
                }
            } catch (err) {
                console.error('Error:', err);
                await Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Không thể gửi yêu cầu. Vui lòng thử lại.'
                });
            }
        });
    }
});
