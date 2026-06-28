# Airship Design System — Reference for Claude

> **How to use this file:** Upload it to your Claude Project's knowledge (or paste it
> into the Project's custom instructions). It is fully self-contained — every colour,
> type, spacing and motion value is written out inline, so Claude can design and build
> on-brand for Airship without needing any external files. Where binary assets (the
> logo, icon SVGs, illustrations) are required, upload those separately — they can't
> travel as text.

---

## What Airship is

**Airship** (airship.co.uk) runs a multi-product hospitality platform. Its flagship
in-app product is the **Airship Dashboard** (cloud-based hospitality CRM,
loyalty, feedback, fulfilment, ticketing, bulk orders). Newer marketing/AI surfaces
use the name **Ask Airship**.

### Two systems coexist — pick the right one for the surface

| | **Brand (Ask Airship)** | **Product (Airship Dashboard)** |
|---|---|---|
| Used for | Marketing, hero, logos, AI features | In-app screens, admin UI |
| Type | **Montserrat** (400 → 900) | **Lato** (300, 400, 700, 900) |
| Primary | `#8d00d4` purple | `#3180FF` blue |
| Accent | `#ec00ff` pink | `#38ABFF` light blue |
| Text | `#34004d` deep purple | `#354B64` dark slate-blue |
| Backgrounds | White, deep purple, gradient hero | `#FFFFFF` / `#FAFBFB` / `#F4F6F7` |
| Vibe | Saturated, gradient, generous | Calm, soft-grey card-on-white |

The brand can be **loud** (purple→pink gradient on hero). The product is **calm**
(Lato, slate, lots of off-white). Never mix the two voices on one surface.

### "Boosters"
The Airship Dashboard's modular features are called **Boosters** — Loyalty, Champions, Fulfilment,
Tickets, Feedback, Bulk Orders. Each has its own colour theme and a flat illustration.

---

## Voice & content

- **Tone:** clear, functional, no-nonsense **British English**. Direct, never
  marketing-flavoured *inside the app*. The brand/marketing surface is a touch more
  confident and gradient-forward.
- **Person:** mostly **you** ("Don't use the logo on a colour that limits visibility").
  Imperative for actions ("Confirm", "Abort", "Subscribe").
- **Button copy:** literal verbs — `Confirm`, `Abort`, `Neutral` are the three semantic
  states. No "Get started now!" exclamation marks.
- **Badge labels:** single words — `Active`, `Inactive`, `Draft`, `Processing`,
  `Complete`, `Submitted`, `Failed`.
- **Casing:** UK English ("colour", "visualise"). UI labels are sentence case.
- **Emoji:** **not used** anywhere in product or brand (flag emoji in a phone-country
  selector is the only functional exception).
- **Vibe:** competent, warm, restrained. Never cute.

---

## Colour

### Brand palette (Ask Airship)
```
--airship-pink:        #ec00ff   /* core 1 — vivid magenta */
--airship-purple:      #8d00d4   /* core 2 — primary purple */
--airship-purple-deep: #34004d   /* core 3 — deep purple (text on light) */
--airship-pink-soft:   #ea54ef   /* optional softer shade */
--airship-magenta:     #a00498   /* optional */
```
Official brand gradient (hero buttons, logos, accents — **use sparingly**):
```
--airship-gradient:        linear-gradient(112deg, #BD38DF 0%, #5F1C70 100%);
--airship-gradient-bright: linear-gradient(135deg, #ec00ff 0%, #8d00d4 60%, #34004d 100%);
```

### Product palette
```
--product-blue:          #3180FF   /* primary / info */
--product-light-blue:    #38ABFF   /* neutral accent */
--product-dark-blue:     #354B64   /* primary text / heading colour */
--product-black:         #202C38   /* emphasis text */
--product-success-green: #71BE37
--product-error-red:     #ED7B7C
--product-warning-amber: #E6A831
--product-inactive-grey: #B3CBE0
--product-placeholder:   #abb7c5
```

### Neutrals (three layered near-whites)
```
--product-white:      #FFFFFF   /* surface */
--product-off-white:  #FAFBFB   /* off-white container */
--product-light-grey: #F4F6F7   /* page background */
--product-divider:    #E9EDF2   /* real divider line */
--product-border-soft:#BDD2F6   /* cool grey-blue border */
```
**Cards become whiter on hover, not greyer** (off-white → pure white). Distinctive — keep it.

### Semantic aliases
```
--bg:#FFFFFF  --bg-subtle:#FAFBFB  --bg-muted:#F4F6F7
--fg:#354B64 (body)  --fg-strong:#202C38  --fg-muted:#6D90B4  --fg-subtle:#abb7c5
--border:#E4EDF2  --border-strong:#BDD2F6
--primary:#3180FF  --primary-hover:#1571dd  --accent:#8d00d4
--success:#71BE37  --warning:#E6A831  --danger:#ED7B7C  --info:#38ABFF
```

---

## Type

