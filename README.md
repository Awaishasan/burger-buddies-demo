# Burger Buddies — Animated Demo Website 🍔

> **Big flavor. Bold taste. The Best in Town.**
>
> A demo concept website for **Burger Buddies** (`@burgerbuddies.official`),
> built by **Dev Technologies** (Awais Hassan) as a client pitch — the same
> demo-first approach as the [Slabs Coffee Shop demo](https://github.com/Awaishasan/slabs-coffee-shop-demo).

**Live demo:** https://awaishasan.github.io/burger-buddies-demo/

## Why this demo exists

Burger Buddies has a real brand and a real menu, but no working website:

| What they have | What it actually is |
|---|---|
| `burgerbuddies.online` | **Suspended** — visitors see an "Account Suspended" page |
| `burgerbuddiesofficial.com` | Just a list of links — no menu, no photos, no ordering |
| Instagram `@burgerbuddies.official` | Business account, **1,110 followers**, "Coming Soon" teaser + printed menu post |

This demo shows them what a real site looks like: their own menu,
their own phone/WhatsApp, their own taglines — with heavy, smooth
Anime.js animation throughout.

## What's inside

- **Animated hero** — staggered headline, floating chips, spinning
  "The Best in Town" badge, Ken Burns hero photo (generated to match
  their own Coming Soon teaser: sesame bun, molten cheese, fries basket)
- **Full menu** — 8 categories, 25 items, tabbed + animated cards
  (Beef Burgers, Fried Burgers, Grilled Chicken, First Crush Bites,
  Shawarma & Wraps, Fries & Sides, Sandwiches, Drinks)
- **Build Your Buddy** — interactive burger builder: pick a patty,
  cheese, sauce and toppings, watch the burger stack live, live price
- **Buddy Deals** — 3 combos with savings shown
- **Working cart** — add items, change quantities, checkout sends the
  whole order to the brand's real WhatsApp (+92 327 6589441)
- **From the Gram + Visit sections** — real Instagram, Maps and
  phone links
- **Anime.js throughout** — preloader, hero timeline, scroll reveals,
  count-up stats, fly-to-cart animation, marquee

## Project structure

```text
burger-buddies-demo/
├── index.html                 # the whole page (sections only — no inline CSS/JS)
├── .nojekyll                  # GitHub Pages: serve assets as-is
├── assets/
│   ├── css/
│   │   ├── main.css           # design system, layout, components
│   │   └── animations.css     # keyframes, marquee, reveals, reduced-motion
│   ├── js/
│   │   ├── menu-data.js       # menu, combos, sauces, toppings (generated from data/menu.json)
│   │   ├── app.js             # renders menu tabs/cards, deals, gallery
│   │   ├── cart.js            # cart, drawer, WhatsApp checkout, fly-to-cart
│   │   ├── builder.js         # Build Your Buddy logic + live burger visual
│   │   └── animations.js      # Anime.js timelines, preloader, reveals, counters
│   └── images/
│       ├── hero-burger.webp   # hero photo (generated, matches brand teaser)
│       └── logo.svg           # cartoon burger logo mark
├── data/
│   └── menu.json              # single source of truth for the menu
└── docs/
    └── BRAND-NOTES.md         # brand research behind the demo
```

No build step, no framework. Open `index.html` or serve the folder —
it works from any static host.

## Run locally

```bash
# any static server works, e.g.:
python3 -m http.server 8000
# then open http://localhost:8000
```

## Swap in the real details

Menu names and categories come from Burger Buddies' own printed menu
(Facebook, 15 Sep 2026). **Prices are samples** for the demo — replace
them in one place:

1. Edit `data/menu.json` (the source of truth)
2. Regenerate `assets/js/menu-data.js`, or edit it to match
3. Replace `assets/images/hero-burger.webp` and the Unsplash photo
   URLs in `menu-data.js` with the shop's real food photos
4. Confirm opening hours and delivery areas, then add them to the
   Visit section (they were not published anywhere, so the demo
   doesn't invent them)

## Tech

- HTML + CSS + vanilla JS, no build step
- [Anime.js 3.2.1](https://animejs.com/) (CDN) + CSS keyframes
- Google Fonts: Anton (display) + Poppins (body)
- Food photos: Unsplash (menu cards) + one generated hero image

## Credits

Demo concept by **Dev Technologies** — Awais Hassan, Sahiwal, Pakistan.
Brand, menu names, taglines and contact details belong to Burger Buddies.
