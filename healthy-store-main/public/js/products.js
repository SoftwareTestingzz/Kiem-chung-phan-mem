// public/js/products.js

document.addEventListener("DOMContentLoaded", () => {
    const listEl = document.querySelector(".product-list");
    if (!listEl) return;

    // ====== LẤY CÁC PHẦN TỬ CẦN DÙNG ======
    const items = Array.from(listEl.querySelectorAll(".product-list-item"));

    const perPageSelect = document.getElementById("filter-per-page");
    const sortSelect = document.getElementById("filter-sort");

    // Search (đang dùng ô search trên header có id filter-search)
    const searchInput = document.getElementById("filter-search");
    const searchBtn = document.getElementById("filter-search-btn");


    // Lọc giá
    const priceFromInput = document.getElementById("price-from");
    const priceToInput = document.getElementById("price-to");
    const priceBtn = document.getElementById("btn-price-filter");

    // View grid / list
    const viewButtons = document.querySelectorAll(".view-btn");

    // ====== HÀM BỎ DẤU TIẾNG VIỆT (cho search không dấu) ======
    const stripVietnamese = (str = "") => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")   // bỏ dấu thanh
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    };

    // ====== STATE LỌC / SẮP XẾP ======
    const state = {
        perPage: parseInt(perPageSelect?.value || items.length, 10) || items.length,
        sort: sortSelect?.value || "latest",
        search: "",
        view: "grid",
        minPrice: null,
        maxPrice: null,
    };

    

    const getNumber = (el, key) => {
        const val = el.dataset[key];
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
    };

    const getIndex = (el) => {
        const val = parseInt(el.dataset.index || "0", 10);
        return isNaN(val) ? 0 : val;
    };

    // ====== APPLY FILTERS ======
    const applyFilters = () => {
        // 1. Lấy keyword và chuẩn hóa (bỏ dấu + lowercase)
        const keywordRaw = (state.search || "").trim();
        const keyword = stripVietnamese(keywordRaw).toLowerCase();

        let filtered = items;

        // 2. Lọc theo search (theo title)
        if (keyword) {
            filtered = filtered.filter((el) => {
                const titleRaw = el.dataset.title || "";
                const titleNorm = stripVietnamese(titleRaw).toLowerCase();
                return titleNorm.includes(keyword);
            });
        }

        // 3. Lọc theo khoảng giá
        if (state.minPrice != null || state.maxPrice != null) {
            filtered = filtered.filter((el) => {
                const price = getNumber(el, "price");
                if (state.minPrice != null && price < state.minPrice) return false;
                if (state.maxPrice != null && price > state.maxPrice) return false;
                return true;
            });
        }

        // 4. Sắp xếp
        const sorted = [...filtered].sort((a, b) => {
            switch (state.sort) {
                case "price_asc":
                    return getNumber(a, "price") - getNumber(b, "price");
                case "price_desc":
                    return getNumber(b, "price") - getNumber(a, "price");
                case "discount_desc":
                    return getNumber(b, "discount") - getNumber(a, "discount");
                case "name_asc": {
                    const nameA = (a.dataset.title || "").toLowerCase();
                    const nameB = (b.dataset.title || "").toLowerCase();
                    return nameA.localeCompare(nameB);
                }
                case "latest":
                default:
                    // index lớn hơn = mới hơn (giữ logic cũ)
                    return getIndex(b) - getIndex(a);
            }
        });

        const limit = state.perPage || sorted.length;

        // 5. Ẩn hết trước
        items.forEach((el) => {
            el.style.display = "none";
        });

        // 6. Sắp xếp lại DOM + show theo perPage
        sorted.forEach((el, idx) => {
            listEl.appendChild(el); // move node

            if (idx < limit) {
                el.style.display = "";
            } else {
                el.style.display = "none";
            }
        });
    };

    // ====== EVENT: SỐ SẢN PHẨM / TRANG ======
    perPageSelect?.addEventListener("change", () => {
        state.perPage = parseInt(perPageSelect.value, 10) || items.length;
        applyFilters();
    });

    // ====== EVENT: SORT ======
    sortSelect?.addEventListener("change", () => {
        state.sort = sortSelect.value;
        applyFilters();
    });

    // ====== EVENT: SEARCH TRÊN TRANG /products ======
    const triggerSearch = () => {
        state.search = searchInput?.value || "";
        applyFilters();
    };

    // Live search (khi đang ở /products, searchInput là ô trên header)
    searchInput?.addEventListener("input", () => {
        triggerSearch();
    });

    searchBtn?.addEventListener("click", () => {
        triggerSearch();
    });

    searchInput?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            triggerSearch();
        }
    });

    // ====== LẤY KEYWORD BAN ĐẦU TỪ SERVER / URL (khi redirect từ trang khác) ======
    let initialKeyword = "";
    try {
        if (typeof window !== "undefined") {
            if (window.initialProductKeyword) {
                initialKeyword = window.initialProductKeyword;
            } else {
                const params = new URLSearchParams(window.location.search);
                initialKeyword = params.get("keyword") || "";
            }
        }
    } catch (err) {
        console.error("Cannot read initial keyword", err);
    }

    if (initialKeyword && searchInput) {
        searchInput.value = initialKeyword;
        state.search = initialKeyword;
    }

    // ====== EVENT: FILTER GIÁ ======
    if (priceBtn) {
        priceBtn.addEventListener("click", () => {
            const fromVal = priceFromInput?.value;
            const toVal = priceToInput?.value;

            state.minPrice = fromVal !== "" ? parseFloat(fromVal) : null;
            state.maxPrice = toVal !== "" ? parseFloat(toVal) : null;

            applyFilters();
        });
    }

    // ====== EVENT: VIEW GRID / LIST ======
    viewButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const view = btn.dataset.view || "grid";
            state.view = view;

            viewButtons.forEach((b) =>
                b.classList.toggle("is-active", b === btn)
            );

            if (view === "list") {
                listEl.classList.add("list-view");
            } else {
                listEl.classList.remove("list-view");
            }
        });
    });

    // ================== SIDEBAR CATEGORY TOGGLE (đa cấp) ==================
    const sidebarToggleButtons = document.querySelectorAll(".sidebar-cat-toggle");

    sidebarToggleButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const li = btn.closest(".sidebar-cat-item");
            if (!li) return;

            const isOpen = li.classList.contains("is-open");
            const parentList = li.parentElement; // ul.sidebar-cat-list hoặc ul.sidebar-sub-list

            // Chỉ đóng ANH EM cùng cấp, không đụng tới cha
            if (parentList) {
                const openSiblings = parentList.querySelectorAll(
                    ":scope > .sidebar-cat-item.is-open"
                );
                openSiblings.forEach((other) => {
                    if (other !== li) other.classList.remove("is-open");
                });
            }

            // Toggle chính nó
            if (!isOpen) {
                li.classList.add("is-open");
            } else {
                li.classList.remove("is-open");
            }
        });
    });

    // ====== KHỞI TẠO ======
    applyFilters();
});
