// morph(el, html, hooks?): make el's children match `html` while keeping the existing nodes wherever possible,
// so scroll position, focus, typed text and CSS transitions survive a re-render.
// - Elements with data-key="…" are matched by key (rows that move, appear or disappear); everything else by position.
// - A focused input/textarea keeps what the user is typing. Elements marked data-live are owned by script and left alone.
// - hooks (all optional): added(el), removed(el) [called just before removal], moved(el, dx, dy) [FLIP deltas],
//   rolled(el, up) [a data-roll element's number changed]. Only keyed / data-roll elements trigger hooks.
// If anything goes wrong it falls back to innerHTML, so a bug degrades to the old behaviour instead of a broken screen.
(function () {
  const key = n => (n.nodeType === 1 ? n.getAttribute('data-key') : null);
  const same = (a, b) => a.nodeType === b.nodeType && a.nodeName === b.nodeName && key(a) === key(b);
  const num = s => parseFloat(String(s).replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;

  function patch(from, to, h) {
    if (from.nodeType !== 1) { if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue; return; }
    if (from.hasAttribute('data-live')) return;
    const was = from.hasAttribute('data-roll') ? from.textContent : null;
    const field = from.tagName === 'INPUT' || from.tagName === 'TEXTAREA', given = field ? from.defaultValue : null;
    for (const { name } of [...from.attributes]) if (!to.hasAttribute(name)) from.removeAttribute(name);
    for (const { name, value } of [...to.attributes]) if (from.getAttribute(name) !== value) from.setAttribute(name, value);
    if (field) {
      // checkboxes always follow the app's state; text only when the app changed it and the user isn't typing there
      if (from.type === 'checkbox' || from.type === 'radio') from.checked = to.checked;
      else if (from !== document.activeElement && given !== to.defaultValue) from.value = to.value;
      return;
    }
    children(from, to, h);
    if (from.tagName === 'SELECT' && from !== document.activeElement) from.value = to.value;
    if (was !== null && was !== from.textContent && h.rolled) h.rolled(from, num(from.textContent) > num(was));
  }

  function children(parent, next, h) {
    const old = [...parent.childNodes], byKey = new Map(), used = new Set();
    old.forEach(n => { const k = key(n); if (k) byKey.set(k, n); });
    const loose = old.filter(n => !key(n)); let li = 0;
    const want = [...next.childNodes].map(nn => {
      let m = null;
      if (key(nn)) { m = byKey.get(key(nn)) || null; if (m && (used.has(m) || !same(m, nn))) m = null; }
      else if (li < loose.length) { const c = loose[li++]; if (same(c, nn)) m = c; }
      if (!m) return nn;
      used.add(m); patch(m, nn, h); return m;
    });
    old.forEach(n => { if (!used.has(n)) { if (key(n) && h.removed) h.removed(n); n.remove(); } });
    want.forEach((n, i) => {
      const isNew = !used.has(n);
      if (parent.childNodes[i] !== n) parent.insertBefore(n, parent.childNodes[i] || null);
      if (isNew && key(n) && h.added) h.added(n);
    });
  }

  window.morph = function (el, html, h = {}) {
    const t = document.createElement('template'); t.innerHTML = html;
    try {
      const before = h.moved ? new Map([...el.querySelectorAll('[data-key]')].map(n => [n, n.getBoundingClientRect()])) : null;
      children(el, t.content, h);
      if (before) {
        const shift = new Map();
        for (const [n, r] of before) {
          if (!n.isConnected) continue;
          const r2 = n.getBoundingClientRect(); let dx = r.left - r2.left, dy = r.top - r2.top;
          shift.set(n, [dx, dy]);
          const p = n.parentElement && n.parentElement.closest('[data-key]'), ps = p && el.contains(p) && shift.get(p);
          if (ps) { dx -= ps[0]; dy -= ps[1]; }  // moved along with its keyed parent: only the parent animates
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) h.moved(n, dx, dy);
        }
      }
    } catch (e) {
      console.error('morph fell back to innerHTML:', e);
      el.innerHTML = html;
    }
  };
})();
