# Joiners — Webflow handoff

A complete static build of the Joiners site, written so a Webflow developer can
rebuild it in the Designer without guessing at a single value.

Everything here comes from `Joiners.dc.html`, the design reference. Colours,
type, spacing, copy, state and behaviour are final. The original brief is kept
verbatim at `_reference/original-design-brief.md` — **read it**, it carries the
reasoning this document only summarises.

---

## 1. Review it first

```bash
node _reference/build/serve.js
```

Then open <http://localhost:4321>. Press **J** or click **See the joints** to
flip the reveal layer. `_reference/screenshots/` holds captures of every page in
both states.

A plain file:// open works for everything except The Joints, which loads the
diary with a dynamic `import()` and needs a real origin.

---

## 2. What is in the box

```
index.html                Home
places.html               Our four places
the-joiners-arms.html     The venue template — menus, rooms, find us
the-engine-room.html      The fourth venue — classes and supper clubs diary
joiners-club.html         The conversion spine
contact.html              Contact, with the live Airship form embed
wifi.html                 The WiFi splash
gift-shop.html            Structural shell
parties.html              Structural shell
book.html                 Structural shell
the-joints.html           Operator view — REVEAL ONLY, GATED, noindex

css/joiners.css           Guest layer. Single-class selectors — see §4.
css/reveal.css            Reveal layer. Custom code, not Designer work.

js/data.js                All page copy, the 34 pins, menus, segments, diary.
js/site.js                Guest layer behaviour + the visitor record.
js/reveal.js              The switch, the pins, the panel, Your Record.
js/joints.js              The Joints tabs + national diary search. That page only.
js/diary-data.js          521 trading dates. 162KB. That page only.

assets/airship.png        Official lockup, 1200×625, cropped to its true edges.
assets/toggle.png         Official lockup, 1200×412. Letter counters are
                          transparent, so it needs a light ground.

_reference/               The original brief, the design file, screenshots,
                          and the generator that produced these pages.
```

`_reference/build/gen.js` rebuilds every page from `js/data.js`. Change the copy
in one place, run `node _reference/build/gen.js`, and all eleven pages update.
No line of copy was ever retyped by hand, and none should be.

---

## 3. Page map

| File | Webflow page | Slug | Notes |
|---|---|---|---|
| index.html | Home | `/` | |
| places.html | Places | `/places` | |
| the-joiners-arms.html | The Joiners Arms | `/the-joiners-arms` | The venue template. Duplicate it for the other venues. |
| the-engine-room.html | The Engine Room | `/the-engine-room` | |
| joiners-club.html | Joiners Club | `/joiners-club` | Form anchor id `joiners-club-form` must survive. |
| contact.html | Contact us | `/contact` | Airship embed + form script. |
| wifi.html | WiFi | `/wifi` | Modelled on the live Fydelia splash. |
| gift-shop.html | Gift Shop | `/gift-shop` | Shell. |
| parties.html | Parties | `/parties` | Shell. |
| book.html | Book | `/book` | Shell. |
| the-joints.html | The Joints | `/the-joints` | **Gated.** See §7. |

Nav order is Places, Menus, Stay, The Engine Room, Parties, Contact, Gift Shop,
WiFi — then The Joints, appended only when the reveal layer is on. Menus and
Stay both point at the Arms (`#menus`, `#rooms`); keep those anchors.

---

## 4. How the CSS maps onto Webflow

`css/joiners.css` is written as **single-class selectors**, deliberately. A
Webflow style rule attaches to a class on an element, so every rule in that file
is something you can create in the Designer as a class of the same name and
paste the declarations into.

Four things do not map, and need to go in **Site Settings → Custom Code → Head**:

1. **The `:root` token block.** These are the design tokens. Webflow Variables
   can hold the colours if you prefer — the names match — but the type, spacing
   and layout tokens are easiest left as CSS custom properties, because the
   responsive type scale works by redefining four of them at one breakpoint.
