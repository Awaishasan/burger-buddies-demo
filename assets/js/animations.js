/* ============================================================
   Burger Buddies — animations (Anime.js)
   Preloader -> hero timeline -> scroll reveals -> counters.
   Everything degrades gracefully if Anime.js fails to load:
   the preloader still hides and sections still reveal.
   ============================================================ */

function bbHidePreloader() {
  const pre = document.getElementById("preloader");
  if (!pre) return;
  if (window.anime) {
    anime({
      targets: pre,
      opacity: [1, 0],
      duration: 450,
      easing: "easeInOutQuad",
      complete: () => { pre.style.display = "none"; bbPlayHero(); },
    });
  } else {
    pre.style.display = "none";
    bbPlayHero();
  }
}

function bbPlayHero() {
  if (!window.anime) return;
  const tl = anime.timeline({ easing: "easeOutExpo" });
  tl.add({ targets: ".hero h1 .line span", translateY: ["110%", "0%"], opacity: [0, 1], duration: 900, delay: anime.stagger(140) })
    .add({ targets: ".hero .eyebrow, .hero p.lead, .hero-cta, .hero-stats .stat", translateY: [26, 0], opacity: [0, 1], duration: 700, delay: anime.stagger(90) }, "-=550")
    .add({ targets: ".hero-img-frame", translateY: [40, 0], rotate: ["4deg", "1.5deg"], opacity: [0, 1], duration: 900 }, "-=800")
    .add({ targets: ".float-chip, .spin-badge", scale: [0.6, 1], opacity: [0, 1], duration: 600, delay: anime.stagger(120), easing: "easeOutBack" }, "-=500")
    .add({ targets: ".floating-ingredient", translateY: [-14, 0], opacity: [0, 0.9], duration: 600, delay: anime.stagger(100) }, "-=400");
}

function bbInitReveals() {
  const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("revealed"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

/* Count-up stats (data-count on the <b>). */
function bbInitCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      if (window.anime) {
        const obj = { n: 0 };
        anime({
          targets: obj, n: target, duration: 1400, easing: "easeOutExpo",
          update: () => { el.textContent = Math.round(obj.n).toLocaleString("en-PK") + suffix; },
        });
      } else {
        el.textContent = target.toLocaleString("en-PK") + suffix;
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => io.observe(el));
}

/* Marquee: duplicate the track content once so the CSS loop is seamless. */
function bbInitMarquee() {
  const track = document.querySelector(".marquee-track");
  if (track) track.innerHTML += track.innerHTML;
}

/* Nav: solid background after scrolling; mobile menu toggle. */
function bbInitNav() {
  const header = document.querySelector("header.nav");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const btn = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (btn && links) {
    btn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      btn.textContent = open ? "✕" : "☰";
    });
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      links.classList.remove("open");
      btn.textContent = "☰";
    }));
  }
}

/* Split the hero headline into per-letter spans for the stagger. */
function bbSplitHeroTitle() {
  document.querySelectorAll(".hero h1 .line").forEach((line) => {
    const text = line.textContent;
    line.innerHTML = "";
    text.split("").forEach((ch) => {
      const s = document.createElement("span");
      s.textContent = ch === " " ? "\u00a0" : ch;
      line.appendChild(s);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bbSplitHeroTitle();
  bbInitNav();
  bbInitMarquee();
  bbInitReveals();
  bbInitCounters();

  /* Preloader bar fills, then the curtain lifts. */
  const bar = document.querySelector("#preloader .pre-bar i");
  if (window.anime && bar) {
    anime({
      targets: bar, width: ["0%", "100%"], duration: 1100, easing: "easeInOutQuad",
      complete: bbHidePreloader,
    });
  } else {
    setTimeout(bbHidePreloader, 600);
  }
  /* Safety net: never trap the user behind the preloader. */
  setTimeout(() => {
    const pre = document.getElementById("preloader");
    if (pre && pre.style.display !== "none") { pre.style.display = "none"; bbPlayHero(); }
  }, 3500);
});
