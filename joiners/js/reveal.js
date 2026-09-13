/* ==========================================================================
   Joiners — the reveal layer ("See the joints")
   --------------------------------------------------------------------------
   One class on <html> (.reveal-on) switches the whole layer. Everything the
   layer draws is CSS-gated on that class, so with it absent this file adds
   two event listeners and nothing else: no pins in the layout, no panel, no
   record card, no measurable cost. That is Rule 12, and it is testable —
   load any page with the switch off in an incognito window and the DOM,
   spacing and paint should be identical to a site with no reveal layer.

   State persists in sessionStorage, which is what makes the layer survive
   real page navigation. The prototype faked that with client-side routing;
   Webflow serves real pages, so sessionStorage is doing the work.

   In Webflow: this is custom code. Paste into Site Settings → Custom Code →
   Footer (after data.js and site.js), or host it.
   ========================================================================== */
(function (w, d) {
  'use strict';

  var JO = w.JO || (w.JO = {});
  var PINS = JO.PINS || {};
  var root = d.documentElement;

  var KEY_REVEAL = 'joiners-reveal';
  var KEY_TIP = 'joiners-tip';
  var KEY_RECOPEN = 'joiners-rec-open';

  function get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  function $(s) { return d.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(d.querySelectorAll(s)); }

  var reveal = get(KEY_REVEAL) === '1';
  var isJointsPage = d.body.getAttribute('data-route') === 'whats-on';

  /* ------------------------------------------------------------- the gate -- */

  /* The Joints is gated, not merely hidden: arriving at the URL with the
     layer off sends you home, so the guest layer never shows a tab that
     declares itself not guest-facing. */
  if (isJointsPage && !reveal) {
    w.location.replace('index.html');
    return;
  }

  function applyReveal() {
    root.classList.toggle('reveal-on', reveal);
    var sw = $('#jo-switch');
    if (sw) sw.setAttribute('aria-pressed', String(reveal));
    if (reveal) renderRecord();
  }

  function setReveal(next) {
    reveal = next;
    set(KEY_REVEAL, reveal ? '1' : '0');
    if (!reveal) {
      closePanel();
      /* Switching off while on The Joints returns the visitor home. */
      if (isJointsPage) { w.location.href = 'index.html'; return; }
    }
    applyReveal();
  }

  var sw = $('#jo-switch');
  if (sw) sw.addEventListener('click', function () { setReveal(!reveal); });

  /* Keyboard shortcut J, ignored while focus is in a field. */
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
    if (e.key === 'j' || e.key === 'J') {
      var tag = (e.target && e.target.tagName) || '';
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(tag)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      setReveal(!reveal);
    }
  });

  /* ------------------------------------------------------------- the tip --- */

  var tip = $('#jo-tip');
  if (tip) {
    var tipSeen = get(KEY_TIP) === '1';
    if (!tipSeen && !reveal && w.innerWidth >= 860) tip.classList.add('is-open');
    var dismiss = $('#jo-tip-dismiss');
    if (dismiss) {
      dismiss.addEventListener('click', function () {
        set(KEY_TIP, '1');
        tip.classList.remove('is-open');
      });
    }
  }

  /* ------------------------------------------------------------ the panel -- */

  var panel = $('#jo-panel');
  var scrim = $('#jo-panel-scrim');
  var lastFocus = null;

  function fieldRow(f) {
    var row = d.createElement('div');
    row.className = 'jo-panel-field';
    var k = d.createElement('span'); k.textContent = f.k;
    var v = d.createElement('span'); v.className = 'jo-panel-field-v'; v.textContent = f.v;
    row.appendChild(k); row.appendChild(v);
    return row;
  }

  function journeyStep(j) {
    var step = d.createElement('div');
    step.className = 'jo-panel-step';
    var t = d.createElement('span'); t.className = 'jo-panel-step-t'; t.textContent = j.t;
    var l = d.createElement('span'); l.className = 'jo-panel-step-label'; l.textContent = j.label;
    step.appendChild(t); step.appendChild(l);
    return step;
  }

  function openPanel(n) {
    var p = PINS[n];
    if (!p || !panel) return;
    lastFocus = d.activeElement;

    panel.classList.toggle('is-toggle', !!p.isToggle);

    $('#jo-panel-kicker').textContent = 'Pin ' + p.n + ' · ' + p.where;
    $('#jo-panel-title').textContent = p.title;
    $('#jo-panel-what').textContent = p.what;

    var fields = $('#jo-panel-fields');
    fields.textContent = '';
    (p.fields || []).forEach(function (f) { fields.appendChild(fieldRow(f)); });

    var journey = $('#jo-panel-journey');
    journey.textContent = '';
    (p.journey || []).forEach(function (j) { journey.appendChild(journeyStep(j)); });

    /* An unsourced number stays visibly [SOURCE NEEDED] with the reason
       underneath. It must not slip through to a live site. */
    $('#jo-panel-number').textContent = p.number || '';
    $('#jo-panel-number-label').textContent = p.numberLabel || '';
    $('#jo-panel-number-src').textContent = p.source || '';

    var arg = $('#jo-panel-argument');
    arg.textContent = p.argument || '';
    arg.hidden = !p.argument;

    scrim.classList.add('is-open');
    panel.classList.add('is-open');
    panel.scrollTop = 0;
    panel.focus();
  }

  function closePanel() {
    if (!panel) return;
    panel.classList.remove('is-open');
    scrim.classList.remove('is-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  d.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-pin]') : null;
    if (btn && reveal) {
      e.preventDefault();
      openPanel(Number(btn.getAttribute('data-pin')));
    }
  });
  if (scrim) scrim.addEventListener('click', closePanel);
  var closeBtn = $('#jo-panel-close');
  if (closeBtn) closeBtn.addEventListener('click', closePanel);

  /* ---------------------------------------------------------- Your Record -- */

  var record = $('#jo-record');
  var recBody = $('#jo-record-body');
  var recRows = $('#jo-record-rows');
  var recToggle = $('#jo-record-toggle');
  var recBar = $('#jo-record-bar');

  /* Starts collapsed, so it never covers the hero. */
  var recOpen = get(KEY_RECOPEN) === '1';

  function applyRecOpen() {
    if (!record) return;
    record.classList.toggle('is-open', recOpen);
    if (recBar) recBar.setAttribute('aria-expanded', String(recOpen));
    if (recToggle) recToggle.textContent = recOpen ? 'hide' : 'show';
  }

  if (recBar) {
    recBar.addEventListener('click', function () {
      recOpen = !recOpen;
      set(KEY_RECOPEN, recOpen ? '1' : '0');
      applyRecOpen();
      if (recOpen) renderRecord();
    });
  }

  function dwell() {
    var s = (JO.rec && JO.rec.seconds) || 0;
    var m = Math.floor(s / 60);
    return (m > 0 ? m + ' min ' : '') + (s % 60) + 's';
  }

  function rows() {
    var r = JO.rec || {};
    var views = r.venueViews || {};
    var top = Object.keys(views).sort(function (a, b) { return views[b] - views[a]; })[0];
    var venue = top ? ((JO.VENUES || []).filter(function (v) { return v.slug === top; })[0] || {}).name : null;
    var count = top ? views[top] : 0;
    var interests = r.interests || [];
    var segs = r.joined ? 3 : (interests.length ? 1 : 0);
    var clubForm = 'the Joiners Club form';

    return [
      {k: 'Contact', v: r.name || 'anonymous', src: r.name ? 'the Table form' : 'not identified', on: !!r.name, neutral: !r.name},
      {k: 'Proof of Presence', v: (r.pages || []).length + ' pages, ' + dwell(), src: 'device record', on: false, neutral: true},
      {k: 'Venue signal', v: venue ? venue + ' (viewed ' + (count === 1 ? 'once' : count + ' times') + ')' : 'none yet', src: 'venue_preference', on: !!venue},
      {k: 'Interest', v: interests.length ? interests.join(', ') : 'nothing yet', src: 'menu and filter signals', on: !!interests.length},
      {k: 'Segments', v: segs + ' of 14 matched', src: 'recalculated nightly', on: !!segs},
      {k: 'Email', v: r.email || 'not captured yet', src: r.email ? clubForm : '—', on: !!r.email},
      {k: 'Mobile', v: r.mobile || 'not captured yet', src: r.mobile ? clubForm : '—', on: !!r.mobile},
      {k: 'Birthday', v: r.birthday || 'not captured yet', src: r.birthday ? clubForm : '—', on: !!r.birthday},
      {k: 'Anniversary', v: r.anniversary || 'not captured yet', src: r.anniversary ? clubForm : '—', on: !!r.anniversary},
      {k: 'Postcode', v: r.postcode || 'not captured yet', src: r.postcode ? clubForm : '—', on: !!r.postcode}
    ];
  }

  function renderRecord() {
    if (!recRows || !reveal || !recOpen) return;
    recRows.textContent = '';
    rows().forEach(function (r) {
      var row = d.createElement('div');
      row.className = 'jo-record-row';

      var k = d.createElement('span');
      k.className = 'jo-record-k';
      k.textContent = r.k;

      var v = d.createElement('span');
      v.className = 'jo-record-v' + (r.on ? ' is-captured' : (r.neutral ? '' : ' is-empty'));
      v.appendChild(d.createTextNode(r.v));

      /* Every value names the mechanic that captured it. */
      var src = d.createElement('span');
      src.className = 'jo-record-src';
      src.textContent = r.src;
      v.appendChild(src);

      row.appendChild(k);
      row.appendChild(v);
      recRows.appendChild(row);
    });

    var foot = $('#jo-record-foot');
    if (foot) {
      foot.textContent = (JO.rec && JO.rec.joined)
        ? 'Birthday journey scheduled — first email 6 weeks before ' + (JO.rec.birthday || '14 March') + '.'
        : 'Join the Club and watch this fill in.';
    }
  }

  var recReset = $('#jo-record-reset');
  if (recReset) {
    recReset.addEventListener('click', function () {
      /* In the sandbox this must genuinely delete the contact and cancel
         queued sends, with no login. Wire to the Airship delete endpoint. */
      if (typeof JO.resetRecord === 'function') JO.resetRecord();
      renderRecord();
    });
  }

  d.addEventListener('jo:record', renderRecord);
  d.addEventListener('jo:tick', function () {
    if (!reveal || !recOpen) return;
    renderRecord();
  });

  /* The record card sits 68px up to clear the sticky book bar — except on
     Book, where that bar is not shown. */
  if (record && d.body.getAttribute('data-route') === 'book') {
    record.classList.add('jo-record-nobar');
  }

  applyRecOpen();
  applyReveal();

})(window, document);
