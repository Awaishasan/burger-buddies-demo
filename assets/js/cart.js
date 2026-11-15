/* ============================================================
   Burger Buddies — cart
   A tiny in-memory cart (localStorage so the order survives a
   refresh). Checkout goes to the brand's real WhatsApp number
   with the full order text — no backend needed for the demo.
   ============================================================ */

const BB_CART_KEY = "bb-cart-v1";
let bbCart = [];

try {
  bbCart = JSON.parse(localStorage.getItem(BB_CART_KEY) || "[]");
} catch (e) {
  bbCart = [];
}

function bbSaveCart() {
  try { localStorage.setItem(BB_CART_KEY, JSON.stringify(bbCart)); } catch (e) { /* private mode */ }
}

function bbCartCount() {
  return bbCart.reduce((n, item) => n + item.qty, 0);
}

function bbCartTotal() {
  return bbCart.reduce((n, item) => n + item.qty * item.price, 0);
}

function bbFormatRs(n) {
  return "Rs " + n.toLocaleString("en-PK");
}

/* Add an item — merges with an existing line of the same id. */
function bbAddToCart(id, name, price, img, sourceEl) {
  const line = bbCart.find((l) => l.id === id);
  if (line) line.qty += 1;
  else bbCart.push({ id, name, price, img: img || "", qty: 1 });
  bbSaveCart();
  bbRenderCart();
  bbBounceCartButton();
  if (sourceEl && img) bbFlyToCart(sourceEl, img);
  bbToast("Added <b>" + name + "</b> to your order 🍔");
}

/* Fly-to-cart animation: clone the card image, arc it to the cart button. */
function bbFlyToCart(sourceEl, imgSrc) {
  const card = sourceEl.closest(".menu-card, .deal-card, .builder-visual");
  const from = (card ? card.querySelector("img") : null) || sourceEl;
  const to = document.querySelector(".cart-btn");
  if (!from || !to || !window.anime) return;
  const r1 = from.getBoundingClientRect();
  const r2 = to.getBoundingClientRect();
  const ghost = document.createElement("img");
  ghost.src = imgSrc;
  ghost.className = "fly-img";
  ghost.style.cssText = "left:" + r1.left + "px;top:" + r1.top + "px;width:" + r1.width + "px;height:" + r1.height + "px;";
  document.body.appendChild(ghost);
  anime({
    targets: ghost,
    left: r2.left + r2.width / 2 - 20,
    top: r2.top + r2.height / 2 - 20,
    width: 40,
    height: 40,
    rotate: 300,
    opacity: [1, 0.4],
    duration: 750,
    easing: "easeInQuad",
    complete: () => ghost.remove(),
  });
}

function bbBounceCartButton() {
  const btn = document.querySelector(".cart-btn");
  if (!btn) return;
  btn.classList.remove("bounce");
  void btn.offsetWidth; /* restart the animation */
  btn.classList.add("bounce");
}

function bbChangeQty(id, delta) {
  const line = bbCart.find((l) => l.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) bbCart = bbCart.filter((l) => l.id !== id);
  bbSaveCart();
  bbRenderCart();
}

function bbRenderCart() {
  const countEl = document.getElementById("cart-count");
  const bodyEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const footEl = document.getElementById("cart-foot");
  if (!countEl || !bodyEl) return;

  countEl.textContent = bbCartCount();
  if (bbCart.length === 0) {
    bodyEl.innerHTML = '<div class="cart-empty"><div class="big">🍔</div><p>Your order is empty.<br>Add something tasty from the menu.</p></div>';
    if (footEl) footEl.style.display = "none";
    return;
  }
  if (footEl) footEl.style.display = "";
  bodyEl.innerHTML = bbCart.map((line) => (
    '<div class="cart-item">' +
      '<img src="' + line.img + '" alt="" onerror="this.src=\'assets/images/hero-burger.webp\'">' +
      '<div class="info"><b>' + line.name + '</b><span>' + bbFormatRs(line.price) + ' each</span></div>' +
      '<div class="qty">' +
        '<button onclick="bbChangeQty(\'' + line.id + '\', -1)" aria-label="Remove one">−</button>' +
        '<b>' + line.qty + '</b>' +
        '<button onclick="bbChangeQty(\'' + line.id + '\', 1)" aria-label="Add one">+</button>' +
      '</div>' +
    '</div>'
  )).join("");
  if (totalEl) totalEl.textContent = bbFormatRs(bbCartTotal());
}

function bbOpenCart() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("cart-overlay").classList.add("show");
  document.body.style.overflow = "hidden";
}

function bbCloseCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("show");
  document.body.style.overflow = "";
}

/* Checkout: build the order message and open the brand's WhatsApp. */
function bbCheckoutWhatsApp() {
  if (bbCart.length === 0) {
    bbToast("Your cart is empty — add a burger first 🍔");
    return;
  }
  const lines = bbCart.map((l) => "• " + l.qty + " × " + l.name + " — " + bbFormatRs(l.qty * l.price));
  const msg =
    "Hi Burger Buddies! 🍔 I'd like to order:\n\n" +
    lines.join("\n") +
    "\n\nTotal: " + bbFormatRs(bbCartTotal()) +
    "\n\nName:\nAddress / Delivery or Pickup:";
  window.open("https://wa.me/923276589441?text=" + encodeURIComponent(msg), "_blank");
}

/* Toast helper — one at a time, auto-hides. */
let bbToastTimer = null;
function bbToast(html) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.innerHTML = html;
  el.classList.add("show");
  clearTimeout(bbToastTimer);
  bbToastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}
