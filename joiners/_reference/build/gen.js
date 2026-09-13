/* Joiners — static page generator.
 *
 * The handoff ships finished HTML; this script is how that HTML was produced.
 * It reads ../../js/data.js (the verbatim copy extracted from the design file)
 * and writes the pages, so no line of copy is ever retyped by hand.
 *
 * Re-run after editing data.js:   node _reference/build/gen.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
global.window = {};
require(path.join(ROOT, 'js', 'data.js'));
const D = global.window.JO;

/* ------------------------------------------------------------- helpers -- */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* A pin. Off by default; the reveal layer switches it on. */
function pin(n, opts) {
  opts = opts || {};
  const p = D.PINS[n];
  if (!p) throw new Error('no pin ' + n);
  const cls = ['jo-pin'];
  if (p.isToggle) cls.push('jo-pin-toggle');
  if (opts.lg) cls.push('jo-pin-lg');
  if (opts.onPhoto) cls.push('jo-pin-onphoto');
  return `<button type="button" class="${cls.join(' ')}" data-pin="${n}" aria-label="Pin ${n}: ${esc(p.title)}">${n}</button>`;
}

/* An image slot. Every one of these is a brief for real photography. */
function img(id, shot, cls) {
  return `<div class="jo-img jo-grain ${cls || ''}" data-slot="${id}" data-shot="${esc(shot)}">
            <div class="jo-img-ph">${esc(shot)}</div>
          </div>`;
}

const hoursStrip = D.VENUES
  .map((v) => v.name.replace('Joiners ', '').replace('The ', '') + ' ' + v.today.toLowerCase())
  .join('  ·  ');

/* --------------------------------------------------------------- chrome -- */

const NAV = [
  {label: 'Places',          href: 'places.html',            key: 'places'},
  {label: 'Menus',           href: 'the-joiners-arms.html#menus', key: 'arms'},
  {label: 'Stay',            href: 'the-joiners-arms.html#rooms', key: 'arms'},
  {label: 'The Engine Room', href: 'the-engine-room.html',   key: 'engine-room'},
  {label: 'Parties',         href: 'parties.html',           key: 'parties'},
  {label: 'Contact',         href: 'contact.html',           key: 'contact'},
  {label: 'Gift Shop',       href: 'gift-shop.html',         key: 'gifts'},
  {label: 'WiFi',            href: 'wifi.html',              key: 'wifi'}
];

const MENU_LINKS = [
  {label: 'Places', href: 'places.html'},
  {label: 'The Joiners Arms', href: 'the-joiners-arms.html'},
  {label: 'The Engine Room', href: 'the-engine-room.html'},
  {label: 'Gift Shop', href: 'gift-shop.html'},
  {label: 'WiFi', href: 'wifi.html'},
  {label: 'Parties', href: 'parties.html'},
  {label: 'Joiners Club', href: 'joiners-club.html'},
  {label: 'Book a table', href: 'book.html'},
  {label: 'Contact us', href: 'contact.html'}
];

function header(active) {
  return `
<header class="jo-header">
  <div class="jo-header-row">
    <a href="index.html" class="jo-brand">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" focusable="false"><path d="M1 3h9l3 4 3-4h9M1 3v20h9l3-4 3 4h9V3" fill="none" stroke="#B4763A" stroke-width="1.4"></path><path d="M10 7h6v12h-6z" fill="none" stroke="#B4763A" stroke-width="1.4"></path></svg>
      <span class="jo-brand-name">Joiners</span>
    </a>

    <div class="jo-header-actions">
      <!-- See the joints. Keyboard shortcut J. State in sessionStorage. -->
      <button type="button" class="jo-switch" id="jo-switch" title="Keyboard shortcut: J" aria-pressed="false">
        <span class="jo-switch-track"><span class="jo-switch-knob"></span></span>
        <span class="jo-switch-label">See the joints</span>
      </button>

      <div class="jo-btn-pair jo-header-ctas">
        <a href="joiners-club.html" class="jo-btn jo-btn-brass jo-btn-sm">Join the Club</a>
        <a href="book.html" class="jo-btn jo-btn-pine jo-btn-sm">Book a table</a>
      </div>

      <button type="button" class="jo-burger" id="jo-burger" aria-label="Menu" aria-expanded="false" aria-controls="jo-menu-panel">
        <span class="jo-burger-bar"></span><span class="jo-burger-bar"></span><span class="jo-burger-bar"></span>
      </button>
    </div>
  </div>

  <div class="jo-nav-bar">
    <nav class="jo-nav" aria-label="Primary">
      ${NAV.map((n) => `<a href="${n.href}" class="jo-nav-link${n.key === active ? ' is-active' : ''}">${n.label}</a>`).join('\n      ')}
      <!-- Gated: only exists when the reveal layer is on. -->
      <a href="the-joints.html" class="jo-nav-link jo-reveal-only jo-reveal-only-flex${active === 'whats-on' ? ' is-active' : ''}">The Joints</a>
    </nav>
  </div>
</header>

<div class="jo-menu-panel" id="jo-menu-panel">
  <div class="jo-menu-inner">
    ${MENU_LINKS.map((m) => `<a href="${m.href}" class="jo-menu-link">${m.label}</a>`).join('\n    ')}
    <a href="the-joints.html" class="jo-menu-link jo-reveal-only jo-reveal-only-block">The Joints</a>
  </div>
</div>

<div class="jo-tip" id="jo-tip" role="status">
  <p class="jo-tip-text">This site is built by Airship. Flip this to see how it works.</p>
  <button type="button" class="jo-tip-btn" id="jo-tip-dismiss">Got it</button>
</div>`;
}

