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
});