2. **Base element styles** — `body`, `h1`–`h4`, `p`, `a`, `button`, `img`,
   `*{box-sizing}`. Most of these you can set in the Designer's body and
   typography settings instead; the exceptions are
   `font-variation-settings: "SOFT" 40, "WONK" 1` on headings (Fraunces needs
   it) and `text-wrap: pretty`.
3. `:focus-visible { outline: 2px solid #B4763A; outline-offset: 2px; }` and
   `::selection`. Never leave the browser default focus ring.
4. The two `@keyframes` and the `prefers-reduced-motion` block.

**The only two descendant selectors in the guest layer** (both marked
`[DESCENDANT]` in the file) are state-driven and belong in custom code:

```css
.jo-check.is-on .jo-check-box     { background: var(--jo-oak); }
.jo-dish.is-open .jo-dish-allergens { display: block; }
```

`.is-on`, `.is-active`, `.is-open`, `.is-dim` and `.is-marked` are the only
state classes. In the Designer, create them as combo classes so they exist; the
scripts add and remove them at runtime.

### Breakpoints

The design has two real breakpoints: **860px** (grids collapse, nav becomes a
hamburger, the sticky book bar appears, Your Record goes full width) and
**620px** (the mobile type scale).

Webflow's Designer breakpoints are 991 / 767 / 479. They do not line up. Pick
one:

- **Faithful (recommended).** Author the layout at Webflow's breakpoints for
  everything that is merely nice-to-have, and put the two exact media queries
  from the foot of `joiners.css` in custom code. The switch from four columns
  to two, and the 72px → 40px H1, then happen exactly where the design says.
- **Approximate.** Treat 991 as 860 and 767 as 620. Simpler to maintain, and
  the layout is defensible at every width — but the H1 stays at 72px down to
  767px, which is too big on a large phone in landscape.

Do not change 860 to 991 for the **header**: below 860 the nav row is replaced
by the hamburger and the sticky book bar appears, and those three things have to
switch together or you get a page with both a nav row and a book bar.

### Grids are drawn with gaps

There are no border rules between cards. A grid with `gap: 2px` sits on a
`rgba(27,24,21,0.4)` background, so the gaps *are* the rules. `.jo-grid-ruled`
and `.jo-grid-boxed` do this. In the Designer: set the grid's background colour
and a 2px gap, and give each cell a `#FFFDF9` background. Do not replace these
with borders — you will get doubled 4px rules at every internal join.

**Radius is 0 everywhere.** Webflow defaults some elements to a radius; clear it.
There is exactly one shadow, `0 2px 12px rgba(27,24,21,0.08)`, and it is used
three times: the venue info card, the WiFi card and the reveal panel.

---

## 5. What should become CMS

Five collections, seeded from `js/data.js`:

| Collection | Source | Used on |
|---|---|---|
| **Venues** (4) | `VENUES` | Home, Places, cross-sell blocks, footer, Contact hours |
| **Dishes** | `MENUS` — name, price, dietary tags, allergens, menu | Arms menus |
| **Rooms** (3) | `ROOMS` | Arms |
| **Diary** (8) | `DIARY` — date, time, type, title, note, price, status | Engine Room |
| **Journal** (3) | `JOURNAL` | Home |

Venues is the one that earns its keep: the same four records render the home
grid, the Places page, the footer, the hours strip, the Contact hours list and
every "Also ours" block. Get it wrong and you will be editing an address in six
places.

Dietary tags must be a multi-reference or a set of switches, not a text field —
the filter reads them as tokens (`V VG GF DF NF`).

`SEGMENTS` (14) and the 34 pins are reveal-layer content. Leave them in
`js/data.js`; they are not guest-facing and putting them in the CMS only
exposes them.

---

## 6. The reveal layer

Webflow cannot express this natively, and it should not try.