function footer() {
  return `
<footer class="jo-footer">
  <div class="jo-container jo-section">
    <div class="jo-footer-grid">
      <div>
        <h4 class="jo-footer-head">Our places</h4>
        <div class="jo-footer-places">
          ${D.VENUES.map((v) => `<div>
            <span class="jo-footer-venue">${esc(v.name)}</span>
            <span>${esc(v.address)}</span>
            <span>${esc(v.phone)}</span>
          </div>`).join('\n          ')}
        </div>
      </div>

      <div>
        <h4 class="jo-footer-head">Site</h4>
        <div class="jo-footer-links">
          <a href="places.html" class="jo-footer-link">Places</a>
          <a href="the-joiners-arms.html#menus" class="jo-footer-link">Menus</a>
          <a href="the-joiners-arms.html#rooms" class="jo-footer-link">Stay</a>
          <a href="gift-shop.html" class="jo-footer-link">Gift Shop</a>
          <a href="the-engine-room.html" class="jo-footer-link">The Engine Room</a>
          <a href="the-joints.html" class="jo-footer-link jo-reveal-only jo-reveal-only-block" style="color:#E2A63C">The Joints</a>
          <a href="wifi.html" class="jo-footer-link">WiFi</a>
          <a href="parties.html" class="jo-footer-link">Parties</a>
          <a href="joiners-club.html" class="jo-footer-link">Joiners Club</a>
          <a href="book.html" class="jo-footer-link">Book</a>
          <a href="contact.html" class="jo-footer-link">Contact us</a>
        </div>
      </div>

      <div>
        <h4 class="jo-footer-head">Legal</h4>
        <div class="jo-footer-links">
          <a href="#" class="jo-footer-link">Privacy</a>
          <a href="#" class="jo-footer-link">Terms</a>
          <a href="#" class="jo-footer-link">Gift card terms</a>
          <a href="#" class="jo-footer-link">Accessibility</a>
        </div>
      </div>

      <div>
        <div class="jo-row-12" style="gap:10px;margin:0 0 16px">
          <h4 class="jo-footer-head" style="margin:0">Two emails a month</h4>
          ${pin(17)}
        </div>
        <p class="jo-footer-note">What is on, what is new, nothing else.</p>
        <form class="jo-footer-signup" id="jo-footer-signup">
          <label class="jo-visually-hidden" for="jo-footer-email">Email</label>
          <input type="email" id="jo-footer-email" class="jo-footer-input" placeholder="Email" autocomplete="email">
          <button type="submit" class="jo-btn jo-btn-brass jo-btn-sm">Sign up</button>
        </form>
        <p class="jo-footer-fineprint">Takes you to the Joiners Club, where you can see exactly what you get back before you finish.</p>
      </div>
    </div>

    <!-- The only permanent break in the fiction. -->
    <div class="jo-footer-strip">
      <p class="jo-footer-strip-text">Joiners is a fictional hospitality group built by Airship to show what Airship and Toggle can do for operators.</p>
      <div class="jo-lockups">
        <img src="assets/airship.png" alt="Airship" class="jo-lockup-airship">
        <img src="assets/toggle.png" alt="toggle" class="jo-lockup-toggle">
      </div>
    </div>
  </div>
</footer>

<div class="jo-bookbar">
  <a href="book.html" class="jo-bookbar-main" style="display:flex;align-items:center;justify-content:center;text-decoration:none">Book a table</a>
  <a href="joiners-club.html" class="jo-bookbar-alt" style="display:flex;align-items:center;justify-content:center;text-decoration:none">Join the Club</a>
</div>

<div class="jo-cookie" id="jo-cookie">
  <div class="jo-cookie-inner">
    <p class="jo-cookie-text">We use cookies to keep the site working and to see which pages earn their place. Nothing is shared with anyone else.</p>
    <div class="jo-btn-row">
      <button type="button" class="jo-btn jo-btn-outline jo-btn-sm" data-cookie="essential">Essential only</button>
      <button type="button" class="jo-btn jo-btn-pine jo-btn-sm" data-cookie="all">Accept</button>
    </div>
  </div>
</div>`;
}

/* The reveal layer's own chrome: the panel and Your Record.
   Identical on every page, because it persists across pages. */
function revealChrome() {
  return `
<!-- ===== Reveal layer chrome. One copy per page; state lives in sessionStorage. ===== -->
<div class="jo-panel-scrim" id="jo-panel-scrim"></div>
<aside class="jo-panel" id="jo-panel" role="dialog" aria-modal="true" aria-label="Mechanic detail" tabindex="-1">
  <div class="jo-panel-inner">
    <div class="jo-panel-top">
      <img src="assets/airship.png" alt="Airship" class="jo-panel-lockup-airship">
      <img src="assets/toggle.png" alt="toggle" class="jo-panel-lockup-toggle">
      <button type="button" class="jo-panel-close" id="jo-panel-close" aria-label="Close panel">&#10005;</button>
    </div>
    <span class="jo-panel-kicker" id="jo-panel-kicker"></span>
    <h3 class="jo-panel-title" id="jo-panel-title"></h3>
    <p class="jo-panel-what" id="jo-panel-what"></p>

    <h4 class="jo-panel-head">Data captured</h4>
    <div class="jo-panel-fields" id="jo-panel-fields"></div>

    <h4 class="jo-panel-head">What fires next</h4>
    <div class="jo-panel-journey" id="jo-panel-journey"></div>

    <div class="jo-panel-number">
      <span class="jo-panel-number-big" id="jo-panel-number"></span>
      <span class="jo-panel-number-label" id="jo-panel-number-label"></span>
      <span class="jo-panel-number-src" id="jo-panel-number-src"></span>
    </div>

    <p class="jo-panel-argument" id="jo-panel-argument"></p>
    <a href="the-engine-room.html" class="jo-panel-link">See this in the Engine Room</a>
  </div>
</aside>

<!-- Your Record. Starts collapsed so it never covers the hero. -->
<div class="jo-record" id="jo-record">
  <button type="button" class="jo-record-bar" id="jo-record-bar" aria-expanded="false" aria-controls="jo-record-body">
    <span class="jo-record-bar-title">Your record</span>
    <span class="jo-record-bar-toggle" id="jo-record-toggle">show</span>
  </button>
  <div class="jo-record-body" id="jo-record-body">
    <div id="jo-record-rows"></div>
    <p class="jo-record-foot" id="jo-record-foot">Join the Club and watch this fill in.</p>
    <button type="button" class="jo-record-reset" id="jo-record-reset">reset — delete this record</button>
  </div>
</div>`;
}

/* ----------------------------------------------------------------- page -- */

function page(o) {
  const joints = o.key === 'whats-on';
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.description || '')}">
${joints ? '<meta name="robots" content="noindex, nofollow">  <!-- Gated. A guest arriving from search must never see this page. -->\n' : ''}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:SOFT,WONK,opsz,wght@40,1,9..144,600..900&family=Inter:wght@400;500;600&family=Montserrat:wght@600&family=Manrope:wght@800&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="css/joiners.css">
<link rel="stylesheet" href="css/reveal.css">
</head>
<body class="jo-page"${o.venue ? ` data-venue="${o.venue}"` : ''} data-route="${o.key}">
${header(o.active || o.key)}

<main id="main">
${o.body}
</main>

${footer()}
${revealChrome()}

<script src="js/data.js"></script>
<script src="js/site.js"></script>
<script src="js/reveal.js"></script>
${o.scripts || ''}
</body>
</html>
`;
}

/* =========================================================== page bodies == */

/* ---- Home ---- */
const home = `
<section class="jo-hero">
  <div class="jo-hero-media">${img('jo-hero', 'Hero — warm interior at dusk, Joiners Kitchen', 'jo-img-cover')}</div>
  <div class="jo-hero-scrim"></div>
  <div class="jo-hero-inner">
    <div class="jo-hero-col">
      <h1 class="jo-hero-h1">Four places in Sheffield and the Peaks.</h1>
      <p class="jo-hero-lead">A kitchen, a pub with rooms, a coffee house and a culinary kitchen for learning and fun. (its also completely fictitious)</p>
      <div class="jo-btn-row">
        <a href="book.html" class="jo-btn jo-btn-pine-ondark">Book a table</a>
        <a href="places.html" class="jo-btn jo-btn-outline-paper">See our places</a>
        ${pin(1, {onPhoto: true})}
        ${pin(15, {onPhoto: true})}
      </div>
    </div>
  </div>
</section>

