/* ==========================================================================
   Joiners — The Joints
   --------------------------------------------------------------------------
   Tab switching, and search + filter over the national trading diary.

   diary-data.js is 162KB. It is imported here, on this page only, and never
   site-wide — LCP on every other page must not pay for it. In Webflow, put
   this script in THIS PAGE's custom code, not in Site Settings.
   ========================================================================== */
(function (w, d) {
  'use strict';

  function $(s) { return d.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(d.querySelectorAll(s)); }

  /* ------------------------------------------------------------- the tabs -- */

  d.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-joints-tab]') : null;
    if (!btn) return;
    var key = btn.getAttribute('data-joints-tab');
    $$('[data-joints-tab]').forEach(function (b) {
      var on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    $$('[data-joints-pane]').forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-joints-pane') === key);
    });
  });

  /* ------------------------------------------------------- national diary -- */

  var ALL = [];
  var PAGE = 40;

  var state = {q: '', impact: 'Any', category: 'Any', scope: 'Any', month: 'Any', limit: PAGE, open: null};

  var elQ = $('#jo-wo-q');
  var elCategory = $('#jo-wo-category');
  var elScope = $('#jo-wo-scope');
  var elMonth = $('#jo-wo-month');
  var elCount = $('#jo-wo-count');
  var elList = $('#jo-wo-list');
  var elMore = $('#jo-wo-more');
  var elClear = $('#jo-wo-clear');

  var IMPACT_CLASS = {
    Critical: 'jo-wo-impact-critical',
    High: 'jo-wo-impact-high',
    Medium: 'jo-wo-impact-medium',
    Low: 'jo-wo-impact-low'
  };

  function fillSelect(el, values) {
    el.textContent = '';
    values.forEach(function (v) {
      var o = d.createElement('option');
      o.value = v;
      o.textContent = v;
      el.appendChild(o);
    });
  }

  function uniq(key) {
    var seen = {};
    ALL.forEach(function (x) { if (x[key]) seen[x[key]] = true; });
    return ['Any'].concat(Object.keys(seen).sort());
  }

  /* Months keep their natural order, so they are not sorted alphabetically. */
  function monthsInOrder() {
    var seen = {}, out = ['Any'];
    ALL.forEach(function (x) { if (x.month && !seen[x.month]) { seen[x.month] = true; out.push(x.month); } });
    return out;
  }

  function matches(x) {
    if (state.impact !== 'Any' && x.impact !== state.impact) return false;
    if (state.category !== 'Any' && x.category !== state.category) return false;
    if (state.scope !== 'Any' && x.scope !== state.scope) return false;
    if (state.month !== 'Any' && x.month !== state.month) return false;
    if (state.q) {
      var hay = (x.event + ' ' + x.means + ' ' + x.scope + ' ' + x.category + ' ' + x.when).toLowerCase();
      if (hay.indexOf(state.q) === -1) return false;
    }
    return true;
  }

  function row(x) {
    var wrap = d.createElement('div');
    wrap.className = 'jo-wo-row' + (state.open === x.id ? ' is-open' : '');

    var btn = d.createElement('button');
    btn.type = 'button';
    btn.className = 'jo-wo-btn';
    btn.setAttribute('aria-expanded', String(state.open === x.id));

    var when = d.createElement('span');
    when.className = 'jo-wo-when';
    when.textContent = x.when;

    var mid = d.createElement('span');
    var event = d.createElement('span');
    event.className = 'jo-wo-event';
    event.textContent = x.event;
    var meta = d.createElement('span');
    meta.className = 'jo-wo-meta';
    meta.textContent = x.category + ' · ' + x.scope + ' · plan from ' + x.lead + ' out · ' + x.status;
    mid.appendChild(event);
    mid.appendChild(meta);

    var tag = d.createElement('span');
    tag.className = 'jo-wo-impact ' + (IMPACT_CLASS[x.impact] || 'jo-wo-impact-low');
    tag.textContent = x.impact;

    btn.appendChild(when);
    btn.appendChild(mid);
    btn.appendChild(tag);

    /* Tapping a row reveals the operator note. */
    var means = d.createElement('p');
    means.className = 'jo-wo-means';
    means.textContent = x.means;

    btn.addEventListener('click', function () {
      state.open = state.open === x.id ? null : x.id;
      render();
    });

    wrap.appendChild(btn);
    wrap.appendChild(means);
    return wrap;
  }

  function render() {
    var found = ALL.filter(matches);
    elCount.textContent = ALL.length ? found.length + ' of ' + ALL.length + ' dates' : 'loading the diary';

    elList.textContent = '';
    found.slice(0, state.limit).forEach(function (x) { elList.appendChild(row(x)); });

    var remaining = found.length - state.limit;
    elMore.hidden = remaining <= 0;
    elMore.textContent = 'Show ' + Math.min(PAGE, Math.max(remaining, 0)) + ' more';
  }

  function resetLimit() { state.limit = PAGE; state.open = null; }

  if (elQ) {
    elQ.addEventListener('input', function () {
      state.q = elQ.value.trim().toLowerCase();
      resetLimit();
      render();
    });
  }

  [[elCategory, 'category'], [elScope, 'scope'], [elMonth, 'month']].forEach(function (pair) {
    if (!pair[0]) return;
    pair[0].addEventListener('change', function () {
      state[pair[1]] = pair[0].value;
      resetLimit();
      render();
    });
  });

  d.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-impact]') : null;
    if (!btn) return;
    state.impact = btn.getAttribute('data-impact');
    $$('[data-impact]').forEach(function (b) { b.classList.toggle('is-on', b === btn); });
    resetLimit();
    render();
  });

  if (elMore) {
    elMore.addEventListener('click', function () {
      state.limit += PAGE;
      render();
    });
  }

  if (elClear) {
    elClear.addEventListener('click', function () {
      state = {q: '', impact: 'Any', category: 'Any', scope: 'Any', month: 'Any', limit: PAGE, open: null};
      if (elQ) elQ.value = '';
      [elCategory, elScope, elMonth].forEach(function (el) { if (el) el.value = 'Any'; });
      $$('[data-impact]').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-impact') === 'Any'); });
      render();
    });
  }

  /* Loaded on this page only. Replace diary-data.js to update the dates. */
  import('./diary-data.js')
    .then(function (m) {
      ALL = m.DIARY_2026.map(function (x) {
        return Object.assign({}, x, {scope: (x.scope || '').trim()});
      });
      fillSelect(elCategory, uniq('category'));
      fillSelect(elScope, uniq('scope'));
      fillSelect(elMonth, monthsInOrder());
      render();
    })
    .catch(function () {
      elCount.textContent = 'the diary could not be loaded';
    });

})(window, document);
