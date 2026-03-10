document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelector(".slides");
    
    const dotsContainer = document.querySelector(".dots");

    // Nếu không có slider hoặc không có container dots -> thoát, không chạy nữa
    if (!slides || !dotsContainer) return;

    const images = slides.querySelectorAll("img");
    if (!images.length) return;

    let current = 0;
    let imageWidth = images[0].clientWidth;

    // Cập nhật width khi resize (đảm bảo slide đúng vị trí trên màn hình khác nhau)
    const updateWidth = () => {
        imageWidth = images[0].clientWidth;
        // Khi đổi width, cập nhật lại vị trí hiện tại
        slides.style.transition = "none";
        slides.style.transform = `translateX(-${current * imageWidth}px)`;
    };

    window.addEventListener("resize", updateWidth);

    // Tạo dots
    images.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            current = i;
            updateSlide();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".dot");

    function updateSlide() {
        slides.style.transition = "transform 0.3s ease"; // animate khi chuyển
        slides.style.transform = `translateX(-${current * imageWidth}px)`;
        dots.forEach(dot => dot.classList.remove("active"));
        dots[current].classList.add("active");
    }

    // Auto-slide (chỉ cần nếu có >1 ảnh)
    if (images.length > 1) {
        setInterval(() => {
            current = (current + 1) % images.length;
            updateSlide();
        }, 5000);
    }

    // Khởi tạo slide đầu tiên
    updateWidth();
    updateSlide();
});
