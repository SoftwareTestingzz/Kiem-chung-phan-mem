
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("userMenuToggle");
    const dropdown = document.getElementById("userDropdown");

    if (toggle && dropdown) {
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("show");
        });

        document.addEventListener("click", () => {
            dropdown.classList.remove("show");
        });

        dropdown.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    // ========== HEADER SEARCH ==========
    const searchInput = document.getElementById("filter-search");
    const searchBtn   = document.getElementById("filter-search-btn");
    if (!searchInput || !searchBtn) return;

    const isProductsPage = window.location.pathname.startsWith("/products");

    const goSearch = () => {
        const keyword = (searchInput.value || "").trim();
        if (!keyword) return;

        // Nếu KHÔNG ở trang /products -> chuyển hướng sang /products
        if (!isProductsPage) {
            const params = new URLSearchParams();
            params.set("keyword", keyword);
            window.location.href = `/products?${params.toString()}`;
            return;
        }
        // Ở trang /products thì để products.js xử lý (lọc DOM),
        // nên header.js không làm gì thêm để khỏi xung đột.
    };

    searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        goSearch();
    });

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            goSearch();
        }
    });
});
