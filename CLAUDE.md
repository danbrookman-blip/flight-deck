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

Flight Deck is now a **single page**. Part 1 and Part 2 were merged.

- `index.html` - the complete Flight Deck (~700KB). It holds **both** parts on one
  page, with embedded base64 dashboard images:
  - **Part 1 - the five-step adoption plan**: Set up you, the department Brains,
    Brand and design, Memory and improving, Make it stick.
  - **Part 2 - the craft and power tools**: Better context in, Styles, Skills,
    Artifacts, Cowork, "Which tool, when", Connectors, Automated Scorecard reporting.
- `.github/workflows/main_flightdeck.yml` - the Azure deploy workflow (see above).
- `context/` - the two brand reference files. Read them in full before any design
  or copy work. The brand essentials are also summarised in "Two brands" below.
  - `context/Airship-Design-System.md`
  - `context/Toggle-Brand-Context.md`

**Navigation is in-page anchors, not separate files.** The sticky nav links to
`#start`, `#adopt`, `#brains`, `#brand`, `#memory`, `#part2`, `#connectors`,
`#scorecard`, `#you`.

When adding content: add a **new section inside `index.html`**, give it an `id`,
wire an anchor into the sticky nav, and inherit the existing `<style>` conventions.
Match the existing structure rather than inventing a new layout language. Only
create a second `.html` file if we deliberately decide to split the site again.

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
- **Copy buttons**: the `.copy` button JS at the foot of the page powers the
  paste-ready prompt boxes. Do not break it when editing. The `[name]`, `[tone]`,
  `[team]`, `[task]` etc. inside those boxes are **intentional fill-in fields**,
  not placeholders to remove.
- **Brain names**: each department Brain is named and lives in the Brains section
  of the page. Current set - HQ Brains: Florence (the source of truth), Austin
  (cross-functional comms), Lincoln (EOS operating rhythm). Department Brains:
  Savannah (Customer Success), Phoenix (Sales/BDM), Madison (Marketing), Milan
  (Product & Dev), Geneva (Finance & HR), Kingston (Account Management). If you
  rename a Brain, change every reference consistently across the page. Individual
  Brain owners are not yet named on the cards (they read "owned by the department
  champion") - set real owners only when asked, and do it consistently.
- **Loom**: the `VIDEOS` config (near the foot of `index.html`) has 13 embed slots
  keyed `why`, `step1`-`step5`, `craft`, `styles`, `skills`, `artifacts`, `cowork`.
  All currently render "coming soon" - they need real Loom share IDs dropped into
  the config.

---

## Working agreement

- Make the change, show me what changed, then commit with a clear message.
- Because every push auto-deploys, confirm before pushing unless I have said go.
- Verify HTML tag balance and that in-page anchors still resolve before committing.
- If something here is wrong or out of date, tell me and fix it here - don't work
  around it silently.
