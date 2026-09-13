/* ==========================================================================
   Joiners — guest layer behaviour
   --------------------------------------------------------------------------
   Everything a guest can do without the reveal layer: the mobile menu, the
   menu tabs and dietary filters, the Engine Room diary filter, the WiFi
   splash, the Joiners Club form and its success state, the footer signup
   hand-off, and the cookie sheet.

   It also keeps the visitor record (JO.rec). That happens whether or not the
   reveal layer is on — otherwise flipping the switch halfway through a visit
   would show an empty record — but nothing is *drawn* unless reveal.js is
   running and the switch is on.

   In Webflow: paste into Site Settings → Custom Code → Footer, or host it.
   ========================================================================== */
(function (w, d) {
  'use strict';

  var JO = w.JO || (w.JO = {});

  /* ------------------------------------------------------------- storage -- */

  var REC_KEY = 'joiners-record';
  var EMPTY = {
    pages: [], seconds: 0, venueViews: {}, interests: [],
    name: null, email: null, mobile: null, birthday: null,
    anniversary: null, postcode: null, venue: null, joined: false
  };

  function load() {
    try {
      var raw = sessionStorage.getItem(REC_KEY);
      if (raw) return Object.assign({}, EMPTY, JSON.parse(raw));
    } catch (e) {}
    return Object.assign({}, EMPTY);
  }
  function save() {
    try { sessionStorage.setItem(REC_KEY, JSON.stringify(JO.rec)); } catch (e) {}
  }

  JO.rec = load();

  /* Anything that changes the record fires this, so the reveal layer can
     redraw without the guest layer knowing the reveal layer exists. */
  JO.recordChanged = function () {
    save();
    d.dispatchEvent(new CustomEvent('jo:record'));
  };

  JO.noteInterest = function (label) {
    if (!label) return;
    if (JO.rec.interests.indexOf(label) === -1) {
      JO.rec.interests.push(label);
      JO.recordChanged();
    }
  };

  JO.noteVenue = function (slug) {
    if (!slug) return;
    JO.rec.venueViews[slug] = (JO.rec.venueViews[slug] || 0) + 1;
    JO.recordChanged();
  };

  /* ------------------------------------------------------ proof of presence */

  var route = d.body.getAttribute('data-route') || 'home';
  if (JO.rec.pages.indexOf(route) === -1) JO.rec.pages.push(route);
  JO.noteVenue(d.body.getAttribute('data-venue'));
  JO.recordChanged();

  /* Dwell ticks whether or not anyone is looking. */
  setInterval(function () {
    JO.rec.seconds += 1;
    save();
    d.dispatchEvent(new CustomEvent('jo:tick'));
  }, 1000);

  /* --------------------------------------------------------------- helpers */

  function $(sel, root) { return (root || d).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }

  function on(sel, evt, fn) {
    d.addEventListener(evt, function (e) {
      var t = e.target.closest ? e.target.closest(sel) : null;
      if (t) fn(e, t);
    });
  }

  function scrollToEl(el) {
    if (!el) return;
    w.scrollTo({top: el.getBoundingClientRect().top + w.scrollY - 96, behavior: 'smooth'});
  }

  /* ------------------------------------------------------------ the header */

  var burger = $('#jo-burger');
  var menuPanel = $('#jo-menu-panel');
  if (burger && menuPanel) {
    burger.addEventListener('click', function () {
      var open = menuPanel.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    /* Closes on selection. */
    $$('.jo-menu-link', menuPanel).forEach(function (a) {
      a.addEventListener('click', function () { menuPanel.classList.remove('is-open'); });
    });
  }

  /* Venue signal on any link that carries one. */
  on('[data-venue-signal]', 'click', function (e, el) {
    JO.noteVenue(el.getAttribute('data-venue-signal'));
  });

  /* Anchor buttons that scroll rather than jump. */
  on('[data-scroll-to]', 'click', function (e, el) {
    e.preventDefault();
    scrollToEl(d.getElementById(el.getAttribute('data-scroll-to')));
  });

  /* ------------------------------------------------------ menus and diets -- */

  var dietState = [];

  function applyDiets() {
    var pane = $('.jo-dishes:not([hidden])');
    if (!pane) return;
    $$('.jo-dish', pane).forEach(function (dish) {
      var tags = (dish.getAttribute('data-tags') || '').split(' ').filter(Boolean);
      /* Selecting dims what does not match. It never hides it. */
      var match = dietState.every(function (k) { return tags.indexOf(k) > -1; });
      dish.classList.toggle('is-dim', !match);
    });
  }

  on('[data-menu-tab]', 'click', function (e, btn) {
    var tab = btn.getAttribute('data-menu-tab');
    $$('[data-menu-tab]').forEach(function (b) {
      var on_ = b === btn;
      b.classList.toggle('is-active', on_);
      b.setAttribute('aria-selected', String(on_));
    });
    $$('[data-menu-pane]').forEach(function (p) {
      p.hidden = p.getAttribute('data-menu-pane') !== tab;
    });
    $$('.jo-dish.is-open').forEach(function (x) { x.classList.remove('is-open'); });
    applyDiets();
    JO.noteInterest(tab.toLowerCase());
  });

  on('[data-diet]', 'click', function (e, btn) {
    var k = btn.getAttribute('data-diet');
    var i = dietState.indexOf(k);
    if (i === -1) dietState.push(k); else dietState.splice(i, 1);
    btn.classList.toggle('is-on', i === -1);
    btn.setAttribute('aria-pressed', String(i === -1));
    applyDiets();
    JO.noteInterest(k);
  });

  /* Tapping a dish row expands its allergen line. */
  on('[data-dish]', 'click', function (e, btn) {
    var dish = btn.closest('.jo-dish');
    var open = dish.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });

  /* ------------------------------------------------- Engine Room diary ---- */

  on('[data-diary-type]', 'click', function (e, btn) {
    var type = btn.getAttribute('data-diary-type');
    $$('[data-diary-type]').forEach(function (b) {
      var on_ = b === btn;
      b.classList.toggle('is-on', on_);
      b.setAttribute('aria-pressed', String(on_));
    });
    var shown = 0, total = 0;
    $$('[data-diary-row]').forEach(function (row) {
      total += 1;
      var match = type === 'Everything' || row.getAttribute('data-diary-row') === type;
      row.hidden = !match;
      if (match) shown += 1;
    });
    var count = $('#jo-diary-count');
    if (count) count.textContent = shown + ' of ' + total + ' dates';
    if (type !== 'Everything') JO.noteInterest(type.toLowerCase());
  });

  /* ------------------------------------------------------ custom checkboxes */

  on('[data-check]', 'click', function (e, btn) {
    var on_ = btn.classList.toggle('is-on');
    btn.setAttribute('aria-pressed', String(on_));
    var mark = $('.jo-check-box', btn);
    if (mark) mark.textContent = on_ ? '✓' : '';
  });

  /* ------------------------------------------------------- Joiners Club --- */

  function paintRecordFields() {
    $$('[data-record-name]').forEach(function (el) { el.textContent = JO.rec.name || 'there'; });
    $$('[data-record-birthday]').forEach(function (el) { el.textContent = JO.rec.birthday || '14 March'; });
  }

  function showJoined() {
    paintRecordFields();
    ['#jo-club-formwrap', '#jo-band-form'].forEach(function (s) { var el = $(s); if (el) el.hidden = true; });
    ['#jo-club-success', '#jo-band-success'].forEach(function (s) { var el = $(s); if (el) el.hidden = false; });
  }

  function showNotJoined() {
    ['#jo-club-formwrap', '#jo-band-form'].forEach(function (s) { var el = $(s); if (el) el.hidden = false; });
    ['#jo-club-success', '#jo-band-success'].forEach(function (s) { var el = $(s); if (el) el.hidden = true; });
  }

  if (JO.rec.joined) showJoined();

  function joinDate(day, year) { return day ? (year ? day + ' ' + year : day) : null; }

  $$('[data-club-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var name = (f.get('name') || '').trim();
      var email = (f.get('email') || '').trim();
      if (!name || !email) return;

      JO.rec.name = name;
      JO.rec.email = email;
      JO.rec.mobile = (f.get('mobile') || '').trim() || null;
      JO.rec.birthday = joinDate((f.get('birthday') || '').trim(), (f.get('birthYear') || '').trim());
      JO.rec.anniversary = joinDate((f.get('anniversary') || '').trim(), (f.get('anniversaryYear') || '').trim());
      JO.rec.postcode = (f.get('postcode') || '').trim() || null;
      JO.rec.venue = f.get('venue') || null;
      JO.rec.joined = true;
      JO.recordChanged();
      showJoined();
    });
  });

  var restart = $('#jo-club-restart');
  if (restart) restart.addEventListener('click', function () { JO.resetRecord(); });

  JO.resetRecord = function () {
    JO.rec = Object.assign({}, EMPTY, {pages: [route], venueViews: {}, interests: []});
    JO.recordChanged();
    showNotJoined();
    $$('[data-club-form]').forEach(function (form) { form.reset(); });
  };

  /* The footer signup forwards to the Club page and carries the typed email. */
  var footerSignup = $('#jo-footer-signup');
  if (footerSignup) {
    footerSignup.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = ($('#jo-footer-email') || {}).value || '';
      /* Query first, hash last — the other way round buries the fragment
         inside the query string and the scroll target never matches. */
      var url = 'joiners-club.html' + (email ? '?email=' + encodeURIComponent(email) : '') + '#joiners-club-form';
      try { sessionStorage.setItem('joiners-prefill-email', email); } catch (err) {}
      w.location.href = url;
    });
  }

  /* Pick the carried email up on arrival and scroll to the form. */
  if (route === 'table') {
    var carried = '';
    try { carried = sessionStorage.getItem('joiners-prefill-email') || ''; } catch (e) {}
    /* The query param is the fallback, so the link still carries the address
       if sessionStorage is unavailable or the link is shared. */
    if (!carried) {
      var m = w.location.search.match(/[?&]email=([^&]*)/);
      if (m) { try { carried = decodeURIComponent(m[1]); } catch (e) {} }
    }
    if (carried) {
      var target = $('#jo-club-formwrap input[name="email"]');
      if (target) target.value = carried;
      try { sessionStorage.removeItem('joiners-prefill-email'); } catch (e) {}
    }
    if (w.location.hash === '#joiners-club-form') {
      setTimeout(function () { scrollToEl(d.getElementById('joiners-club-form')); }, 80);
    }
  }

  /* --------------------------------------------------------------- WiFi --- */

  var wifiForm = $('#jo-wifi-formel');
  if (wifiForm) {
    wifiForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(wifiForm);
      var email = (f.get('wifiEmail') || '').trim();
      if (!email) return;
      JO.rec.email = JO.rec.email || email;
      var dob = (f.get('wifiDob') || '').trim();
      if (dob && !JO.rec.birthday) JO.rec.birthday = joinDate(dob, (f.get('wifiDobYear') || '').trim());
      JO.recordChanged();
      JO.noteInterest('wifi, coffee house');
      $('#jo-wifi-form').hidden = true;
      $('#jo-wifi-online').hidden = false;
    });
  }
  var wifiRestart = $('#jo-wifi-restart');
  if (wifiRestart) {
    wifiRestart.addEventListener('click', function () {
      wifiForm.reset();
      $$('[data-check].is-on').forEach(function (b) {
        b.classList.remove('is-on');
        b.setAttribute('aria-pressed', 'false');
        var mark = $('.jo-check-box', b);
        if (mark) mark.textContent = '';
      });
      $('#jo-wifi-online').hidden = true;
      $('#jo-wifi-form').hidden = false;
    });
  }

  /* ------------------------------------------- the live Fydelia embed ----- */

  /* The framed splash renders at a fixed 600px logical width, because its own
     mobile layout carries a 410px min-width and clips below roughly 500px.
     Scale it to whatever width the column actually has, and set the frame's
     height to match so there is no dead space under it. */
  var SPLASH_W = 600, SPLASH_H = 982;

  function fitSplash() {
    $$('.jo-splash-frame').forEach(function (frame) {
      var w = frame.clientWidth;
      if (!w) return;
      var scale = w / SPLASH_W;
      frame.style.setProperty('--jo-splash-scale', String(scale));
      frame.style.height = Math.round(SPLASH_H * scale) + 'px';
    });
  }

  if ($('.jo-splash-frame')) {
    /* Measured, not guessed: re-fit on mount, on the next frame, once the
       fonts and the framed page have settled, and on every resize. */
    fitSplash();
    requestAnimationFrame(fitSplash);
    setTimeout(fitSplash, 250);
    $$('.jo-splash-iframe').forEach(function (f) { f.addEventListener('load', fitSplash); });
    w.addEventListener('resize', fitSplash);
    w.addEventListener('orientationchange', fitSplash);
    /* Observe the column, not the frame: the frame's own height is what this
       sets, so observing it would feed back into itself. */
    if (w.ResizeObserver) {
      var ro = new w.ResizeObserver(fitSplash);
      $$('.jo-splash-frame').forEach(function (frame) {
        if (frame.parentElement) ro.observe(frame.parentElement);
      });
    }
  }

  /* ------------------------------------------------------- cookie sheet --- */

  /* A dismissible bottom sheet that never covers a call to action. */
  var cookie = $('#jo-cookie');
  if (cookie) {
    var seen = false;
    try { seen = localStorage.getItem('joiners-cookie') !== null; } catch (e) {}
    if (!seen) setTimeout(function () { cookie.classList.add('is-open'); }, 600);
    $$('[data-cookie]', cookie).forEach(function (btn) {
      btn.addEventListener('click', function () {
        try { localStorage.setItem('joiners-cookie', btn.getAttribute('data-cookie')); } catch (e) {}
        cookie.classList.remove('is-open');
      });
    });
  }

  paintRecordFields();
  d.addEventListener('jo:record', paintRecordFields);

})(window, document);
