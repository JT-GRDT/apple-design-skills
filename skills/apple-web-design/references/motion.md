# Motion

The rule: **every change happens in place.** The user never sees a screen rebuilt, never loses scroll position, never
loses what they're typing. Motion explains what changed (a row arrives, a number goes up, a sheet comes from below)
and is short (250–600 ms). Everything here is skipped when the phone has Reduced Motion on.

## Contents
1. The `anim` helper and Reduced Motion
2. Re-rendering with morph (keyed rows, typing-safe)
3. Morph hooks: grow in, leave as a ghost, glide (FLIP), roll numbers
4. Tab switch and per-tab scroll memory
5. Presses, sheets, photos, theme change
6. Gestures: swipe to act, hold for a context action, swipe a toast away
7. Haptic tick
8. Pitfalls we hit

## 1. `anim` and Reduced Motion

```js
// Web Animations helper; does nothing (returns null) when the phone asks for reduced motion.
const calm = matchMedia('(prefers-reduced-motion: reduce)');
const anim = (el, kf, ms, easing = 'cubic-bezier(.2,.8,.2,1)', hold = false) =>
  calm.matches || !el.animate ? null : el.animate(kf, { duration: ms, easing, fill: hold ? 'forwards' : 'auto' });
const settle = a => a ? a.finished.catch(() => {}) : Promise.resolve();   // await an animation that may not exist
```
Plus, in CSS: `@media (prefers-reduced-motion:reduce){*{transition:none!important}}` and turn off any keyframe
`animation`. Script animations (Web Animations API) survive re-renders; CSS animations restart when a node is replaced,
which is one more reason to morph instead of rebuilding.

## 2. Re-render with morph

