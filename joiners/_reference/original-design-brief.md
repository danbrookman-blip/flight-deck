# Handoff: Joiners — hospitality site with the Airship / Toggle reveal layer

## Overview

A rebuild of joinerskitchen.co.uk as a fictional Sheffield hospitality group site that works on two levels at once:

1. **The guest layer.** A genuinely good venue website — one-tap booking, HTML menus with dietary filters, hours and phone visible without scrolling, no PDFs.
2. **The reveal layer ("See the joints").** A persistent switch in the header overlays a technical layer on top of the guest site: numbered pins on every element that does CRM or commerce work, a side panel explaining each mechanic, and a live "Your Record" card that builds a guest profile as the visitor browses.

Joiners is fictional. It exists to demonstrate what an operator can do with Airship and Toggle. The fiction is broken in exactly one permanent place: the footer strip.

**Target platform for this handoff: Webflow.** See "Webflow notes" at the end.

## About the design files

`Joiners.dc.html` is a **design reference created in HTML** — a working prototype showing intended look and behaviour, not production code to lift wholesale. It is a single-file app: an inline template plus a JavaScript logic class, rendered by a runtime (`support.js`) that is specific to the tool it was authored in. Do not try to port `support.js`.

The task is to **recreate these designs in the target environment** using its own patterns. For Webflow that means: pages and components in the Designer, styles as Webflow classes, the reveal layer as custom code. Everything you need — exact colours, type, spacing, copy, state and behaviour — is documented below and in the file.

Open `Joiners.dc.html` in a browser to see it run. Press `J` or click the switch to toggle the reveal layer. `screenshots/` holds reference captures of every page in both states — see `screenshots/index.md`.

## Fidelity

**High fidelity.** Final colours, typography, spacing, copy and interactions. Recreate it closely. Two caveats:

- **Photography is missing.** Every image is a drag-and-drop placeholder (`<image-slot>`, see `image-slot.js`) with a caption describing the intended shot. Replace each with real photography. The brief calls for natural light, warm cast, shallow depth, people mid-conversation, food shot at the table with cutlery and crumbs in frame — no stock, no plated overhead shots. 3% grain overlay across all imagery.
- **Numbers marked `[SOURCE NEEDED]`** must not go live until sourced and cleared. They are deliberately visible as `[SOURCE NEEDED]` in the UI so they cannot slip through.

---

## Design tokens

### Colour

| Token | Hex | Use |
|---|---|---|
| ink | `#1B1815` | Body text, headlines, dark sections |
| oak | `#B4763A` | Primary warm accent, links, underlines, active rules |
| pine | `#22403A` | Primary buttons, footer, dark bands |
| pine-hover | `#2C544C` | Pine button hover (on dark grounds) |
| pine-hover-dk | `#1A322D` | Pine button hover (on light grounds) |
| sawdust | `#F5EFE4` | Page background |
| paper | `#FFFDF9` | Card and panel surfaces |
| brass | `#E2A63C` | Highlights, Join the Club CTA, gift accents, the joint box |
| brass-hover | `#CF9530` | Brass button hover |
| stone | `#D8D0C2` | Rules, dividers, disabled |
| signal | `#C0392B` | Errors only, and the "Critical" impact tag |
| rule (strong) | `rgba(27,24,21,0.40)` | The 2px section dividers |

Reveal layer only: Airship purple `#8D00D4`, Airship magenta `#EC00FF`, Toggle blue `#1770FD`, Toggle cyan `#45C1FF`.

Ratio: sawdust and paper carry ~65% of any screen, ink 20%, oak and pine 12%, brass 3%. **No gradients in the guest layer** — gradients belong to the reveal layer and that contrast is the point.

### Typography

- **Display: Fraunces**, weights 600–900, `font-variation-settings: "SOFT" 40, "WONK" 1`. Headlines, venue names, big numbers.
- **Body and UI: Inter**, 400 / 500 / 600.
- **Labels:** Inter 600, uppercase, `letter-spacing: 0.08em`, 12–13px.
- **Technical / data: IBM Plex Mono** 400–500. All field names, values, dates, prices, counts.
- **Reveal layer headings: Montserrat 600** (Airship) and **Manrope ExtraBold** (Toggle).