- **Brand / marketing:** `"Montserrat", "Helvetica Neue", Arial, sans-serif`
- **Product UI:** `"Lato", "Helvetica Neue", Arial, sans-serif`
- **Mono:** `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
- Load via: `@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Lato:wght@300;400;700;900&display=swap");`

### Rules
- **Body line-height `1.4`** everywhere. Tight `1.2` for headings, loose `1.6` for prose.
- **Bold (700) is the default** for input values, button labels, table headings.
- **Black (900)** reserved for `<strong>` inside buttons and metric values.
- Helper text `0.7rem` (~11px), `#354B64`.

### Product type scale
```
--fs-xs:   0.7rem   /* 11px — helper / table cell */
--fs-sm:   0.8rem   /* 13px — caption */
--fs-base: 1rem     /* 16px — body */
--fs-lg:   1.2rem   /* 19px — large input / lead */
--fs-xl:   1.4rem   /* 22px — section header */
--fs-2xl:  1.5rem   /* 24px — metric label */
--fs-3xl:  2.2rem   /* 35px — card header */
--fs-4xl:  2.75rem  /* 44px — metric value */
```
Weights: 300 / 400 / 500 / 600 / 700 / 900.

### Brand headings (Montserrat)
```
brand-h1: 800, 3.5rem, line-height 1.05, letter-spacing -0.02em, colour #34004d
brand-h2: 700, 2.25rem, line-height 1.15, colour #34004d
brand-sub: 600, 1.25rem, line-height 1.3, colour #8d00d4
```

---

## Spacing, radii, shadows

### Spacing rhythm (rem)
`0.25 / 0.5 / 0.8 / 1.0 / 1.2 / 1.5 / 2.0 / 2.5 / 3.0`

### Corner radii
```
3px   badges
5px   small inputs
9px   DEFAULT — input containers, cards, modals
18px  feature cards (rewards, email, comment)
50px  pill / metric buttons
50%   circle
```

### Shadows (borders are quiet — most "borders" are 1px in the fill colour as hit padding)
```
--shadow-sm:      0 1px 2px rgba(53,75,100,0.06)
--shadow:         0 2px 8px rgba(0,0,0,0.10)
--shadow-md:      0 2px 8px rgba(0,0,0,0.33)               /* search dropdowns, modals */
--shadow-lg:      0 10px 30px -10px rgba(44,193,255,0.40)  /* login button hover lift */
--shadow-airship: 0 10px 30px -10px rgba(190,58,223,0.50)
```
- Cards are **flat at rest** — 1px near-white border, 9px radius, off-white fill, no drop shadow.
- No `backdrop-filter: blur`. No inner shadows. Transparency only in modal mask
  (`rgba(0,0,0,0.5)`) and tooltips (`rgba(0,0,0,0.8)`).

---

## Motion
- **Easings:** `ease-in` (entry), `cubic-bezier(0,1,0.5,1)` (exit), `ease-in-out` (hover scaling).
- **Durations:** `0.2s` hover transforms, `0.3s` modal open, `0.4s` icon-hover `tilt-shake`.
- Signature interactions: login button lifts `translate(0,-3px)` + soft glow on hover;
  icons swap to a `-hover` SVG and run a small rotate+scale `tilt-shake` wiggle; status
  dots can `blink`; Booster badges have a 4s `shimmer`.

---

## Layout & components
- **App shell:** 20% sidenav (`max-width: 280px`, `min-height: 100vh`) + content. Nav
  items `2rem` tall, `0.5rem` left padding, `0.5rem` radius.
- **Input containers:** `9px` radius, `0.8rem 1.2rem 1.4rem 1.2rem` padding, `1px solid #FAFBFB`
  border that becomes white on hover (very subtle — keep it). Labels above inputs.
- **Modals:** `9px` radius, `rgba(0,0,0,0.5)` mask, centred, `0.8 → 1.0` scale enter.
- **Tables:** `12px` cells, no row borders, alternating `transparent` / `#FAFBFB` zebra,
  **`10px` radius on first/last cells of each row** (rounded-end rows — distinctive).

---

## Iconography
- Airship uses a **proprietary flat single-colour SVG icon set** (~80 glyphs). Every
  named-action icon ships **two files**: resting + a `-hover` variant, swapped via
  `background-image` (not a CSS filter), almost never inlined as `<svg>`.
- **No icon font, no Lucide/Heroicons, no emoji.** If a needed concept is genuinely
  missing from the set, substitute carefully and flag it.
- These SVGs can't travel in this text file — upload the icon files separately if Claude
  needs to place real icons, otherwise use neutral placeholders.

---

## Imagery
- **No photography, textures, or repeating patterns in product.** Booster illustrations
  are flat, full-colour, isometric-ish SVG.
- Marketing/brand may use the diagonal `112deg` purple gradient as a hero treatment.
- For mock-ups where real assets aren't available, use subtle striped placeholders with
  a monospace caption of what belongs there (e.g. "product shot").