`assets/morph.js` (copy it into the project, load it before the app script) exposes `morph(el, html, hooks?)`: it
makes `el`'s children match `html` while keeping existing nodes. Elements with `data-key="…"` are matched by key
(rows that move, appear or disappear); everything else by position. A focused input keeps what the user is typing;
an input the user changed keeps its value unless the app changed it; checkboxes always follow the app state; elements
marked `data-live` are left alone (script-owned, like a pill's thumb). On any error it falls back to `innerHTML`, so a
bug degrades to a plain re-render instead of a blank screen.

```js
const morph = window.morph || ((el, html) => { el.innerHTML = html; });   // if morph.js failed to load
function render(hooks = MOTION) {
  const app = $('#app'), html = VIEWS[ui.tab]();
  if (app.dataset.tab === ui.tab) morph(app, html, hooks);
  else { app.innerHTML = html; app.dataset.tab = ui.tab; }                // a different page: build it fresh
  morph($('#tabs'), tabBar());
  if (ui.sheet) morph($('#sheet'), SHEETS[ui.sheet.type](ui.sheet), MOTION);
  syncPills();
}
```
Pattern: all state in one object, `commit(fn, toastMessage)` mutates it, saves, calls `render()`, shows a toast with
undo. Views are pure functions returning HTML strings (escape every user string).

Keys: give every row that can appear, disappear or move a stable `data-key` — record id, product name, `day:meal`,
log entry id. Keys must be unique among siblings.

## 3. Morph hooks

```js
// Motion for in-place updates: rows grow in, glide to their new place, leave as a fading ghost; numbers roll.
const MOTION = {
  added: n => anim(n, [{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], 320),
  moved: (n, dx, dy) => anim(n, [{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], 420, 'cubic-bezier(.3,1.1,.4,1)'),
  removed: n => {           // the real node is gone at once; a fixed-position copy fades out where it was
    if (calm.matches) return;
    const r = n.getBoundingClientRect(); if (!r.height || r.bottom < 0 || r.top > innerHeight) return;
    const g = n.cloneNode(true); g.removeAttribute('data-key'); g.classList.add('ghost');
    Object.assign(g.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', margin: '0', zIndex: '5', pointerEvents: 'none' });
    document.body.appendChild(g);
    settle(anim(g, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(28px) scale(.98)' }], 360, 'cubic-bezier(.4,0,1,1)')).then(() => g.remove());
  },
  rolled: (n, up) => anim(n, [{ transform: `translateY(${up ? 40 : -40}%)`, opacity: 0 }, { transform: 'none', opacity: 1 }], 380),
};
```
CSS: `.ghost{background:var(--card);border-radius:var(--r-md)}` and `[data-roll]{display:inline-block}`.
Mark any number that should roll with `data-roll`; morph calls `rolled(el, up)` when its text changes.
`moved` is FLIP: morph records each keyed element's rect before patching, then passes the delta; a child that moved
only because its keyed parent moved is not animated twice.

For a calmer update (e.g. a filter switch swaps the page's content, it isn't a list edit), pass quieter hooks:
`render({ added: n => anim(n, [{ opacity: 0 }, { opacity: 1 }], 260) })` — no ghosts, no gliding.

Updating a counter outside morph:
```js
function rollTo(b, text, up) { if (b.textContent === text) return;
  b.textContent = text; anim(b, [{ transform: `translateY(${up ? 45 : -45}%)`, opacity: 0 }, { transform: 'none', opacity: 1 }], 380); }
```
A button whose label changes ("Užsakyti" → "1 ×") gets a little pop:
`anim(b, [{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }], 420, 'cubic-bezier(.3,1.4,.5,1)')`.

## 4. Tab switch and scroll memory

```js
tab: t => {
  if (t === ui.tab) { scrollTo({ top: 0, behavior: calm.matches ? 'auto' : 'smooth' }); return; }  // tapping the open tab: to top
  ui.scroll[ui.tab] = scrollY; ui.tab = t; closeSheet(); render();
  scrollTo(0, ui.scroll[t] || 0);                                                                    // each tab returns where you left it
  anim($('#app'), [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], 340);
  // with glass: the selected-tab drop stretches like liquid as it slides, then settles
  anim($('.tab-ind'), [{ scale: '1 1' }, { scale: '1.1 .92', offset: .35 }, { scale: '.97 1.03', offset: .7 }, { scale: '1 1' }], 600, 'ease-out');
}
```
Set the indicator's position via a CSS variable (`style="--i:2"` on its container, `translate: calc(var(--i) * 100%) 0`)
so the transition does the slide.

## 5. Presses, sheets, photos, theme

- Press: every tappable gets `transition: transform .3s var(--spring)` and `:active{transform:scale(.96)}` (rows use a
  background change instead; tiles .97; small round buttons .9). Glass controls swell instead: `scale(1.08–1.12)`.
- Sheets: CSS transition on `transform` with `cubic-bezier(.32,.72,0,1)` over a fading scrim (components.md §9).
  Open = add `body.sheet-open`; close = remove it. Lock page scroll while open.
- A held element lifting above a blurred page (iOS context menu): scale 1.02, deeper shadow, `z-index` above a fixed
  scrim with `backdrop-filter: blur(10px)` and 14 % black (45 % in dark).
- Photos fade in when they really load (slow ones too):
  `document.addEventListener('load', e => { if (e.target.tagName === 'IMG') anim(e.target, [{ opacity: 0 }, { opacity: 1 }], 500); }, true);`
- Theme change: `document.startViewTransition(apply)` for a soft cross-fade (skip under Reduced Motion).
- Progress (rings, bars): animate `stroke-dashoffset` / `width` with a CSS transition, `.7–.9s var(--ease)`.

## 6. Gestures

**Swipe right to act** (iOS Mail leading swipe), e.g. "mark as done": a coloured action sits behind the tile and fades
in as the tile follows the finger; past 45 % of the width it "arms" (icon grows, haptic tick); letting go armed does
the action (with undo in the toast), otherwise the tile springs back. A vertical move first means scroll — abandon.
A drag is never a tap.
```js
let sw = null, swallowClick = false;
document.addEventListener('pointerdown', e => { const b = !e.button && e.target.closest('[data-swipe]');
  sw = b ? { b, x: e.clientX, y: e.clientY, id: e.pointerId, on: false, armed: false } : null; });
document.addEventListener('pointermove', e => { const s = sw; if (!s || e.pointerId !== s.id) return;
  const dx = e.clientX - s.x, dy = e.clientY - s.y;
  if (!s.on) { if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { sw = null; return; }   // a scroll
    if (Math.abs(dx) > 10) s.moved = true; if (dx < 10) return;
    s.on = true; s.act = s.b.previousElementSibling; s.b.style.transition = 'none'; s.b.setPointerCapture(e.pointerId); }
  const x = Math.max(0, dx), armed = x > s.b.offsetWidth * .45;
  s.b.style.transform = `translateX(${x}px)`; s.act.style.opacity = Math.min(1, x / 70);
  if (armed !== s.armed) { s.armed = armed; s.b.parentElement.classList.toggle('armed', armed); if (armed) tick(); } });
const swEnd = cancel => e => { const s = sw; if (!s || e.pointerId !== s.id) return; sw = null;
  if (s.moved) { swallowClick = true; setTimeout(() => { swallowClick = false; }, 400); }
  if (!s.on) return; s.b.style.transition = ''; s.b.style.transform = ''; s.act.style.opacity = '';
  s.b.parentElement.classList.remove('armed'); if (s.armed && !cancel) doAction(s.b); };
document.addEventListener('pointerup', swEnd(false)); document.addEventListener('pointercancel', swEnd(true));
document.addEventListener('click', e => { if (swallowClick) { swallowClick = false; e.stopPropagation(); e.preventDefault(); } }, true);
```
CSS: the tile needs `touch-action: pan-y` (vertical scroll stays native) and `user-select:none; -webkit-touch-callout:none`.

**Hold for a context action** (e.g. undo on a completed item): start a 450 ms timer on pointerdown, cancel it if the
finger moves > 8 px; when it fires, lift the tile, blur the page, tick, and spring a small pill button out above it
(below if near the top). Any tap elsewhere, scroll or Escape puts it away. Prevent `contextmenu` on those tiles.

**Swipe a toast away**: see components.md §11.

## 7. Haptic tick

iOS Safari (18+) has no vibration API, but it ticks when a native `switch` checkbox toggles; Android vibrates.
```js
const tick = () => { let h = document.getElementById('hap');
  if (!h) { document.body.insertAdjacentHTML('beforeend', '<label class="hap" id="hap" aria-hidden="true"><input type="checkbox" switch tabindex="-1"></label>'); h = document.getElementById('hap'); }
  h.click(); if (navigator.vibrate) navigator.vibrate(10); };
```
CSS: `.hap{position:fixed;left:-100px;top:0;opacity:0;pointer-events:none}`. Use for: arming a swipe, a context
action appearing, a successful scan. Not for every tap.

## 8. Pitfalls we hit

- A full `innerHTML` re-render on every sync makes the page jump, kills transitions, and eats what the user is typing.
  Morph instead; a background sync must never interrupt typing.
- An `<svg>` inline in text flow gets a baseline gap below it; ring/icon SVGs need `display:block`.
- Animating `scale` on an element positioned with `transform: translateX()` multiplies the translation (overshoot grows
  with distance). Position with the `translate` property, animate `scale`/`transform` separately.
- A pill thumb's first placement must jump (transition off for one frame), or it slides in from the left edge on load.
- Pills and lens maps depend on element widths: recompute on `resize` (phone rotation).
- After a gesture that sets inline styles, reset with `style.cssText = ''`, not one property at a time.