Google Fonts: `Fraunces:SOFT,WONK,opsz,wght@40,1,9..144,600..900`, `Inter:wght@400;500;600`, `Montserrat:wght@600`, `IBM+Plex+Mono:wght@400;500`.

Desktop scale: H1 72/1.02, H2 48/1.05, H3 32/1.15, H4 24/1.25, lead 20/1.5, body 17/1.6, small 15/1.5.
Mobile scale (under 620px): H1 40/1.05, H2 32/1.1, H3 24/1.2, body 17/1.6.

Measure never exceeds 68 characters (`max-width` in `ch` on every paragraph). `text-wrap: pretty` on headings.

### Space and shape

- 4px base unit. Section padding **120px desktop / 64px mobile**. Container **1200px**, gutters 24px.
- **Radius: 0 everywhere.** Sharp, not bubbly.
- One shadow only: `0 2px 12px rgba(27,24,21,0.08)`.
- Section dividers: **2px** `rgba(27,24,21,0.4)`. Row dividers: **1px** stone. Never soften these to hairlines.
- Grids are drawn by putting a `rgba(27,24,21,0.4)` background behind a `gap: 2px` grid so the gaps read as rules.

### Motion

200ms ease-out on hover, 300–400ms on reveal transitions. Keyframes used: `joRise` (translateY 12px + fade, for panels appearing), `joSlide` (translateX 24px + fade, for the right-hand panel). No parallax, no scroll-jacking. `@media (prefers-reduced-motion: reduce)` kills all animation and transition.

### Accessibility rules baked in

- Every tap target **44px minimum** (48–56px on primary actions).
- `:focus-visible { outline: 2px solid #B4763A; outline-offset: 2px; }` — never the browser default.
- `::selection` is `rgba(226,166,60,0.35)`.
- Body text 4.5:1 against its ground. Full-opacity ink on accent and photo grounds.
- Step-free access stated in prose on venue pages, not as a single icon.
- Allergen data per dish in the menu component.

---

## Global chrome

### Header (sticky, `z-index: 60`)

Two rows on a paper ground with a 2px bottom rule.

**Row 1** (min-height 72px, 1200px container, 24px gutters):
- Left: dovetail SVG mark (26×26, 1.4px oak stroke) + "Joiners" in Fraunces 800 24px, `letter-spacing: -0.02em`. Links home.
- Right, in order: the 390/1440 preview chips (**prototype-only, drop these in production**); the **See the joints** switch; then Join the Club (brass) and Book a table (pine) butted together with a 2px gap.

**Row 2** (1px stone top rule): nav flush left, 32px gaps, 14px vertical padding, 15px Inter. Items: Places, Menus, Stay, The Engine Room, Parties, Contact, Gift Shop, WiFi — plus **The Joints** appended only when the reveal layer is on. Active page carries a 2px oak bottom rule sitting on the header's own bottom edge (`margin-bottom: -2px`); hover shows the same rule.

**Below 860px** (or when the 390 chip is active), row 2 is replaced by a hamburger (46px, 1px ink border, three 20×2px bars) in row 1. It opens a sticky drop panel listing all routes as 18px links with 1px stone dividers, closing on selection.

### The switch

38×20px track, 1px oak border, transparent when off and brass when on; 14×2px knob moving from `left: 2px` to `left: 21px` over 200ms. Label "See the joints" in Inter 600 uppercase 13px, `letter-spacing: 0.08em`. Keyboard shortcut `J` (ignored while focus is in an input). State persists in `sessionStorage['joiners-reveal']`. First-visit desktop tooltip: ink card, "This site is built by Airship. Flip this to see how it works." with a Got it button, dismissal stored in `sessionStorage['joiners-tip']`.

### Sticky mobile bar (under 860px, `z-index: 55`)

56px tall, pine, 1px top rule. "Book a table" fills the row; "Join the Club" sits on the right in brass with 22px horizontal padding.

### Footer (pine)

