document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".blog-card");

    cards.forEach(card => {
        // Click toàn card → chuyển sang trang detail
        card.addEventListener("click", () => {
            const link = card.dataset.href;
            if (link) window.location.href = link;
        });
    });
});
