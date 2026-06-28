# Flight Deck - project guide for Claude Code

Flight Deck is the internal HTML micro-site that houses Airship and Toggle's
Claude-adoption framework. It is **internal-comms only** - never client-facing.
This repo is a static site: hand-written HTML with inline CSS and a little JS.
No build step, no framework, no bundler. Keep it that way.

---

## How this repo deploys (read before editing)

- The repo is connected to **Azure App Service** ("Flightdeck") via GitHub Actions.
- **Every push to `main` auto-deploys.** Edit -> commit -> push -> live within a minute.
  The workflow is `.github/workflows/main_flightdeck.yml` - a static deploy
  (checkout -> azure/login -> webapps-deploy with `package: .`). It does NOT build
  anything. If you change it, do not reintroduce a .NET/Node build step.
- Because the deploy is `package: .`, **everything in the repo is published**,
  including this file. That is harmless (nothing links to it) but worth knowing.
- The live site sits behind **Microsoft Entra single-tenant sign-in** (company
  login required). Deployment auth and site sign-in are separate systems - editing
  files never touches the login lock.
- **Never edit files directly in Azure Kudu.** The next push overwrites them.
  GitHub is the single source of truth.

---

## File structure

Flight Deck is a **multi-page** static site. One page per top-level nav area,
sharing one stylesheet and one script. Each page only embeds its own images, so
they stay light (the old single-page build was ~700KB on every view).

Pages (all at the repo root):
- `index.html` - home: the hero and the "no single right way" intro (`#start`).
- `start.html` - the adoption plan: Set up you (`#you`), the department Brains
  (`#brains`), Memory (`#memory`), Make it stick (`#adopt`).
- `design-systems.html` - Design Systems hub: overview, the surface-picking video,
  a marked spot for instructions, and cards to the three brand pages below.
- `ds-airship.html` / `ds-toggle.html` / `ds-flightdeck.html` - one design-system
  page per brand (colours, type, surfaces, downloadable logos). Airship carries both
  the marketing brand and the in-app product surface; Flight Deck links the full logo
  sheet (`flight-deck-logo.html`).
- `power-tools.html` - the Part 2 band plus Context (`#craft`), Styles, Skills,
  Artifacts, Cowork, "Which tool, when" (`#ladder`), Connectors, Scorecard.
- `ideas.html` - Ideas hub: the commercial rationale (why we prototype, what earns
  a build, when we build) plus cards to the idea pages below.
- `idea-ccm.html` / `idea-lookout.html` / `idea-scv.html` - one page per prototype
  (Community Content Manager, Airship Lookout, Single Customer View), each with its
  live demo or mockup and build-spec links.
- `repackaging.html` - Cheers by Airship (`#repackaging`), plus the `cheers/` site.
- `dashboards.html` - Dashboards hub: one card per team dashboard.
- `dash-sales.html` - the Weekly Sales Dashboard, a live Supabase app embedded via an
  iframe from `dashboards/sales.html` (a self-contained app, kept verbatim).
- `dash-customer-success.html` - the CS board-flow dashboard (Trello card movements),
  embedded from `dashboards/customer-success.html`, same iframe pattern as Sales.
- `dash-product.html` / `dash-marketing.html` / `dash-engineering.html` - stub pages
  with a "coming soon" panel. Each carries an HTML comment showing how to drop a
  dashboard in later (save `dashboards/<team>.html` and swap the panel for an iframe).

Shared and supporting files:
- `assets/site.css` - the single stylesheet, linked from every page. **All styling
  lives here**, not in per-page `<style>` blocks.
- `assets/site.js` - the single script: the Loom `VIDEOS` config and embed loader,
  the copy-button handler, and the active-nav highlighter. Linked from every page.
- `assets/logos/` - downloadable brand marks used by the Design Systems page.
- `cheers/` - the standalone Cheers by Airship landing and pricing pages.
- `dashboards/` - the standalone dashboard apps embedded by the `dash-*` pages
  (e.g. `dashboards/sales.html`, a live Supabase dashboard with its own styling).
- `context/` - the two brand reference files. Read them in full before any design
  or copy work. The brand essentials are also summarised in "Two brands" below.
  - `context/Airship-Design-System.md`
  - `context/Toggle-Brand-Context.md`
- `.github/workflows/main_flightdeck.yml` - the Azure deploy workflow (see above).

**Navigation: a shared sticky bar duplicated in each page's `<head>` markup.** Top
level is `Start - Design Systems - Power tools - Ideas - Repackaging`; most dropdowns
link to `#anchors` within their page (e.g. `power-tools.html#styles`), but the Design
Systems dropdown links to separate pages (`ds-airship.html` etc.). The current page is
highlighted automatically by the active-nav code in `site.js`, which also lights up a
dropdown parent when one of its child pages is open.
Cross-page links are fully qualified (`page.html#anchor`); same-page links may stay
bare (`#anchor`).