Four columns at 40px gaps: **Our places** (all four names, the shared address, the shared phone, in IBM Plex Mono 12px); **Site** (Places, Menus, Stay, The Engine Room, What's On/The Joints when revealed, Parties, Gift Shop, WiFi, Joiners Club, Book, Contact us); **Legal** (Privacy, Terms, Gift card terms, Accessibility); and **Two emails a month** — an email field plus a Sign up button that **forwards to the Joiners Club page and scrolls to the form, carrying the typed email across**, with a line explaining that.

Bottom strip, above a 1px rule at 25% paper: "Joiners is a fictional hospitality group built by Airship to show what Airship and Toggle can do for operators." — then the real Airship and Toggle logos (`assets/airship.png` 38px tall, `assets/toggle.png` 24px tall), no white chip behind them. **This line is the only permanent break in the fiction.**

---

## Pages

All routes are client-side state in the prototype (`state.route`), scrolling to top on navigation. In Webflow these become real pages.

### 1. Home (`home`)

- **Hero.** Full-bleed photograph, min-height `max(60vh, 520px)` (`max(55vh, 460px)` mobile), ink ground. Left-to-right scrim `linear-gradient(90deg, rgba(27,24,21,0.82), rgba(27,24,21,0.5) 55%, rgba(27,24,21,0.15))`. Content bottom-left in a 640px column: H1 "Four places in Sheffield and the Peaks." (paper), 20px lead, then Book a table (pine) and See our places (paper outline, 1px 70% paper border).
- **Hours strip.** Ink band, 1px top rule at 15% paper, IBM Plex Mono 13px: today's hours for all four venues joined by ` · `.
- **The four places.** 2px-rule grid, four cards: 200px photo, venue name Fraunces 24px, one-line description, then a 1px-ruled block with distance, today's hours in pine, and a Book link with a 1px oak underline.
- **What's on.** Three columns: date in oak mono uppercase, 22px title, description, price in mono.
- **Join the Club.** Full-width pine band. H2 "Join the Club.", 18px lead at 90% paper, then a 5-column inline form (first name, email, birthday, **year**, where you go most) with paper inputs and a brass submit. Under it, in Inter 600 uppercase 12px: "What you get back: Something for your birthday and special day, competitions, rewards and good news from the venues you love." On submit the band replaces the form with a paper success card.
- **Gifts.** Two-up inside a 2px border: photograph left, then H2 "Gift someone a table", three priced rows on 1px rules, and a brass "Visit the shop".
- **Journal.** Three posts: 180px image, mono date, 20px title.

### 2. Places (`places`)

H1 "Our four places", lead "Four rooms on one Sheffield street. Different rooms, same kitchen thinking.", then a two-up 2px-rule grid of venue cards (240px photo, 26px name, 90-word description, mono address/phone/hours, "Visit this page" link).

### 3. The Joiners Arms (`arms`) — the venue template

- **Hero** photograph, min-height `max(52vh…)`, venue name in Fraunces over a top-to-bottom scrim.
- **Overlapping info card**, pulled up 40px over the hero, 2px border, the one shadow: address, today's hours + kitchen hours, tappable phone; then Book a table (pine) and Check rooms (outline), and four capability chips — Step-free entry, Dog friendly, Parking, Allergen menu (1px stone border, sawdust fill, uppercase 12px). **Rule 3: all of this is visible without scrolling.**
- **The place, in a paragraph.** 20px, 62ch, written like a person.
- **Menus.** Four tabs (Lunch, Dinner, Sunday, Drinks) as a 2px-rule row, active = ink fill. Then dietary filter chips (Vegetarian, Vegan, Gluten free, Dairy free, Nut free) — **selecting dims non-matching dishes to 32% opacity, it never hides them**. A mono line states the last-updated date and the filter behaviour. Dish rows: name 18px, dietary tags in oak mono, price in mono; tapping a row expands its allergen line.
- **Rooms.** Three cards in a 2px-rule grid: 180px photo, name, one line, "From £x", Check availability.
- **Find us.** Two-up: map slot left; By car / By train and tram / Access in the right column, each with an Inter 600 uppercase 16px heading. **Access is written properly** — step-free route named, accessible WC, the fact the nine bedrooms are upstairs with no lift, dogs, large print menus.
- **Also ours.** Three small cross-sell cards, 64px thumb + name + distance, 1px stone border going oak on hover.

### 4. The Engine Room (`engine-room`) — the fourth venue

Same template. Info card: address, "Classes and events by arrangement · see the diary below", phone; Enquire about private hire (pine) and Gift a class (outline); chips Step-free lift access, Hands-on 8 to 12, 12 to 60 covers, Allergens catered.

**Classes and supper clubs** is the venue's own diary: filter chips (Everything, Classes, Supper clubs, Tastings, Private hire) and rows in a `130px / 1fr / 190px` grid — date + time in mono, then type label in oak uppercase, 21px title, note; then price, availability status ("4 places left", "Sold out") and Book a place. Closing line: members hear about new dates a week before general sale.

### 5. Joiners Club (`table`) — the conversion spine

- **Hero.** Pine, no photograph. H1 "The Joiners Club.", lead "A club with no card, no points and no app…".
- **The seven things we ask.** A 4-across grid (2 at tablet, 1 at mobile), each cell 36px padding with a 1px stone right rule and a 36px column gap so text never hugs the rule. Field name in Fraunces, and directly beneath **in oak** what it buys the guest. The seven: name, email, mobile, birthday, anniversary, postcode, where you go most.
- **Join CTA.** Above a 2px rule: a large brass "Join the Joiners Club" (20px/36px padding, 19px type, 60px tall) which scrolls to the form, beside "Seven fields, under a minute. No card, no points, no app."
- **What joining gets you, year one.** Paper box, 2px border, 44px padding: kicker, H3, lead, then four columns — the day you join / your dates / every month / the more you visit.
- **The form** (`#joiners-club-form`). Paper section between 2px rules, 800px measure. Single column, generous: first name, email, mobile, then birthday + **year** as a `1fr / 130px` pair, anniversary + **year** the same, postcode, venue select, pine submit. **Success is not a modal** — the section transforms: "Thank you, {name}. Your first Club Friday is 3 October. Your birthday table is already in the diary for {date}."
- **A member's year.** Twelve cells in a 2px-rule grid (6 / 4 / 2 columns), each 130px tall with the month in mono and the event; March, September and November are pine-filled to mark the birthday, the joining anniversary and the Christmas priority window.
- **Bring someone new.** Brass block, 44px padding, H3 + lead + ink "How it works".
- **Segments, made visible.** *Reveal only.* Ink section: kicker in magenta, H2 in Montserrat, then fourteen segment cards in a 2px-rule grid — name in Montserrat 16px, plain-English definition, count in magenta mono 20px, and "contacts · illustrative" beneath.

### 6. Parties (`parties`), Gift Shop (`gifts`), Book (`book`)

Structural shells with real headings, leads and a mono note stating what is still to build. Gift Shop carries pin 29, Parties pins 14 and 28.

### 7. WiFi (`wifi`)

A single 440px card, centred, mobile-shaped, 2px border and the one shadow — modelled on the live Fydelia splash for Joiners Kitchen.

- **State 1, form.** Kicker "You are at", H1 "Joiners Coffee House" (venue detected), email field, full-width pine Connect. Then: "We will send you nothing unless you tick a box. Connecting gets you two hours of WiFi either way." Optional birthday + **year** pair with "We will send you something on the day. Skip it and the WiFi works the same." Then **two separate opt-ins** — email and SMS — as 22px square custom checkboxes (1px ink border, brass fill, ✓), never one bundled tick.
- **State 2, online.** "You are online." + "Here is what is good today." and **one** well-chosen recommendation on a 2px/1px ruled block — not a wall of marketing.

### 8. Contact us (`contact`)

H1, lead, then a two-up 2px-rule block: left, phone (22px oak), address, email, and a 1px-ruled list of all four venues with today's hours; right, a map slot. Below, two columns: the **embedded Airship form** (`<div data-airship-form-url="https://forms.airship.co.uk/forms/6755399444000000/contact-us">` with `https://forms.airship.co.uk/assets/js/embed.js`) with pin 34; and "Straight to the right place" — five routed cards (booking, parties, classes, gift cards, the Club) plus an access and dietary note on sawdust.

### 9. The Joints (`whats-on`) — **reveal only**

Gated: the nav item, the footer link and the page all require the switch. Toggling the switch off while on this page returns the visitor home, so the guest layer never shows a tab that declares itself not guest-facing.

A **3px brass box** with a brass header strip: "The Joints · operator view, not guest-facing" + pin 33. Then a three-tab bar (2px-rule grid, active = ink fill), each tab showing a label and a mono note:

1. **National What's On** — the UK hospitality trading diary, 521 dates, Sep 2026 – Dec 2027. Live.
2. **Foodie Favourites** — awaiting content.
3. **Cheers by Airship** — awaiting content.

**National What's On** is search + filter over `diary-data.js`:
- Free-text search across event, operator note, scope, category and date.
- Impact chips: Any / Critical / High / Medium / Low.
- Three selects: Category (22 values), Where (36 scopes), Month (17 months).
- Live count ("65 of 521 dates") and Clear all.
- Rows in a `150px / 1fr / 96px` grid: date range in mono; event 19px 600 with a mono meta line (category · scope · plan from N out · date status); then a colour-coded impact tag — Critical `#C0392B`, High `#B4763A`, Medium `#22403A`, Low `#D8D0C2`. Tapping a row reveals the operator note.
- Pages in 40 at a time via a "Show 40 more" button.
- Footnote explaining Fixed vs Confirmed vs Typical (verify).

The two placeholder tabs show their heading, a lead, and a dashed-border note. **Content is coming from the user** — build these to match tab 1's search-and-filter treatment once it arrives.

---

## The reveal layer

### Pins

24–32px circles, product-coloured fill (`#8D00D4` Airship, `#1770FD` Toggle), number inside in Montserrat 600 / Manrope 800, white. On photographic grounds they carry a `0 0 0 3px rgba(255,253,249,0.9)` ring. They render **only** when the switch is on, and leave no spacing residue when off (each is wrapped in its own conditional inside an existing flex gap).

34 pins are built. Their placements, in order: 1 and 15 on the home hero, 2 on the four places, 16 on What's on, 3 / 4 / 18 on the home Club band, 5 on Gifts, 17 in the footer newsletter block, 6 on the Arms menus, 7 and 25 on rooms, 8 and 26 on cross-sell, 27 on Places, 9 and 19 on the seven things, 13 on the join CTA, 20 on the value-exchange block, 10 / 21 / 22 on the success state, 11 / 12 / 23 on the member's year, 24 on Bring someone new, 30 on the Engine Room diary, 14 and 28 on Parties, 29 on Gift Shop, 31 and 32 on WiFi, 33 on The Joints, 34 on Contact.

### The panel

Right-hand panel, **420px** (full width on mobile), paper ground, **3px product-coloured left edge**, `joSlide` in over 300ms, over a `rgba(27,24,21,0.45)` scrim. Escape or the 44px close button dismisses it. Contents in order:

1. **Product lockup** — the real `assets/airship.png` (40px) or `assets/toggle.png` (24px). **Never a text approximation.** (Implementation note: use two static `src` values gated by a flag, not one templated `src`.)
2. Mono kicker: "Pin {n} · {where}".
3. Mechanic name, 26px, Montserrat 600 for Airship / Manrope 800 for Toggle.
4. **What this does** — two sentences, plain, 16px.
5. **Data captured** — the actual field names in IBM Plex Mono 13px as a 1px-ruled key/value list.
6. **What fires next** — the journey as a vertical timeline: 1px left rule, 9px product-coloured squares, mono uppercase timing + plain-language step.
7. **The number** — sawdust block, Fraunces 800 40px, then a label, then **source and date in mono 11px**. Unsourced numbers read `[SOURCE NEEDED]` with the reason underneath.
8. **The argument** — where present, a Fraunces 600 20px pull quote.
9. "See this in the Engine Room" link.

### Your Record

Floating card, paper, 1px ink border, the one shadow. Desktop: `right: 20px; bottom: 20px`, 340px wide. Under 860px: full width at `left/right: 12px`, sitting 68px up to clear the sticky book bar. **Starts collapsed** so it never covers the hero; the open body caps at `min(42vh, 380px)` with its own scroll so the header bar can always be reached.

Header bar: ink, "YOUR RECORD" in Montserrat 600 uppercase 12px with `letter-spacing: 0.1em`, and show/hide on the right.

Ten rows, mono 12px, 1px stone dividers, each with a value and **a tiny source tag naming the mechanic that captured it**: Contact, Proof of Presence (pages + dwell, ticking every second), Venue signal (which venue, viewed N times), Interest (menu tabs, dietary filters, diary types, enquiry topics), Segments (N of 14 matched), Email, Mobile, Birthday, Anniversary, Postcode. Captured values render in Airship purple; empty ones in 50% ink.

Footer line: "Join the Club and watch this fill in." → after submission, "Birthday journey scheduled — first email 6 weeks before {date}."

Then a **reset** button: "reset — delete this record". In the sandbox this must genuinely delete the contact and cancel queued sends, with no login.

**This card is the mechanic that converts. Guard it.**

### Sandbox notice

Every form in reveal mode carries, in mono: "This is a live demonstration. Anything you enter creates a real record in a real Airship account and you will receive real emails. Delete it any time."

---

## State

```
route                     current page
reveal                    switch state (sessionStorage, keyboard J)
activePin                 open pin number or null
recOpen                   Your Record expanded (starts false)
menuOpen                  hamburger panel
vw, frame                 measured viewport + 390/1440 prototype override
tipSeen                   first-visit tooltip dismissed (sessionStorage)
menuTab, diets[], openDish        Arms menu component
diaryType                 Engine Room diary filter
erTab                     The Joints sub-tab
wo[], woQ, woImpact, woCategory, woScope, woMonth, woLimit, woOpen   national diary
form{...}, joined         Joiners Club form + success
wifiState, wifiEmail, wifiDob, wifiDobYear, wifiOptIn, wifiSms       WiFi splash
contact{...}, contactSent Contact page
rec{...}                  Your Record — pages[], seconds, venueViews{}, interests[],
                          name, email, mobile, birthday, anniversary, postcode, venue
```

**Responsive is measured, not guessed.** Three breakpoints: `veryNarrow` < 620 (mobile type scale), `narrow` < 860 (grids collapse, record card goes full width), `headerNarrow` < 860 (nav row → hamburger, sticky book bar appears). Width is read from `max(documentElement.clientWidth, innerWidth)` and re-measured on mount, on `requestAnimationFrame`, on the next tick, at 250ms, on `resize` and via a `ResizeObserver` — a single construction-time snapshot renders the wrong layout in an iframe that loads at its final size.

---

## Assets

| File | What it is |
|---|---|
`Joiners.dc.html` | The whole design — template + logic
`diary-data.js` | 521 diary entries as JSON, extracted from the user's xlsx. Replace the file to update the page.
`image-slot.js` | The drag-and-drop image placeholder web component. **Prototype only** — replace with real `<img>`/Webflow images.
`assets/airship.png` | Official Airship logo, cropped to its true edges (1200×625)
`assets/toggle.png` | Official toggle logo, cropped (1200×412). Letter counters are transparent, so it needs a light ground.
`support.js` | The authoring runtime. **Do not port.**
`screenshots/` | Reference captures of every page in both layer states, with `index.md` describing each one

No photography is supplied. Every `<image-slot>` id and placeholder caption describes the intended shot.

---

## Webflow notes

- **Reveal layer.** Webflow cannot express this natively. Build it as custom code in the page or site `</body>` script: a class on `<html>` (`.reveal-on`) toggled by the switch, with pins and the panel hidden by default in Webflow-authored CSS. Pins can be real Webflow elements with `display: none` until the class lands. Your Record and the panel are best as one custom-code component driven by `sessionStorage`, since they persist across pages — which the prototype fakes with client-side routing and Webflow will not.
- **Rule 12 is the acceptance test.** Switch the layer off and there must be no residue: no odd spacing, no orphan markers, no slower page. Test with the switch off in an incognito window.
- **The Joints must be gated** — not merely hidden. A guest who lands from search should never see it, and Webflow page-level SEO settings should exclude it from indexing.
- **Airship forms** embed as-is via an HTML Embed element; the script tag can live in the page footer.
- **Performance.** Rule 5 is under 2.5s LCP on 4G: hero images no larger than 200KB, no autoplay video above the fold, fonts preconnected and `display=swap`. `diary-data.js` is 162KB — load it only on The Joints page, not site-wide.
- **Cookie banner** must be a dismissible bottom sheet that never covers a call to action.
