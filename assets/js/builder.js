/* ============================================================
   Burger Buddies — Build Your Buddy
   Pick a patty, cheese, sauce and toppings. The burger on the
   left rebuilds itself (layer by layer, Anime.js) and the
   price updates live. "Add my buddy" drops it into the cart.
   ============================================================ */

const BB_BUILDER = {
  patty: { id: "beef", name: "Beef Patty", price: 450 },
  cheese: { id: "cheddar", name: "Cheddar", price: 80 },
  sauce: { id: "buddy-mayo", name: "Buddy Mayo", price: 0 },
  toppings: [], /* array of topping ids */
};

const BB_PATTIES = [
  { id: "beef", name: "Beef Patty", price: 450, layer: "Beef Patty" },
  { id: "chicken", name: "Chicken Fillet", price: 400, layer: "Chicken Fillet" },
  { id: "double-beef", name: "Double Beef", price: 650, layer: "Double Beef Patty" },
];

const BB_CHEESES = [
  { id: "cheddar", name: "Cheddar", price: 80 },
  { id: "molten", name: "Molten Cheese Lava", price: 150 },
  { id: "no-cheese", name: "No Cheese", price: 0 },
];

const BB_BUILDER_SAUCES = [
  { id: "buddy-mayo", name: "Buddy Mayo", price: 0 },
  { id: "smoky-bbq", name: "Smoky BBQ", price: 40 },
  { id: "spicy-jalapeno", name: "Spicy Jalapeño", price: 40 },
  { id: "garlic", name: "Garlic Sauce", price: 40 },
];

function bbBuilderPrice() {
  const tops = BB_BUILDER.toppings.reduce((sum, tid) => {
    const t = BB_TOPPINGS.find((x) => x.id === tid);
    return sum + (t ? t.price : 0);
  }, 0);
  return BB_BUILDER.patty.price + BB_BUILDER.cheese.price + BB_BUILDER.sauce.price + tops;
}

function bbBuilderName() {
  const tops = BB_BUILDER.toppings.map((tid) => {
    const t = BB_TOPPINGS.find((x) => x.id === tid);
    return t ? t.name : tid;
  });
  return "Custom Buddy (" + BB_BUILDER.patty.name + ", " + BB_BUILDER.cheese.name + ", " + BB_BUILDER.sauce.name +
    (tops.length ? ", " + tops.join(", ") : "") + ")";
}

function bbRenderBuilderOptions() {
  const renderGroup = (elId, options, currentId, onPick) => {
    const el = document.getElementById(elId);
    if (!el) return;
    el.innerHTML = options.map((o) => (
      '<button class="opt' + (o.id === currentId ? " selected" : "") + '" data-id="' + o.id + '">' +
        o.name + '<small>' + (o.price ? "+ Rs " + o.price : "Included") + "</small>" +
      "</button>"
    )).join("");
    el.querySelectorAll(".opt").forEach((btn) => {
      btn.addEventListener("click", () => onPick(btn.dataset.id));
    });
  };

  renderGroup("opt-patty", BB_PATTIES, BB_BUILDER.patty.id, (id) => {
    BB_BUILDER.patty = BB_PATTIES.find((p) => p.id === id);
    bbRenderBuilder();
  });
  renderGroup("opt-cheese", BB_CHEESES, BB_BUILDER.cheese.id, (id) => {
    BB_BUILDER.cheese = BB_CHEESES.find((c) => c.id === id);
    bbRenderBuilder();
  });
  renderGroup("opt-sauce", BB_BUILDER_SAUCES, BB_BUILDER.sauce.id, (id) => {
    BB_BUILDER.sauce = BB_BUILDER_SAUCES.find((s) => s.id === id);
    bbRenderBuilder();
  });

  const topEl = document.getElementById("opt-toppings");
  if (topEl) {
    topEl.innerHTML = BB_TOPPINGS.map((t) => (
      '<button class="opt' + (BB_BUILDER.toppings.includes(t.id) ? " selected" : "") + '" data-id="' + t.id + '">' +
        t.name + "<small>+ Rs " + t.price + "</small>" +
      "</button>"
    )).join("");
    topEl.querySelectorAll(".opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        BB_BUILDER.toppings = BB_BUILDER.toppings.includes(id)
          ? BB_BUILDER.toppings.filter((x) => x !== id)
          : [...BB_BUILDER.toppings, id];
        bbRenderBuilder();
      });
    });
  }
}

function bbRenderBuilder() {
  bbRenderBuilderOptions();

  const stage = document.getElementById("burger-stage");
  if (!stage) return;

  const layers = [];
  layers.push('<div class="burger-layer layer-bun-top" style="animation-delay:.0s">🍔 SESAME BUN</div>');
  if (BB_BUILDER.cheese.id !== "no-cheese") {
    layers.push('<div class="burger-layer layer-cheese" style="animation-delay:.08s">' + BB_BUILDER.cheese.name.toUpperCase() + "</div>");
  }
  const pattyCls = BB_BUILDER.patty.id === "double-beef" ? "layer-patty double" : "layer-patty";
  layers.push('<div class="burger-layer ' + pattyCls + '" style="animation-delay:.16s">' + BB_BUILDER.patty.layer.toUpperCase() + "</div>");
  layers.push('<div class="burger-layer layer-salad" style="animation-delay:.24s">🥬 LETTUCE & TOMATO</div>');
  layers.push('<div class="burger-layer layer-sauce" style="animation-delay:.32s">' + BB_BUILDER.sauce.name.toUpperCase() + "</div>");
  BB_BUILDER.toppings.forEach((tid, i) => {
    const t = BB_TOPPINGS.find((x) => x.id === tid);
    if (t) layers.push('<div class="burger-layer layer-extra" style="animation-delay:' + (0.4 + i * 0.07) + 's">' + t.name.toUpperCase() + "</div>");
  });
  layers.push('<div class="burger-layer layer-bun-bottom" style="animation-delay:.5s">BOTTOM BUN</div>');
  stage.innerHTML = layers.join("");

  const priceEl = document.getElementById("builder-price");
  if (priceEl) priceEl.innerHTML = bbFormatRs(bbBuilderPrice()) + " <small>total</small>";

  if (window.anime) {
    anime({ targets: "#burger-stage .burger-layer", translateY: [-18, 0], opacity: [0, 1], delay: anime.stagger(70), duration: 420, easing: "easeOutBack" });
  }
}

function bbAddCustomBuddy(btn) {
  const name = bbBuilderName();
  const price = bbBuilderPrice();
  bbAddToCart("custom-" + Date.now(), name, price, "assets/images/hero-burger.webp", btn);
}
