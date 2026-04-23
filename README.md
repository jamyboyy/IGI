# IGI — Speculative Redesign

Speculative redesign of Industrial & General Insurance Plc (iginigeria.com) for pitch delivery.

Static HTML/CSS/JS — no build step. Deploy straight to Vercel, GitHub Pages, Netlify, or any static host.

## Structure

```
/
├── index.html          # Homepage (hero, trust bar, stats, products, history, specialist, leadership, quotes, CTA, footer)
├── about.html          # Company story + timeline + MVV
├── products.html       # Tabbed Life / Non-Life / Specialist (~30 products)
├── leadership.html     # Board + management
├── claims.html         # Claims procedure stub
├── investors.html      # Investor relations stub
├── media.html          # Press & media stub
├── contact.html        # Contact stub
└── assets/
    ├── styles.css      # Design tokens + all component styles + mobile overrides
    ├── site.js         # Nav scroll, mobile menu, reveal, counters, parallax, carousel, product tabs
    └── placeholder.js  # Auto-hydrates .ph slots with Unsplash imagery (+ picsum fallback)
```

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. On vercel.com → Add New → Project → Import the repo.
3. **Framework Preset:** Other (or "No framework").
4. **Build Command:** leave blank.
5. **Output Directory:** leave blank (Vercel serves `/` directly).
6. Deploy.

You'll get a `*.vercel.app` preview URL. Copy that into the pitch email to IGI.

## Mobile

Mobile breakpoint is `768px`. Mobile padding is `35px` top/bottom, `15px` left/right, applied globally. All multi-column grids (products, stats, leadership, specialist, footer) collapse to a single column below the breakpoint. Nav becomes a hamburger below `900px`.

## Images

All `.ph` slots auto-fill from `assets/placeholder.js` using Unsplash photo IDs (hotlinked with picsum fallback). Swap the URLs in that file for your own uploads when the client signs.

## What's deliberately unfinished (the pitch hook)

The typical "leave some things incomplete" pattern for speculative pitches:

- **Logo** — pulled IGI's tiny 69×50 px logo off their current site. Swap for proper vector once they engage.
- **Board/management photography** — currently stock portraits, not real board headshots.
- **Client logos** — marquee is wordmarks only. Client supplies real SVG logos after signing.
- **Testimonials** — placeholder corporate quotes. Pull real client quotes during onboarding.
- **Claims/Investors/Media pages** — stubbed. Flesh out after engagement.

## Local preview

```bash
python3 -m http.server 8000
# → open http://localhost:8000
```

Or just double-click `index.html` in Finder. No dependencies.