**How it works.** The switch toggles a single class, `.reveal-on`, on `<html>`,
and persists the state in `sessionStorage`. Everything the layer draws is CSS-
gated on that class. Pins are real elements in the markup with `display: none`
until the class lands — and `display: none`, not `visibility` or `opacity`,
because a hidden flex child must not hold its place in the container's gap.

**Where the code goes.**

| File | Where |
|---|---|
| `css/reveal.css` | Site Settings → Custom Code → **Head** |
| `js/data.js` | Site Settings → Custom Code → **Footer**, first |
| `js/site.js` | Footer, second |
| `js/reveal.js` | Footer, third |
| `js/joints.js` | **The Joints page only** → Page Settings → Before `</body>` |
| `js/diary-data.js` | Hosted asset, imported by `joints.js`. Never site-wide. |

Order matters: `data.js` defines `window.JO`, `site.js` hangs the visitor record
off it, `reveal.js` reads both.

**Why sessionStorage and not a Webflow interaction.** The prototype faked
navigation client-side, so the panel and Your Record survived a page change for
free. Webflow serves real pages. `sessionStorage` is what carries the switch
state, the record and the open/closed state of the card across a real
navigation — which is the whole point of Your Record, because it has to fill in
as somebody moves through the site.

**Your Record is the mechanic that converts. Guard it.** It starts collapsed so
it never covers the hero, its open body caps at `min(42vh, 380px)` and scrolls
so the header bar can always be reached, and on mobile it sits 68px up to clear
the sticky book bar. Ten rows, each naming the mechanic that captured the value.

**The reset button** currently clears local state. In the sandbox it must
genuinely delete the contact and cancel queued sends, with no login. That is a
real endpoint someone has to wire — it is marked in `js/reveal.js`.

### Rule 12 is the acceptance test

> Switch the layer off and there must be no residue. No odd spacing, no orphan
> markers, no slower page.

Test it with the switch off in an incognito window. The build passes today:
with `.reveal-on` absent, 9 pins sit in the home page DOM, **0** of them take up
any layout space, no reveal-only element is visible, and neither the panel nor
Your Record renders. Re-run that check after any change.

---

## 7. The Joints must be gated, not hidden

Three things, all of them required:

1. `js/reveal.js` redirects to the home page if the page is opened with the
   layer off. Toggling the switch off while on the page also returns the visitor
   home — so the guest layer never shows a tab that declares itself not
   guest-facing.
2. The page carries `<meta name="robots" content="noindex, nofollow">`. In
   Webflow, set this in Page Settings → SEO → "Exclude this page from site
   search results" **and** add the meta tag, and exclude the slug in
   `robots.txt`.
3. The nav item and the footer link only exist when the layer is on.

A guest arriving from search should never see it. Hiding it in the nav is not
enough.

---

## 8. Forms

**The Airship contact form** embeds as-is. The div and the script are already in
`contact.html`:

```html
<div data-airship-form-url="https://forms.airship.co.uk/forms/6755399444000000/contact-us"></div>
<script src="https://forms.airship.co.uk/assets/js/embed.js" async></script>
```

In Webflow: an HTML Embed element for the div, the script in the page footer.

**The Joiners Club form** is currently local-only — it writes to the visitor
record and transforms the section. It needs wiring to Airship. Note two things
the design is firm about: success is **not a modal**, the section transforms in
place; and the day/year pairs are two fields, because people will give you a day
and month happily and a birth year reluctantly.

**The WiFi page shows the live Fydelia splash**, framed from
`https://ondemand.fydelia.com/splash/joiners-kitchen/`. The designed replacement
that used to sit beside it was removed on request; its design is not lost — it is
specified in full in `_reference/original-design-brief.md` (section 7) and
captured in `_reference/screenshots/`. If it is ever rebuilt, the two things that
matter are that success is not a modal, and that the email and SMS opt-ins are
**two separate ticks**, never bundled with each other or with the terms.

Three things to keep if you rebuild the embed:

- The framed page's mobile layout carries a 410px min-width, so framing it at the
  440px column width clips the right-hand edge off the form. It renders at a
  600px **logical** width and is scaled down (`.jo-splash-iframe`), with
  `site.js` setting the scale from the frame's measured width so it holds on a
  phone too.
- Because that logical width is always 600, the framed page's height is a
  constant — measured at 1088px. The iframe is given 1100px so nothing scrolls
  inside it. If Fydelia changes the page, re-measure and update `SPLASH_H` in
  `site.js` and the height in `.jo-splash-iframe`.
- It is a third-party page outside our control. It can change or disappear
  without notice, so nothing on the page depends on its contents — and every
  visitor to this page loads Fydelia in the background.

**The joints for this page sit beside the splash, not on it** (`.jo-splash-joints`),
because pins cannot be placed inside a cross-origin frame. Pins 31 and 32 are
labelled there so they still read on their own.

**The footer signup** does not subscribe anybody. It forwards to the Joiners
Club page, scrolls to the form and carries the typed email across, so the guest
sees what they get back before they finish. That is deliberate.

**In reveal mode every form carries the sandbox notice** — "This is a live
demonstration. Anything you enter creates a real record in a real Airship
account and you will receive real emails. Delete it any time." Keep it on any
form you add.

---

## 9. Performance

Rule 5 is **under 2.5s LCP on 4G**.

- Hero images no larger than 200KB. No autoplay video above the fold.
- Fonts are preconnected and `display=swap`. Five families are loaded —
  Fraunces, Inter, Montserrat, Manrope, IBM Plex Mono. Montserrat and Manrope
  are reveal-layer only; if you want to trim the guest layer's font budget,
  load those two on demand when `.reveal-on` first lands.
- `js/diary-data.js` is 162KB. It is imported dynamically by The Joints and must
  not be loaded site-wide.
- The cookie banner is a dismissible bottom sheet that never covers a call to
  action.

---

## 10. Before this goes live

**Photography.** None is supplied. Every image is a placeholder carrying the
brief for the shot in `data-shot`. The brief: natural light, warm cast, shallow
depth, people mid-conversation, food shot at the table with cutlery and crumbs
in frame. No stock. No plated overhead shots. 3% grain across all imagery
(`.jo-grain` does this in CSS — keep it or bake it into the assets).

**Three numbers are unsourced** and must not go live until sourced and cleared.
They are deliberately visible as `[SOURCE NEEDED]` in the UI so they cannot slip
through:

| Pin | Mechanic | What is needed |
|---|---|---|
| 4 | Value Exchange | Airship form completion benchmark |
| 5 | Presold revenue | Toggle redemption uplift |
| 11 | Birthdays | Airship birthday journey booking rate |

**Two Joints tabs are awaiting content.** Foodie Favourites and Cheers by
Airship are built as placeholders. When the content arrives, build them to match
tab 1's search-and-filter treatment.

**Three pages are structural shells** — Gift Shop, Parties, Book. They carry
real headings and leads and a mono note stating what is still to build. The
Toggle shop, the party enquiry flow and the booking flow are the next build.

**The fiction is broken in exactly one permanent place**: the footer strip.
Leave it alone.

---

## 11. Accessibility, baked in

These are not nice-to-haves; they are in the design and they are in this build.

- Every tap target 44px minimum, 48–56px on primary actions.
- `:focus-visible` is a 2px oak outline with 2px offset, never the browser
  default.
- Body text at 4.5:1 against its ground. The hero scrim is a left-to-right
  gradient specifically so the text column holds contrast over any photograph.
- Step-free access is written out in prose on the venue pages, not reduced to an
  icon — including the bit that is inconvenient, that the nine bedrooms are
  upstairs with no lift.
- Allergen data per dish, and dietary filters **dim** non-matching dishes to 32%
  rather than hiding them, so nobody is shown a shorter menu than the one on the
  table.
- `prefers-reduced-motion: reduce` kills every animation and transition.