<div class="jo-hours">
  <div class="jo-hours-inner">${esc(hoursStrip)}</div>
</div>

<section class="jo-container jo-section">
  <div class="jo-section-head">
    <h2 class="jo-h2">The four places</h2>
    ${pin(2)}
  </div>
  <div class="jo-grid-ruled jo-cols-4">
    ${D.VENUES.map((v) => `<article class="jo-card">
      ${img('jo-v-' + v.slug, v.shot, 'jo-img-200')}
      <div class="jo-card-body">
        <h3 class="jo-card-title">${esc(v.name)}</h3>
        <p class="jo-card-line">${esc(v.line)}</p>
        <div class="jo-card-foot">
          <span class="jo-card-meta">${esc(v.distance)}</span>
          <span class="jo-card-hours">${esc(v.today)}</span>
          <a href="${v.slug === 'arms' ? 'the-joiners-arms.html' : v.slug === 'engine-room' ? 'the-engine-room.html' : 'places.html'}" class="jo-link" data-venue-signal="${v.slug}">Book</a>
        </div>
      </div>
    </article>`).join('\n    ')}
  </div>
</section>

<section class="jo-container jo-section-bottom">
  <div class="jo-section-head jo-section-head-tight">
    <h2 class="jo-h2">What's on</h2>
    ${pin(16)}
  </div>
  <div class="jo-gap-32 jo-cols-3">
    ${D.WHATS_ON.map((w) => `<div class="jo-wo-item">
      <span class="jo-wo-date">${esc(w.date)}</span>
      <h4 class="jo-wo-title">${esc(w.title)}</h4>
      <p class="jo-card-line" style="margin:0">${esc(w.body)}</p>
      <span class="jo-mono-price" style="font-size:14px">${esc(w.price)}</span>
    </div>`).join('\n    ')}
  </div>
</section>

<section class="jo-band-pine">
  <div class="jo-container jo-section">
    <div class="jo-row-12 jo-mb-24" style="align-items:flex-start">
      <h2 class="jo-h2 jo-on-pine-h">Join the Club.</h2>
      ${pin(3)}
      ${pin(18)}
    </div>
    <p class="jo-on-pine-p jo-mb-36">Tell us four things about you and we will stop sending you things you do not care about. A table held back for members on the first Friday of every month, your birthday remembered without you mentioning it, and first refusal on rooms at the Arms.</p>

    <div id="jo-band-success" hidden>
      <div class="jo-success">
        <h3 class="jo-success-title">Thank you, <span data-record-name>there</span>.</h3>
        <p style="font-size:16px;line-height:1.6;margin:0">Your first Club Friday is 3 October. Your birthday table is already in the diary for <span data-record-birthday>14 March</span>.</p>
      </div>
    </div>

    <div id="jo-band-form">
      <form class="jo-inline-form" data-club-form>
        <label class="jo-field">
          <span class="jo-field-label-paper">First name</span>
          <input class="jo-input-paper" name="name" placeholder="Sarah" autocomplete="given-name" required>
        </label>
        <label class="jo-field">
          <span class="jo-field-label-paper">Email</span>
          <input class="jo-input-paper" type="email" name="email" placeholder="you@example.com" autocomplete="email" required>
        </label>
        <label class="jo-field">
          <span class="jo-field-label-paper">Birthday</span>
          <input class="jo-input-paper" name="birthday" placeholder="14 March">
        </label>
        <label class="jo-field">
          <span class="jo-field-label-paper">Year</span>
          <input class="jo-input-paper" name="birthYear" placeholder="1988" inputmode="numeric">
        </label>
        <label class="jo-field">
          <span class="jo-field-label-paper">Where you go most</span>
          <select class="jo-input-paper" name="venue">
            ${D.VENUES.map((v) => `<option value="${esc(v.name)}">${esc(v.name)}</option>`).join('\n            ')}
          </select>
        </label>
        <button type="submit" class="jo-btn jo-btn-brass" style="width:100%">Join the Club</button>
      </form>
      <div class="jo-row-12 jo-mt-18">
        <p class="jo-label jo-label-paper" style="margin:0">What you get back: Something for your birthday and special day, competitions, rewards and good news from the venues you love.</p>
        ${pin(4)}
      </div>
      <p class="jo-sandbox jo-sandbox-brass jo-reveal-only jo-reveal-only-block">This is a live demonstration. Anything you enter creates a real record in a real Airship account and you will receive real emails. Delete it any time.</p>
    </div>
  </div>
</section>

<section class="jo-container jo-section">
  <div class="jo-grid-boxed jo-cols-2">
    ${img('jo-gift', 'Gift card held in a hand', 'jo-img-360')}
    <div class="jo-gift-copy">
      <div class="jo-row-12 jo-mb-16" style="align-items:flex-start">
        <h2 class="jo-h2">Gift someone a table</h2>
        ${pin(5)}
      </div>
      <div class="jo-gift-rows">
        ${D.GIFT_TILES.map((g) => `<div class="jo-gift-row">
          <span class="jo-gift-name">${esc(g.name)}</span>
          <span class="jo-gift-price">${esc(g.price)}</span>
        </div>`).join('\n        ')}
      </div>
      <a href="gift-shop.html" class="jo-btn jo-btn-brass" style="align-self:flex-start">Visit the shop</a>
    </div>
  </div>
</section>

<section class="jo-container jo-section-bottom">
  <h2 class="jo-h2 jo-section-head jo-section-head-tight">Journal</h2>
  <div class="jo-gap-32 jo-cols-3">
    ${D.JOURNAL.map((j) => `<article>
      ${img('jo-j-' + j.id, j.shot, 'jo-img-180')}
      <span class="jo-post-date" style="display:block;margin-top:14px">${esc(j.date)}</span>
      <h4 class="jo-post-title">${esc(j.title)}</h4>
    </article>`).join('\n    ')}
  </div>
</section>`;

/* ---- Places ---- */
const places = `
<section class="jo-container jo-section">
  <div class="jo-row-12 jo-mb-16" style="align-items:flex-start">
    <h1 class="jo-h1">Our four places</h1>
    ${pin(27, {lg: true})}
  </div>
  <p class="jo-lead jo-mb-48" style="max-width:60ch">Four rooms on one Sheffield street. Different rooms, same kitchen thinking.</p>
  <div class="jo-grid-boxed jo-cols-2">
    ${D.VENUES.map((v) => `<article class="jo-card">
      ${img('jo-p-' + v.slug, v.shot, 'jo-img-240')}
      <div class="jo-card-body-lg">
        <h3 class="jo-card-title-lg">${esc(v.name)}</h3>
        <p class="jo-small" style="font-size:16px;line-height:1.6;margin:0 0 18px">${esc(v.long)}</p>
        <div class="jo-card-stack">
          <span>${esc(v.address)}</span>
          <span>${esc(v.phone)}</span>
          <span class="jo-card-hours" style="font-size:13px">${esc(v.today)}</span>
        </div>
        <a href="${v.slug === 'arms' ? 'the-joiners-arms.html' : v.slug === 'engine-room' ? 'the-engine-room.html' : '#'}" class="jo-link jo-link-lg" data-venue-signal="${v.slug}">Visit this page</a>
      </div>
    </article>`).join('\n    ')}
  </div>
