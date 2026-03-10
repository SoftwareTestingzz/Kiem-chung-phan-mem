document.addEventListener("DOMContentLoaded", () => {
    const mainItems = document.querySelectorAll(".home-category-main-item");
    const panels = document.querySelectorAll(".home-category-panel");
    const detail = document.querySelector(".home-category-detail");
    const wrapper = document.querySelector(".home-category-wrapper");
    const container = document.querySelector(".home-category");

    const activateById = (id) => {
        let hasActivePanel = false;

        mainItems.forEach(item => {
            item.classList.toggle("active", item.dataset.id === id);
        });

        panels.forEach(panel => {
            const isActive = panel.dataset.id === id;
            panel.classList.toggle("active", isActive);
            if (isActive) hasActivePanel = true;
        });

        if (detail) detail.classList.toggle("has-active", hasActivePanel);
        if (wrapper) wrapper.classList.toggle("has-detail", hasActivePanel);
    };

    const resetAll = () => {
        mainItems.forEach(item => item.classList.remove("active"));
        panels.forEach(panel => panel.classList.remove("active"));
        if (detail) detail.classList.remove("has-active");
        if (wrapper) wrapper.classList.remove("has-detail");
    };

    // Hover cha -> đổi panel
    mainItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            activateById(item.dataset.id);
        });
    });

    // Rời khỏi khối category -> tắt hết
    if (container) {
        container.addEventListener("mouseleave", resetAll);
    }

    // Click vào vùng text cha -> đi tới trang danh mục cha
    mainItems.forEach(item => {
        item.addEventListener("click", (e) => {
            if (e.target.tagName.toLowerCase() === "i") return;

            const slug = item.dataset.slug;
            if (slug) {
                window.location.href = `/products?category=${slug}`;
            }
        });
    });
});
