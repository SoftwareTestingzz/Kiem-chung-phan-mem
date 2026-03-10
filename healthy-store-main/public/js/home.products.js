document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".products-tab");
  const cards = document.querySelectorAll(".product-card");

  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      cards.forEach((card) => {
        const cat = card.dataset.category;
        card.style.display = (cat === filter) ? "" : "none";
      });
    });
  });
});