</section>`;

/* ---- The Joiners Arms ---- */
function menuPane(tab, items) {
  return `<div class="jo-dishes" data-menu-pane="${tab}"${tab === 'Sunday' ? '' : ' hidden'}>
    ${items.map((m, i) => `<div class="jo-dish" data-tags="${esc(m.tags || '')}">
      <button type="button" class="jo-dish-btn" data-dish="${tab}-${i}" aria-expanded="false">
        <span class="jo-dish-name">${esc(m.name)}</span>
        <span class="jo-dish-tags">${esc(m.tags || '—')}</span>
        <span class="jo-dish-price">${esc(m.price)}</span>
      </button>
      <p class="jo-dish-allergens">Allergens: ${esc(m.allergens)}</p>
    </div>`).join('\n    ')}
  </div>`;
}

const arms = `
<section class="jo-vhero">
  <div class="jo-hero-media">${img('jo-arms-hero', 'The Joiners Arms — South Street exterior in low light', 'jo-img-cover')}</div>
  <div class="jo-vhero-scrim"></div>
  <div class="jo-vhero-inner"><h1 class="jo-vhero-h1">The Joiners Arms</h1></div>
</section>

<!-- Rule 3: address, hours, phone and both actions are visible without scrolling. -->
<div class="jo-infocard-wrap">
  <div class="jo-infocard">
    <div class="jo-infocard-col">
      <span>16 South Street, Sheffield, S2 5QX</span>
      <span class="jo-infocard-hours">Open today until 11pm · Kitchen 12–9pm</span>
      <a href="tel:01142996477" class="jo-infocard-tel">0114 299 6477</a>
    </div>
    <div class="jo-infocard-actions">
      <div class="jo-btn-row">
        <a href="book.html" class="jo-btn jo-btn-pine">Book a table</a>
        <a href="#rooms" class="jo-btn jo-btn-outline">Check rooms</a>
      </div>
      <div class="jo-chip-row">
        ${D.ARMS_CHIPS.map((c) => `<span class="jo-chip">${esc(c)}</span>`).join('\n        ')}
      </div>
    </div>
  </div>
</div>

<section class="jo-container jo-section-top">
  <p class="jo-lead-wide">A corner pub on South Street with nine rooms upstairs and a fire that is lit from October. People come in off the hill wet, dogs come in muddy, and both are fine. Sunday lunch runs from noon until it goes, which on a good week is about half three. If you are staying, breakfast is at the long table and there is a boot room by the back door.</p>
</section>

<section class="jo-container jo-section" id="menus">
  <div class="jo-section-head jo-section-head-tight">
    <h2 class="jo-h2">Menus</h2>
    ${pin(6)}
  </div>

  <div class="jo-tabs" role="tablist">
    ${Object.keys(D.MENUS).map((t) => `<button type="button" class="jo-tab${t === 'Sunday' ? ' is-active' : ''}" data-menu-tab="${t}" role="tab" aria-selected="${t === 'Sunday'}">${t}</button>`).join('\n    ')}
  </div>

  <div class="jo-filter-row">
    <span class="jo-label">Filter</span>
    ${D.DIETS.map((d) => `<button type="button" class="jo-filter jo-filter-diet" data-diet="${d.key}" aria-pressed="false">${esc(d.label)}</button>`).join('\n    ')}
  </div>
  <p class="jo-mono-note jo-mb-24">${esc(D.MENU_UPDATED)} · Filters dim what does not match. Nothing is hidden. Tap a dish for allergens.</p>

  ${Object.keys(D.MENUS).map((t) => menuPane(t, D.MENUS[t])).join('\n  ')}
</section>

<section class="jo-container jo-section-bottom" id="rooms">
  <div class="jo-section-head jo-section-head-tight">
    <h2 class="jo-h2">Rooms</h2>
    <div class="jo-row-12" style="gap:10px">${pin(7)}${pin(25)}</div>
  </div>
  <p class="jo-body jo-mb-24" style="color:var(--jo-ink-72)">Nine rooms. Rates include breakfast at the long table. Dogs £15 a stay.</p>
  <div class="jo-grid-boxed jo-cols-3">
    ${D.ROOMS.map((r) => `<article class="jo-card">
      ${img('jo-r-' + r.id, r.shot, 'jo-img-180')}
      <div class="jo-card-body" style="padding:22px">
        <h4 class="jo-h4" style="font-size:20px;margin:0 0 6px">${esc(r.name)}</h4>
        <p class="jo-card-line" style="font-size:14px;margin:0 0 14px">${esc(r.line)}</p>
        <p class="jo-mono-price" style="font-size:15px;margin:0 0 14px">${esc(r.price)}</p>
        <a href="#" class="jo-link">Check availability</a>
      </div>
    </article>`).join('\n    ')}
  </div>
</section>

<section class="jo-band-paper">
  <div class="jo-container jo-section jo-gap-48 jo-cols-2">
    <div>
      <h2 class="jo-h2 jo-mb-24">Find us</h2>
      ${img('jo-arms-map', 'Map — South Street, Sheffield', 'jo-img-260')}
    </div>
    <div class="jo-stack-16" style="gap:22px">
      <div>
        <h4 class="jo-subhead">By car</h4>
        <p class="jo-body" style="color:rgba(27,24,21,0.75)">Ten minutes from the Parkway and five from the ring road. Free parking for sixteen cars behind the pub, two of them accessible bays next to the side door.</p>
      </div>
      <div>
        <h4 class="jo-subhead">By train and tram</h4>
        <p class="jo-body" style="color:rgba(27,24,21,0.75)">Sheffield station is an eight minute walk, up South Street and left at the top. The Sheffield Station tram stop is closer still, two minutes from the door.</p>
      </div>
      <div>
        <!-- Access is written properly, in prose, not reduced to an icon. -->
        <h4 class="jo-subhead">Access</h4>
        <p class="jo-body" style="color:rgba(27,24,21,0.75)">Step-free entry through the side door on the car park, level throughout the bar and dining room. Accessible WC on the ground floor. The nine bedrooms are upstairs and there is no lift, so we cannot offer a step-free room. Assistance dogs and any other dog are welcome everywhere except the bedrooms marked in the room notes. Large print menus behind the bar.</p>
      </div>
    </div>
  </div>
</section>

<section class="jo-container jo-section">
  <div class="jo-section-head jo-section-head-tight" style="border-bottom:0;padding-bottom:0">
    <h2 class="jo-h3">Also ours</h2>
    <div class="jo-row-12" style="gap:10px">${pin(8)}${pin(26)}</div>
  </div>
  <div class="jo-gap-24 jo-cols-3">
    ${D.VENUES.filter((v) => v.slug !== 'arms').map((v) => `<a href="${v.slug === 'engine-room' ? 'the-engine-room.html' : 'places.html'}" class="jo-xsell" data-venue-signal="${v.slug}">
      ${img('jo-x-' + v.slug, ' ', 'jo-img-thumb')}
      <span>
        <span class="jo-xsell-name">${esc(v.name)}</span>
        <span class="jo-xsell-meta">${esc(v.distance)}</span>
      </span>
    </a>`).join('\n    ')}
  </div>