When adding content:
- New section on an existing page: add it inside that page's `.html`, give it an
  `id`, and add a dropdown entry pointing at `page.html#id` **in every page's nav**
  (the bar is duplicated, so keep all copies in sync).
- New top-level area: create a new `.html` file using an existing page as the
  template (copy its `<head>`, sticky bar and footer), link `assets/site.css` and
  `assets/site.js`, and add the new `navtop` to every page's nav.
- Style changes go in `assets/site.css`; behaviour in `assets/site.js`. Do not
  reintroduce per-page `<style>` blocks.

---

## House style (applies to everything - copy and UI)

- **UK spelling** throughout: colour, organise, personalise, fulfilment, centre.
- **Hyphens, never em dashes.**
- **No emoji.** Not in copy, not as icons. Use real icons (Lucide is a good match).
- **Lead with the outcome, prove it with a number.** No vague claims, no flowery
  prose, no heavy corporate jargon.
- **Zonal**: state as fact only (Toggle was acquired by Zonal, October 2022).
  Never frame Zonal competitively or use it as the basis for advice.

---

## Two brands, three surfaces - pick deliberately

**Airship brand** (marketing / hero / AI features) - loud, gradient-forward.
- Type: Montserrat (400-900).
- Purple `#8d00d4`, magenta `#ec00ff`, deep-purple text `#34004d`.
- Purple `112deg` gradient, used sparingly, hero only. Never a blue gradient here.

**Airship product** (in-app / admin UI) - calm, soft-grey card-on-white.
- Type: Lato.
- Blue `#3180FF`, slate text `#354B64`, layered near-whites
  `#FFFFFF` / `#FAFBFB` / `#F4F6F7`. Cards go whiter on hover, not greyer.

**Toggle** (usetoggle.com - Hospitality Commerce: presold revenue and CRM
engagement via digital gift cards, experiences and tickets; not "a gift card
provider").
- Type: Manrope (ExtraBold headlines and big numbers), Lato fallback.
- Toggle Blue `#1770FD` dominates (~60% blue / 30% white and neutral / 10% accent),
  cyan `#45C1FF` accent, Slate Ink `#354B64` text. Backgrounds only white or
  Toggle Blue - never cream or beige.
- Signature: the wave motif, rounded everything, stats as the hero, two-tone
  headlines, mobile-first. Wordmark lowercase "toggle", never a capital T.

Flight Deck itself uses its own wordmark ("flight" in Airship purple + "deck" in
Toggle blue, coral dot) and may blend both palettes, because it is the one place
the two worlds meet. When a request is ambiguous about which brand a surface
should use, ask before building.

---

## Flight Deck conventions to preserve

- **Keep it as HTML.** Do not propose moving to PowerPoint or a framework - the
  copy buttons, Loom embeds, sticky nav and dashboard interactivity only exist
  because it is HTML.
- **Copy buttons**: the `.copy` button handler in `assets/site.js` powers the
  paste-ready prompt boxes. Do not break it when editing. The `[name]`, `[tone]`,
  `[team]`, `[task]` etc. inside those boxes are **intentional fill-in fields**,
  not placeholders to remove.
- **Brain names**: each department Brain is named and lives in the Brains section
  of `start.html`. Current set - HQ Brains: Florence (the source of truth), Austin
  (cross-functional comms), Lincoln (EOS operating rhythm). Department Brains:
  Savannah (Customer Success), Phoenix (Sales/BDM), Madison (Marketing), Milan
  (Product & Dev), Geneva (Finance & HR), Kingston (Account Management). If you
  rename a Brain, change every reference consistently across the page. Individual
  Brain owners are not yet named on the cards (they read "owned by the department
  champion") - set real owners only when asked, and do it consistently.
- **Loom**: the `VIDEOS` config at the top of `assets/site.js` has 11 embed slots
  keyed `why`, `step1`-`step5`, `craft`, `styles`, `skills`, `artifacts`, `cowork`.
  All currently render "coming soon" - they need real Loom share IDs dropped into
  the config. The video blocks themselves live on `start.html` and `power-tools.html`.

---

## Working agreement

- Make the change, show me what changed, then commit with a clear message.
- Because every push auto-deploys, confirm before pushing unless I have said go.
- Verify HTML tag balance and that in-page anchors still resolve before committing.
- If something here is wrong or out of date, tell me and fix it here - don't work
  around it silently.
