document.addEventListener('DOMContentLoaded', function () {
  const starLabels = document.querySelectorAll('.rating-stars .star');

  if (!starLabels.length) return;

  starLabels.forEach(label => {
    label.addEventListener('click', function () {
      const value = parseInt(this.dataset.value, 10);

      // chọn radio tương ứng
      const radio = this.querySelector(`input[name="rating"][value="${value}"]`)
        || document.querySelector(`input[name="rating"][value="${value}"]`);

      if (radio) {
        radio.checked = true;
      }

      // tô sáng các sao <= value
      starLabels.forEach(star => {
        const starValue = parseInt(star.dataset.value, 10);
        if (starValue <= value) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });
    });
  });

  // Handle Review Form Submission via AJAX
  const reviewForm = document.querySelector('.review-form');
  const commentTextarea = document.querySelector('#content');
  const charCountDisplay = document.querySelector('#charCount');

  if (commentTextarea && charCountDisplay) {
    commentTextarea.addEventListener('input', function () {
      charCountDisplay.textContent = this.value.length;
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const rating = formData.get('rating');
      const content = (formData.get('content') || '').trim();

      if (content.length > 5000) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Nội dung bình luận không được vượt quá 5000 kí tự.'
        });
        return;
      }

      const data = {
        rating: rating,
        content: content
      };

      try {
        const response = await fetch(this.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: result.message || 'Bình luận của bạn đã được gửi.',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: result.message || 'Đã có lỗi xảy ra, vui lòng thử lại.'
          });
        }
      } catch (error) {
        console.error('Review Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi hệ thống',
          text: 'Không thể gửi bình luận lúc này.'
        });
      }
    });
  }
});