</section>`;

/* ---- The Engine Room ---- */
const engineRoom = `
<section class="jo-vhero">
  <div class="jo-hero-media">${img('jo-er-hero', 'The Engine Room — the long bench mid-class', 'jo-img-cover')}</div>
  <div class="jo-vhero-scrim"></div>
  <div class="jo-vhero-inner"><h1 class="jo-vhero-h1">The Engine Room</h1></div>
</section>

<div class="jo-infocard-wrap">
  <div class="jo-infocard">
    <div class="jo-infocard-col">
      <span>16 South Street, Sheffield, S2 5QX</span>
      <span class="jo-infocard-hours">Classes and events by arrangement · see the diary below</span>
      <a href="tel:01142996477" class="jo-infocard-tel">0114 299 6477</a>
    </div>
    <div class="jo-infocard-actions">
      <div class="jo-btn-row">
        <a href="parties.html" class="jo-btn jo-btn-pine">Enquire about private hire</a>
        <a href="gift-shop.html" class="jo-btn jo-btn-outline">Gift a class</a>
      </div>
      <div class="jo-chip-row">
        ${D.ENGINE_CHIPS.map((c) => `<span class="jo-chip">${esc(c)}</span>`).join('\n        ')}
      </div>
    </div>
  </div>
</div>

<section class="jo-container jo-section-top">
  <p class="jo-lead-wide">One room, one long bench and the same kitchen that runs downstairs. Classes are hands-on and small, eight to twelve of you, and you eat what you made at the end. Supper clubs are one sitting, one menu, no choices to make. The rest of the week the room is yours: twelve to sixty covers, and we write the menu with you rather than handing you a folder.</p>
</section>

<section class="jo-container jo-section">
  <div class="jo-section-head jo-section-head-tight" style="margin-bottom:24px">
    <h2 class="jo-h2">Classes and supper clubs</h2>
    ${pin(30)}
  </div>

  <div class="jo-filter-row">
    ${D.DIARY_TYPES.map((t) => `<button type="button" class="jo-filter${t === 'Everything' ? ' is-on' : ''}" data-diary-type="${esc(t)}" aria-pressed="${t === 'Everything'}">${esc(t)}</button>`).join('\n    ')}
  </div>
  <p class="jo-mono-note jo-mb-24"><span id="jo-diary-count">${D.DIARY.length} of ${D.DIARY.length} dates</span> · dates through to the end of October, more added monthly</p>

  <div class="jo-diary" id="jo-diary">
    ${D.DIARY.map((d) => `<div class="jo-diary-row" data-diary-row="${esc(d.type)}">
      <div class="jo-diary-when">
        <span class="jo-diary-date">${esc(d.date)}</span>
        <span class="jo-diary-time">${esc(d.time)}</span>
      </div>
      <div>
        <span class="jo-diary-type">${esc(d.type)}</span>
        <h4 class="jo-diary-title">${esc(d.title)}</h4>
        <p class="jo-diary-note">${esc(d.note)}</p>
      </div>
      <div class="jo-diary-side">
        <span class="jo-mono-price">${esc(d.price)}</span>
        <span class="jo-diary-status">${esc(d.status)}</span>
        <a href="gift-shop.html" class="jo-link">Book a place</a>
      </div>
    </div>`).join('\n    ')}
  </div>

  <p class="jo-body jo-mt-28" style="color:var(--jo-ink-72);max-width:60ch">Members of the Joiners Club hear about new dates a week before they go on general sale. <a href="joiners-club.html">Join the Club</a>.</p>
</section>

<section class="jo-container jo-section-bottom">
  <h2 class="jo-h3 jo-mb-28">Also ours</h2>
  <div class="jo-gap-24 jo-cols-3">
    ${D.VENUES.filter((v) => v.slug !== 'engine-room').map((v) => `<a href="${v.slug === 'arms' ? 'the-joiners-arms.html' : 'places.html'}" class="jo-xsell" data-venue-signal="${v.slug}">
      ${img('jo-eo-' + v.slug, ' ', 'jo-img-thumb')}
      <span>
        <span class="jo-xsell-name">${esc(v.name)}</span>
        <span class="jo-xsell-meta">${esc(v.distance)}</span>
      </span>
    </a>`).join('\n    ')}
  </div>
</section>`;

/* ---- Joiners Club ---- */
const club = `
<section class="jo-band-pine">
  <div class="jo-container jo-section">
    <h1 class="jo-h1 jo-on-pine-h jo-mb-24">The Joiners Club.</h1>
    <p class="jo-on-pine-lead">A club with no card, no points and no app. Just a table when you want one and less noise the rest of the time.</p>
  </div>
</section>

<section class="jo-container jo-section">
  <div class="jo-section-head" style="margin-bottom:0">
    <h2 class="jo-h2">The seven things we ask</h2>
    <div class="jo-row-12" style="gap:10px">${pin(9)}${pin(19)}</div>
  </div>
  <div class="jo-asks">
    ${D.ASKS.map((a) => `<div class="jo-ask">
      <h3 class="jo-ask-field">${esc(a.field)}</h3>
      <p class="jo-ask-gets">${esc(a.gets)}</p>
    </div>`).join('\n    ')}
  </div>
  <div class="jo-join-cta">
    <a href="#joiners-club-form" class="jo-btn jo-btn-brass jo-btn-lg" data-scroll-to="joiners-club-form">Join the Joiners Club</a>
    <p class="jo-join-cta-note">Seven fields, under a minute. No card, no points, no app.</p>
    ${pin(13, {lg: true})}
  </div>
</section>

