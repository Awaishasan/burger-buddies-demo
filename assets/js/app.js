/* ============================================================
   Burger Buddies — app
   Renders the menu (tabs + cards) and deals from menu-data.js,
   wires the cart drawer, and boots the builder.
   ============================================================ */

let bbActiveCategory = "beef";

function bbMenuCard(item, index) {
  return (
    '<article class="menu-card reveal" style="--d:' + (index % 4) * 0.08 + 's">' +
      '<div class="thumb">' +
        (item.badge ? '<span class="badge">' + item.badge + "</span>" : "") +
        '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy" onerror="this.src=\'assets/images/hero-burger.webp\'">' +
      "</div>" +
      '<div class="body">' +
        "<h3>" + item.name + "</h3>" +
        '<p class="desc">' + item.desc + "</p>" +
        '<div class="row">' +
          '<span class="price">' + bbFormatRs(item.price) + "</span>" +
          '<button class="add-btn" onclick="bbAddToCart(\'' + item.id + "', '" + item.name.replace(/'/g, "\\'") + "', " + item.price + ", '" + item.img + "', this)\">Add +</button>" +
        "</div>" +
      "</div>" +
    "</article>"
  );
}

function bbRenderTabs() {
  const el = document.getElementById("menu-tabs");
  if (!el) return;
  el.innerHTML = BB_CATEGORIES.map((c) => (
    '<button class="tab' + (c.id === bbActiveCategory ? " active" : "") + '" data-cat="' + c.id + '">' +
      c.icon + " " + c.label +
    "</button>"
  )).join("");
  el.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      bbActiveCategory = btn.dataset.cat;
      bbRenderTabs();
      bbRenderMenu();
    });
  });
}

function bbRenderMenu() {
  const grid = document.getElementById("menu-grid");
  if (!grid) return;
  const items = BB_MENU.filter((m) => m.category === bbActiveCategory);
  grid.innerHTML = items.map((item, i) => bbMenuCard(item, i)).join("");
  /* Re-arm the reveal observer for the freshly rendered cards. */
  bbInitReveals();
  if (window.anime) {
    anime({ targets: "#menu-grid .menu-card", translateY: [26, 0], opacity: [0, 1], delay: anime.stagger(70), duration: 550, easing: "easeOutExpo" });
  }
}

function bbRenderDeals() {
  const el = document.getElementById("deals-grid");
  if (!el) return;
  el.innerHTML = BB_COMBOS.map((combo, i) => (
    '<article class="deal-card reveal" style="--d:' + i * 0.1 + 's">' +
      '<span class="deal-tag">SAVE ' + bbFormatRs(combo.was - combo.price) + "</span>" +
      '<img src="' + combo.img + '" alt="' + combo.name + '" loading="lazy" onerror="this.src=\'assets/images/hero-burger.webp\'">' +
      '<div class="body">' +
        "<h3>" + combo.name + "</h3>" +
        "<p>" + combo.desc + "</p>" +
        '<div class="row">' +
          '<span class="price">' + bbFormatRs(combo.price) + "<s>" + bbFormatRs(combo.was) + "</s></span>" +
          '<button class="add-btn" onclick="bbAddToCart(\'' + combo.id + "', '" + combo.name + "', " + combo.price + ", '" + combo.img + "', this)\">Add +</button>" +
        "</div>" +
      "</div>" +
    "</article>"
  )).join("");
}

function bbRenderGallery() {
  const el = document.getElementById("gram-grid");
  if (!el) return;
  const shots = [
    { img: "assets/images/hero-burger.webp", cap: "🍔 Molten cheese, always." },
    { img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop", cap: "🍟 Fries in the basket, burger in hand." },
    { img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop", cap: "🔥 The BB Classic — Big flavor." },
    { img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop", cap: "👯 Made for sharing. Sort of." },
  ];
  el.innerHTML = shots.map((s, i) => (
    '<a class="gram-item reveal-zoom" style="--d:' + i * 0.08 + 's" href="https://www.instagram.com/burgerbuddies.official" target="_blank" rel="noopener">' +
      '<img src="' + s.img + '" alt="Burger Buddies" loading="lazy" onerror="this.src=\'assets/images/hero-burger.webp\'">' +
      '<span class="cap">' + s.cap + "</span>" +
    "</a>"
  )).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  bbRenderTabs();
  bbRenderMenu();
  bbRenderDeals();
  bbRenderGallery();
  bbRenderBuilder();
  bbRenderCart();

  document.getElementById("cart-open")?.addEventListener("click", bbOpenCart);
  document.getElementById("cart-close")?.addEventListener("click", bbCloseCart);
  document.getElementById("cart-overlay")?.addEventListener("click", bbCloseCart);
  document.getElementById("checkout-btn")?.addEventListener("click", bbCheckoutWhatsApp);
  document.getElementById("builder-add")?.addEventListener("click", function () { bbAddCustomBuddy(this); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") bbCloseCart(); });
});