<section class="jo-container jo-section-bottom">
  <div class="jo-valuebox">
    <div class="jo-row-12">
      <span class="jo-label jo-label-oak">What joining gets you, year one</span>
      ${pin(20)}
    </div>
    <h3 class="jo-h3" style="margin:14px 0 16px">Joining is rewarded, then it keeps being rewarded</h3>
    <p class="jo-lead-wide jo-mb-36" style="font-size:18px;color:rgba(27,24,21,0.78)">Something on us the day you join, your birthday and your anniversary remembered, and a draw every month you are entered into by being a member. The rest is based on how often you actually come in, not on collecting points.</p>
    <div class="jo-vx">
      ${D.VX_STEPS.map((v) => `<div class="jo-vx-step">
        <span class="jo-vx-when">${esc(v.when)}</span>
        <p class="jo-vx-what">${esc(v.what)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="jo-band-paper" id="joiners-club-form">
  <div class="jo-container-narrow jo-section">
    <!-- Success is not a modal. The section transforms. -->
    <div id="jo-club-success" hidden>
      <div style="animation:joRise 300ms ease-out">
        <div class="jo-row-12" style="align-items:flex-start">
          <h2 class="jo-h2 jo-mb-16">Thank you, <span data-record-name>there</span>.</h2>
          ${pin(10)}${pin(21)}${pin(22)}
        </div>
        <p class="jo-lead" style="font-size:20px;color:var(--jo-ink);max-width:none;margin:0 0 28px">Your first Club Friday is 3 October. Your birthday table is already in the diary for <span data-record-birthday>14 March</span>.</p>
        <button type="button" class="jo-btn jo-btn-outline jo-btn-sm" id="jo-club-restart">Start again</button>
      </div>
    </div>

    <div id="jo-club-formwrap">
      <h2 class="jo-h2 jo-mb-28">Join the Club</h2>
      <form class="jo-field-stack" data-club-form>
        <label class="jo-field">
          <span class="jo-field-label">First name</span>
          <input class="jo-input" name="name" placeholder="Sarah" autocomplete="given-name" required>
        </label>
        <label class="jo-field">
          <span class="jo-field-label">Email</span>
          <input class="jo-input" type="email" name="email" placeholder="you@example.com" autocomplete="email" required>
        </label>
        <label class="jo-field">
          <span class="jo-field-label">Mobile</span>
          <input class="jo-input" type="tel" name="mobile" placeholder="07700 900000" autocomplete="tel">
        </label>
        <div class="jo-field-pair">
          <label class="jo-field">
            <span class="jo-field-label">Birthday</span>
            <input class="jo-input" name="birthday" placeholder="14 March">
          </label>
          <label class="jo-field">
            <span class="jo-field-label">Year</span>
            <input class="jo-input" name="birthYear" placeholder="1988" inputmode="numeric">
          </label>
        </div>
        <div class="jo-field-pair">
          <label class="jo-field">
            <span class="jo-field-label">Anniversary</span>
            <input class="jo-input" name="anniversary" placeholder="2 October">
          </label>
          <label class="jo-field">
            <span class="jo-field-label">Year</span>
            <input class="jo-input" name="anniversaryYear" placeholder="2016" inputmode="numeric">
          </label>
        </div>
        <label class="jo-field">
          <span class="jo-field-label">Postcode</span>
          <input class="jo-input" name="postcode" placeholder="S2 5QX" autocomplete="postal-code">
        </label>
        <label class="jo-field">
          <span class="jo-field-label">Where you go most</span>
          <select class="jo-select" name="venue">
            ${D.VENUES.map((v) => `<option value="${esc(v.name)}">${esc(v.name)}</option>`).join('\n            ')}
          </select>
        </label>
        <button type="submit" class="jo-btn jo-btn-pine" style="align-self:flex-start;padding:17px 28px;font-size:16px;min-height:52px">Join the Club</button>
      </form>
      <p class="jo-sandbox jo-reveal-only jo-reveal-only-block">This is a live demonstration. Anything you enter creates a real record in a real Airship account and you will receive real emails. Delete it any time.</p>
    </div>
  </div>
</section>

<section class="jo-container jo-section">
  <div class="jo-section-head">
    <h2 class="jo-h2">A member's year</h2>
    <div class="jo-row-12" style="gap:10px">${pin(11)}${pin(12)}${pin(23)}</div>
  </div>
  <div class="jo-grid-boxed jo-months">
    ${D.MONTHS.map((m) => `<div class="jo-month${m.mark ? ' is-marked' : ''}">
      <span class="jo-month-label">${esc(m.label)}</span>
      <span class="jo-month-event">${esc(m.event)}</span>
    </div>`).join('\n    ')}
  </div>
</section>

<section class="jo-container jo-section-bottom">
  <div class="jo-band-brass">
    <div style="max-width:52ch">
      <h2 class="jo-h3" style="margin:0 0 10px">Bring someone new</h2>
      <p style="font-size:17px;line-height:1.55;margin:0">Give a friend £10 to spend with us. When they use it, you get £10 too.</p>
    </div>
    <div class="jo-row-12" style="gap:14px;flex-shrink:0">
      <button type="button" class="jo-btn jo-btn-ink">How it works</button>
      ${pin(24)}
    </div>
  </div>
</section>

<!-- Reveal only. -->
<section class="jo-band-ink jo-reveal-only jo-reveal-only-block">
  <div class="jo-container jo-section">
    <span class="jo-segments-kicker">Airship · reveal layer</span>
    <h2 class="jo-segments-h2">Segments, made visible</h2>
    <p class="jo-segments-lead">Fourteen segments built from the data this site already collects. Counts are illustrative and listed with their basis on the numbers page.</p>
    <div class="jo-segments-grid">
      ${D.SEGMENTS.map((s) => `<div class="jo-segment">
        <h4 class="jo-segment-name">${esc(s.name)}</h4>
        <p class="jo-segment-def">${esc(s.def)}</p>
        <span class="jo-segment-count">${esc(s.count)}</span>
        <span class="jo-segment-basis">contacts · illustrative</span>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>`;

/* ---- Contact ---- */
const contact = `
<section class="jo-container jo-section">
  <h1 class="jo-h1 jo-mb-16">Contact us</h1>
  <p class="jo-lead jo-mb-48">One street, four places, one phone number. If it is urgent, ring. If it is a booking, book. Everything else, the form below reaches a named person.</p>

  <div class="jo-grid-boxed jo-cols-2" style="margin-bottom:var(--jo-section-pad)">
    <div style="background:var(--jo-paper);padding:32px">
      <h2 class="jo-h3 jo-mb-24">Ring or walk in</h2>
      <div class="jo-contact-stack">
        <a href="tel:01142996477" class="jo-contact-tel">0114 299 6477</a>
        <span>16 South Street, Sheffield, S2 5QX</span>
        <a href="mailto:hello@joiners.example" style="color:var(--jo-oak);text-decoration:none">hello@joiners.example</a>
      </div>
      <div class="jo-contact-hours">
        ${D.VENUES.map((v) => `<div class="jo-contact-hours-row">
          <span style="font-size:15px;font-weight:500">${esc(v.name)}</span>
          <span class="jo-card-hours">${esc(v.today)}</span>
        </div>`).join('\n        ')}
      </div>
    </div>
    ${img('jo-contact-map', 'Map — 16 South Street, Sheffield', 'jo-img-320')}
  </div>

  <div class="jo-cols-2" style="display:grid;gap:var(--jo-section-pad)">
    <div>
      <div class="jo-section-head jo-section-head-tight">
        <h2 class="jo-h3">Send us something</h2>
        ${pin(34)}
      </div>
      <!-- Real Airship form. In Webflow this is an HTML Embed; the script tag
           can live in the page footer. It writes straight to the contact record. -->
      <div data-airship-form-url="https://forms.airship.co.uk/forms/6755399444000000/contact-us" style="min-height:200px"></div>
      <p class="jo-small jo-mt-18" style="color:rgba(27,24,21,0.7)">This form is a real Airship form. It writes straight to the contact record.</p>
    </div>

    <div>
      <h2 class="jo-h3 jo-section-head jo-section-head-tight" style="margin-bottom:0">Straight to the right place</h2>
      <div>
        ${D.CONTACT_ROUTES.map((r) => `<div class="jo-route">
          <h4 class="jo-route-title">${esc(r.title)}</h4>
          <p class="jo-route-body">${esc(r.body)}</p>
          <a href="${r.href}" class="jo-link">${esc(r.cta)}</a>
        </div>`).join('\n        ')}
      </div>
      <div class="jo-note-box">
        <h4 class="jo-subhead" style="margin:0 0 10px">Access and dietary</h4>
        <p class="jo-body" style="font-size:15px;color:rgba(27,24,21,0.78)">Step-free entry through the side door on the car park, level throughout the bar and dining room, accessible WC on the ground floor. Tell us at the point of booking what you need and it will be on the table note, not in somebody's head.</p>
      </div>
    </div>
  </div>
</section>`;

/* ---- WiFi ---- */
const wifi = `
<section class="jo-container jo-section jo-splash-wrap">
  <div class="jo-splash">
    <div class="jo-splash-card">

      <div id="jo-wifi-form">
        <span class="jo-label jo-label-oak">You are at</span>
        <!-- Venue detected at the point of connection. -->
        <h1 class="jo-splash-h1">Joiners Coffee House</h1>
        <form id="jo-wifi-formel">
          <label class="jo-field jo-mb-16">
            <span class="jo-field-label">Email</span>
            <input class="jo-input" type="email" name="wifiEmail" placeholder="you@example.com" autocomplete="email" required>
          </label>
          <button type="submit" class="jo-btn jo-btn-pine jo-btn-block">Connect</button>
          <div class="jo-field-pair-sm jo-mt-18">
            <label class="jo-field">
              <span class="jo-field-label">Birthday (optional)</span>
              <input class="jo-input" name="wifiDob" placeholder="14 March">
            </label>
            <label class="jo-field">
              <span class="jo-field-label">Year</span>
              <input class="jo-input" name="wifiDobYear" placeholder="1988" inputmode="numeric">
            </label>
          </div>
          <p class="jo-small" style="font-size:14px;margin:8px 0 0">We will send you something on the day. Skip it and the WiFi works the same.</p>
          <p class="jo-small" style="font-size:15px;color:rgba(27,24,21,0.78);margin:22px 0 0">We will send you nothing unless you tick a box. Connecting gets you two hours of WiFi either way.</p>
          <!-- Two separate opt-ins. Never one bundled tick. -->
          <div class="jo-stack-10" style="gap:0;margin-top:12px">
            <button type="button" class="jo-check" data-check="wifiOptIn" aria-pressed="false">
              <span class="jo-check-box" aria-hidden="true"></span>
              <span class="jo-check-text">News and offers by email. Two a month, nothing else.</span>
            </button>
            <button type="button" class="jo-check" data-check="wifiSms" aria-pressed="false">
              <span class="jo-check-box" aria-hidden="true"></span>
              <span class="jo-check-text">News and offers by text. Only if something is worth a text.</span>
            </button>
          </div>
        </form>
        <div class="jo-reveal-only jo-reveal-only-flex jo-row-12" style="border-top:1px solid var(--jo-stone);margin-top:22px;padding-top:18px">
          ${pin(31)}${pin(32)}
          <p class="jo-sandbox" style="margin:0;font-size:11px;flex-grow:1;min-width:0">Live demonstration. Anything entered creates a real record. Delete it any time.</p>
        </div>
      </div>

      <div id="jo-wifi-online" hidden>
        <div style="animation:joRise 300ms ease-out">
          <span class="jo-label jo-label-oak">Two hours, no password</span>
          <h1 class="jo-splash-h1" style="margin-bottom:14px">You are online.</h1>
          <p class="jo-body jo-mb-28" style="color:rgba(27,24,21,0.78)">Here is what is good today.</p>
          <!-- One well-chosen recommendation, not a wall of marketing. -->
          <div class="jo-rec-block">
            <span class="jo-wo-date">Out of the oven at eleven</span>
            <h3 class="jo-h4" style="font-size:22px;margin:8px 0 6px">Cardamom bun</h3>
            <p class="jo-card-line" style="margin:0 0 10px">Thirty of them, and they go by one.</p>
            <span class="jo-mono-price" style="font-size:15px">£3.80</span>
          </div>
          <button type="button" class="jo-btn jo-btn-outline jo-btn-sm" id="jo-wifi-restart">Start again</button>
          <div class="jo-reveal-only jo-reveal-only-flex jo-row-12" style="border-top:1px solid var(--jo-stone);margin-top:22px;padding-top:18px">
            ${pin(31)}${pin(32)}
            <p class="jo-sandbox" style="margin:0;font-size:11px;flex-grow:1;min-width:0">Presence appended to the record. Marketing only if the box was ticked.</p>
          </div>
        </div>
      </div>

    </div>
    <p class="jo-splash-foot">Free WiFi at all four places. Two hours, no password, no scrolling through terms.</p>
  </div>
</section>`;

/* ---- Structural shells ---- */
const gifts = `
<section class="jo-container jo-section">
  <div class="jo-row-12 jo-mb-16" style="align-items:flex-start">
    <h1 class="jo-h1">Gift someone a table</h1>
    ${pin(29, {lg: true})}
  </div>
  <p class="jo-lead jo-mb-40">Gift cards for any amount, experiences with a date and a story, and tickets to things that sell out. Digital or physical, delivered now or on Christmas Eve.</p>
  <div class="jo-shell-note">
    <p class="jo-shell-note-text">The full Toggle shop — product grid, cart, three-step checkout, Apple Wallet, and pins 17 and 18 on the two records one transaction creates — is the next build.</p>
  </div>
</section>`;

const parties = `
<section class="jo-container jo-section">
  <div class="jo-row-12 jo-mb-16" style="align-items:flex-start">
    <h1 class="jo-h1">Parties</h1>
    ${pin(14, {lg: true})}
    ${pin(28, {lg: true})}
  </div>
  <p class="jo-lead jo-mb-40">Twelve to sixty covers at The Kitchen, party menus at Joiners Kitchen, Christmas Day at the Arms. Tell us the numbers and we will come back with a plan and a price.</p>
  <div class="jo-shell-note">
    <p class="jo-shell-note-text">The party enquiry form, deposit terms and the Christmas build are in the next phase, alongside the gift shop, corporate bulk ordering, WiFi, booking, feedback and the Engine Room.</p>
  </div>
</section>`;

const book = `
<section class="jo-container-narrow jo-section">
  <h1 class="jo-h1 jo-mb-16">Book a table</h1>
  <p class="jo-lead jo-mb-36" style="font-size:19px;max-width:52ch">Pick a place, a day and a time. Four taps, no dropdown gymnastics.</p>
  <div class="jo-shell-note">
    <p class="jo-shell-note-text">The booking flow, the WiFi page, feedback, the gift shop, corporate bulk ordering, Christmas and the Engine Room are the next build. Say the word and I will carry on in that order.</p>
  </div>
</section>`;

/* ---- The Joints (reveal only, gated) ---- */
const joints = `
<section class="jo-container jo-section">
  <div class="jo-joints-box">
    <div class="jo-joints-strip">
      <span class="jo-joints-strip-label">The Joints · operator view, not guest-facing</span>
      ${pin(33)}
    </div>

    <div class="jo-joints-tabs" role="tablist">
      <button type="button" class="jo-joints-tab is-active" data-joints-tab="whats-on" role="tab" aria-selected="true">
        <span class="jo-joints-tab-label">National What's On</span>
        <span class="jo-joints-tab-note">521 dates · Sep 2026 – Dec 2027</span>
      </button>
      <button type="button" class="jo-joints-tab" data-joints-tab="foodie" role="tab" aria-selected="false">
        <span class="jo-joints-tab-label">Foodie Favourites</span>
        <span class="jo-joints-tab-note">awaiting content</span>
      </button>
      <button type="button" class="jo-joints-tab" data-joints-tab="cheers" role="tab" aria-selected="false">
        <span class="jo-joints-tab-label">Cheers by Airship</span>
        <span class="jo-joints-tab-note">awaiting content</span>
      </button>
    </div>

    <div class="jo-joints-body">

      <div class="jo-joints-pane is-active" data-joints-pane="whats-on">
        <h1 class="jo-h2 jo-mb-16">National What's On</h1>
        <p class="jo-lead jo-mb-36" style="font-size:19px;max-width:62ch">Every date between now and the end of 2027 that moves hospitality trade: bank holidays, national days, sport, festivals, school holidays, city events, game and produce seasons, and the trade dates that hit cost rather than revenue. Search it, filter it, plan against it.</p>

        <div class="jo-wo-filters">
          <label class="jo-field" style="margin-bottom:18px">
            <span class="jo-field-label">Search</span>
            <input class="jo-wo-input" id="jo-wo-q" placeholder="Sheffield, Valentine's, grouse, Ashes">
          </label>

          <div class="jo-filter-row" style="margin-bottom:18px">
            <span class="jo-label" style="margin-right:4px">Impact</span>
            <button type="button" class="jo-filter is-on" data-impact="Any">Any</button>
            <button type="button" class="jo-filter" data-impact="Critical">Critical</button>
            <button type="button" class="jo-filter" data-impact="High">High</button>
            <button type="button" class="jo-filter" data-impact="Medium">Medium</button>
            <button type="button" class="jo-filter" data-impact="Low">Low</button>
          </div>

          <div class="jo-wo-selects">
            <label class="jo-field">
              <span class="jo-field-label">Category</span>
              <select class="jo-wo-select" id="jo-wo-category"><option>Any</option></select>
            </label>
            <label class="jo-field">
              <span class="jo-field-label">Where</span>
              <select class="jo-wo-select" id="jo-wo-scope"><option>Any</option></select>
            </label>
            <label class="jo-field">
              <span class="jo-field-label">Month</span>
              <select class="jo-wo-select" id="jo-wo-month"><option>Any</option></select>
            </label>
          </div>

          <div class="jo-wo-count-row">
            <span class="jo-wo-count" id="jo-wo-count">loading the diary</span>
            <button type="button" class="jo-wo-clear" id="jo-wo-clear">Clear all</button>
          </div>
        </div>

        <div class="jo-wo-list" id="jo-wo-list"></div>
        <button type="button" class="jo-btn jo-btn-ink jo-wo-more" id="jo-wo-more" hidden>Show 40 more</button>

        <p class="jo-wo-foot">Fixed dates cannot move. Confirmed dates are announced by the organiser. Typical (verify) dates follow the established pattern and should be confirmed before you buy media or print anything.</p>
      </div>

      <div class="jo-joints-pane" data-joints-pane="foodie">
        <h1 class="jo-h2 jo-mb-16">Foodie Favourites</h1>
        <p class="jo-lead jo-mb-36" style="font-size:19px;max-width:62ch">The dishes, producers and menu moments worth building a campaign around.</p>
        <div class="jo-joints-placeholder">
          <p class="jo-joints-placeholder-text">Waiting on content. Send it in whatever shape it is in — a spreadsheet, a list, a document — and I will build this out to match, filterable and searchable the same way the national diary is.</p>
        </div>
      </div>

      <div class="jo-joints-pane" data-joints-pane="cheers">
        <h1 class="jo-h2 jo-mb-16">Cheers by Airship</h1>
        <p class="jo-lead jo-mb-36" style="font-size:19px;max-width:62ch">The drinks side of the calendar and the campaigns that run off it.</p>
        <div class="jo-joints-placeholder">
          <p class="jo-joints-placeholder-text">Waiting on content. Same as above — send it through and I will structure it to sit alongside the other two.</p>
        </div>
      </div>

    </div>
  </div>
</section>`;

/* ============================================================== write ==== */

const PAGES = [
  {file: 'index.html', key: 'home', title: 'Joiners — four places in Sheffield and the Peaks', description: 'A kitchen, a pub with rooms, a coffee house and a culinary kitchen for learning and fun.', body: home},
  {file: 'places.html', key: 'places', title: 'Our four places — Joiners', description: 'Four rooms on one Sheffield street. Different rooms, same kitchen thinking.', body: places},
  {file: 'the-joiners-arms.html', key: 'arms', venue: 'arms', title: 'The Joiners Arms — Joiners', description: 'A corner pub on South Street with nine rooms upstairs. Menus, rooms and how to find us.', body: arms},
  {file: 'the-engine-room.html', key: 'engine-room', venue: 'engine-room', title: 'The Engine Room — Joiners', description: 'Cookery classes, supper clubs and private dining, twelve to sixty covers.', body: engineRoom},
  {file: 'joiners-club.html', key: 'table', active: '', title: 'The Joiners Club — Joiners', description: 'A club with no card, no points and no app. Seven fields, under a minute.', body: club},
  {file: 'contact.html', key: 'contact', title: 'Contact us — Joiners', description: 'One street, four places, one phone number.', body: contact,
   scripts: '<!-- The Airship forms embed. In Webflow this can live in the page footer. -->\n<script src="https://forms.airship.co.uk/assets/js/embed.js" async></script>'},
  {file: 'wifi.html', key: 'wifi', title: 'WiFi — Joiners', description: 'Free WiFi at all four places. Two hours, no password.', body: wifi},
  {file: 'gift-shop.html', key: 'gifts', title: 'Gift Shop — Joiners', description: 'Gift cards, experiences and tickets. Digital or physical.', body: gifts},
  {file: 'parties.html', key: 'parties', title: 'Parties — Joiners', description: 'Twelve to sixty covers. Tell us the numbers and we will come back with a plan and a price.', body: parties},
  {file: 'book.html', key: 'book', title: 'Book a table — Joiners', description: 'Pick a place, a day and a time.', body: book},
  {file: 'the-joints.html', key: 'whats-on', title: 'The Joints — operator view', description: 'Operator view. Not guest-facing.', body: joints,
   scripts: '<script src="js/joints.js"></script>'}
];

PAGES.forEach((p) => {
  fs.writeFileSync(path.join(ROOT, p.file), page(p), 'utf8');
  process.stdout.write('wrote ' + p.file + '\n');
});
