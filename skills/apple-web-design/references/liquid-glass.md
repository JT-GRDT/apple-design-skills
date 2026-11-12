# Liquid Glass (iOS 26 style) for the web

Glass is for **floating chrome only**: the tab bar, a sticky pill switcher, round floating buttons, close buttons on
photos and in sheets, toasts, alerts, small context pills, and the grey buttons inside sheets. Content tiles stay
solid so text is always easy to read. The primary blue button stays solid blue (tinted-glass blue was tried and
rejected).

Make it switchable (`html.glass` class, on by default) with a strength slider `--g` from 0 to 1 (stronger = clearer,
less frosted, more bending at the rim). Store the preference per device (localStorage), not in synced data.

## Contents
1. The material
2. Glass buttons inside sheets (no backdrop to blur)
3. The floating tab bar that tucks on scroll
4. Refraction at the rim (Chromium only)
5. Settings UI: switch + strength slider + live preview
6. Accessibility

## 1. The material

A thin luminous tint over a blurred, colour-boosted backdrop; a rim that catches the light top-left and bottom-right;
a soft inner glow for thickness; a wide soft shadow.
```css
:root{--g:.6;--glass:255 255 255;--glass-a:calc(.62 - .42 * var(--g));--glass-lum:1.08;--rim-a:1}
@media (prefers-color-scheme:dark){:root{--glass:30 30 34;--glass-a:calc(.66 - .3 * var(--g));--glass-lum:.92;--rim-a:.5}}
html.glass :is(nav.tabs, main > .pills, .toast, .alert, .fab, .sheet .x, .x.onimg){
  --fx:blur(calc(20px - 12px * var(--g))) saturate(calc(1.6 + .6 * var(--g))) brightness(var(--glass-lum));
  background:radial-gradient(120% 90% at 20% 0%,rgb(255 255 255 / calc((.1 + .14 * var(--g)) * var(--rim-a))),transparent 60%),rgb(var(--glass) / var(--glass-a));
  -webkit-backdrop-filter:var(--fx);backdrop-filter:var(--fx);
  box-shadow:inset 1.5px 1.5px 1px -1px rgb(255 255 255 / calc((.55 + .4 * var(--g)) * var(--rim-a))),
    inset -1.5px -1.5px 1px -1px rgb(255 255 255 / calc((.3 + .4 * var(--g)) * var(--rim-a))),
    inset 0 0 0 .5px rgb(255 255 255 / calc((.18 + .22 * var(--g)) * var(--rim-a))),
    inset 0 0 14px rgb(255 255 255 / calc((.06 + .12 * var(--g)) * var(--rim-a))),
    var(--drop,0 10px 36px rgb(0 0 0 / .12),0 1px 4px rgb(0 0 0 / .06))}
html.glass :is(.sheet .x,.x.onimg){--drop:0 3px 12px rgb(0 0 0 / .14);color:var(--ink)}   /* small glass: smaller shadow, full-ink ✕ */
html.glass .toast{color:var(--ink)} html.glass .toast button{color:var(--primary)}
html.glass .tab:not(.on){color:var(--ink80)}   /* photos show through glass; grey labels get lost, iOS 26 uses full ink */
/* glass swells under the finger instead of sinking */
html.glass .tab:active{transform:scale(1.08)}
html.glass :is(.fab,.sheet .x,.x.onimg):active{transform:scale(1.12)}
```
A round floating button (beside the page title): 44 px circle, `position:absolute; top: safe-area + 32px; right:16px`.

## 2. Glass buttons inside sheets

The sheet behind them is solid, so there's nothing to blur or bend: the glass is the tint, the rim, the inner glow and
a soft shadow. Applies to grey buttons, red-text buttons, quick chips and the pill switcher's thumb. Red ⊖ and switches
stay solid, as on iOS.
```css
:root{--pane:rgb(120 120 128 / .12)}
@media (prefers-color-scheme:dark){:root{--pane:rgb(255 255 255 / .1)}}
html.glass .sheet :is(.btn.fill,.btn.bad,.btn.sec,.quick button,.pills .thumb){
  background:radial-gradient(120% 100% at 30% 0%,rgb(255 255 255 / calc((.35 + .3 * var(--g)) * var(--rim-a))),transparent 70%),var(--pane);
  box-shadow:inset 1.5px 1.5px 1px -1px rgb(255 255 255 / calc((.7 + .3 * var(--g)) * var(--rim-a))),inset -1.5px -1.5px 1px -1px rgb(255 255 255 / calc((.4 + .4 * var(--g)) * var(--rim-a))),
    inset 0 0 0 .5px rgb(255 255 255 / calc(.25 * var(--rim-a))),inset 0 0 10px rgb(255 255 255 / calc((.1 + .2 * var(--g)) * var(--rim-a))),0 2px 10px rgb(0 0 0 / .07)}
html.glass .sheet :is(.btn.fill,.btn.bad,.btn.sec,.quick button):active{transform:scale(1.04);filter:brightness(1.08)}
html.glass .sheet .quick button.on{background:var(--primary);color:var(--on-primary);box-shadow:none}
```

## 3. The floating tab bar that tucks on scroll

With glass on, the tab bar floats as a capsule 10 px above the bottom; scrolling down tucks it into a 48 px glass
button showing only the current tab's icon (bottom left); scrolling up or tapping it brings it back.
```css
:root{--tuck:.5s cubic-bezier(.32,.72,0,1)}
html.glass nav.tabs{left:12px;right:12px;bottom:calc(10px + env(safe-area-inset-bottom));max-width:560px;margin:0 auto;padding:0 5px;border-radius:999px;transition:right var(--tuck)}
html.glass nav.tabs::before{display:none}
html.glass .tab-ind{top:5px;bottom:5px;background:rgb(120 120 128 / .14);box-shadow:inset 0 0 0 .5px rgb(255 255 255 / .5),inset 1px 1px 1px -1px rgb(255 255 255 / .9);transition:translate .5s cubic-bezier(.32,.72,0,1),opacity .2s}
@media (prefers-color-scheme:dark){html.glass .tab-ind{background:rgb(255 255 255 / .13);box-shadow:inset 0 0 0 .5px rgb(255 255 255 / .12),inset 1px 1px 1px -1px rgb(255 255 255 / .35)}}
html.glass nav.tabs.min{right:calc(100% - 60px)}
html.glass .tab{min-width:0;transition:flex-grow var(--tuck),padding var(--tuck),gap var(--tuck),opacity .3s .12s,filter .3s .12s,color .3s,transform .3s var(--spring)}
html.glass .tab svg{transition:transform var(--tuck)}
html.glass .tab .tl{display:block;max-height:14px;transition:max-height var(--tuck),opacity .25s .15s}
html.glass nav.tabs.min .tab{padding:11px 0;gap:0;transition:flex-grow var(--tuck),padding var(--tuck),gap var(--tuck),opacity .15s,filter .15s,color .3s,transform .3s var(--spring)}
html.glass nav.tabs.min .tab .tl{max-height:0;opacity:0;transition:max-height var(--tuck),opacity .12s}
html.glass nav.tabs.min .tab:not(.on){flex-grow:0;opacity:0;filter:blur(3px);pointer-events:none}
html.glass nav.tabs.min .tab:not(.on) svg{transform:scale(.6)}
html.glass nav.tabs.min .tab-ind{opacity:0}
```
The capsule, the folding tabs and the height share one duration and curve so they move as one; labels and other icons
fade and soften (quickly on the way in, a beat later on the way out) instead of squashing.
```js
let lastY = scrollY, tuckT;
function tabsMin(on) {  // returns true if it was tucked and just opened (so a tap on it only opens it)
  const t = $('#tabs'), was = t.classList.contains('min'), c = document.documentElement.classList;
  on = on && c.contains('glass') && c.contains('tuck');           // a setting can switch tucking off
  if (was !== on) { t.classList.toggle('min', on);
    if (calm.matches) lensSync();
    else { clearTimeout(tuckT); t.classList.add('moving'); tuckT = setTimeout(() => { t.classList.remove('moving'); lensSync(); }, 520); } }
  return was && !on;
}
addEventListener('scroll', () => { const y = scrollY, dy = y - lastY;
  if (Math.abs(dy) < 8 || y > document.documentElement.scrollHeight - innerHeight + 1) return;   // jitter, or the bottom bounce
  tabsMin(dy > 0 && y > 60); lastY = y; }, { passive: true });
```
In the tab action: if the tapped tab is the current one and `tabsMin(false)` returns true, just open the bar.

## 4. Refraction at the rim (Chromium only)

iOS 26 glass bends what's behind it at the edge. Chromium can do this with an SVG displacement filter inside
`backdrop-filter`; Safari (every iPhone browser) and Firefox can't yet, so they get everything except the bending.
Each glass shape gets a displacement map of its own size: within a 16 px rim band, the backdrop is sampled from
further in, so lines behind the glass curve at its edge.
```js
const REFRACT = /Chrome\//.test(navigator.userAgent);
document.documentElement.classList.toggle('refract', REFRACT);
function lensMap(w, h, r) {   // R/G = x/y displacement, 128 = none
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d'), img = x.createImageData(w, h), band = Math.min(r, 16);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const px = i + .5 - w / 2, py = j + .5 - h / 2, qx = Math.abs(px) - w / 2 + r, qy = Math.abs(py) - h / 2 + r;
    let d, nx = 0, ny = 0;   // d: depth inside the rounded rect; (nx, ny): outward normal
    if (qx > 0 && qy > 0) { const l = Math.hypot(qx, qy) || 1; d = r - l; nx = qx / l; ny = qy / l; }
    else if (qx > qy) { d = r - qx; nx = 1; } else { d = r - qy; ny = 1; }
    const m = d < band ? (1 - Math.max(0, d) / band) ** 2 : 0, k = (j * w + i) * 4;
    img.data[k] = 128 - Math.sign(px) * nx * m * 127; img.data[k + 1] = 128 - Math.sign(py) * ny * m * 127; img.data[k + 2] = 128; img.data[k + 3] = 255;
  }
  x.putImageData(img, 0, 0); return c.toDataURL();
}
function lensSync() {   // call after renders, on resize and when the glass setting changes
  if (!REFRACT) return;
  let svg = document.getElementById('lenses');
  if (!svg) { document.body.insertAdjacentHTML('beforeend', '<svg id="lenses" width="0" height="0" style="position:absolute" aria-hidden="true"></svg>'); svg = document.getElementById('lenses'); }
  document.querySelectorAll('nav.tabs, main > .pills, .fab, .sheet .x, .x.onimg').forEach(el => {
    const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight); if (!w || !h) return;
    const r = Math.round(Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2)), id = `lens-${w}-${h}-${r}`;
    if (!document.getElementById(id)) svg.insertAdjacentHTML('beforeend', `<filter id="${id}" x="0" y="0" width="${w}" height="${h}" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">` +
      `<feImage href="${lensMap(w, h, r)}" x="0" y="0" width="${w}" height="${h}" result="m"/><feDisplacementMap in="SourceGraphic" in2="m" xChannelSelector="R" yChannelSelector="G"/></filter>`);
    if (el.style.getPropertyValue('--lens') !== `url(#${id})`) el.style.setProperty('--lens', `url(#${id})`);
  });
  const g = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--g')) || .6;
  const sc = String(Math.round(6 + 44 * g));   // bending grows with the strength slider (--g, 0..1)
  svg.querySelectorAll('feDisplacementMap').forEach(f => { if (f.getAttribute('scale') !== sc) f.setAttribute('scale', sc); });
}
```
```css
html.glass.refract :is(nav.tabs, main > .pills, .fab, .sheet .x, .x.onimg){backdrop-filter:var(--lens,) var(--fx)}
html.glass.refract nav#tabs.moving{backdrop-filter:var(--fx)}   /* the map is sized for the old shape: rest the lens while tucking */
```

## 5. Settings UI

In settings ("Išvaizda."): a switch row "Skystas stiklas" (subtitle "Permatomas meniu"); under it, unfolding when on
(`grid-template-rows: 0fr → 1fr` transition), a live preview (a photo with a round glass button and a glass search
capsule over its lower edge, made of the same material so the slider changes it live) and a clear ↔ tinted slider:
a native `<input type="range">` invisible on top for dragging, a drawn white pill knob that swells into clear glass
while held (`scale(1.7,1.6)`, transparent fill, glass rim). Below it a switch "Sutraukti meniu slenkant" for tucking.
A theme picker beside it: two phone-screenshot previews (Šviesus / Tamsus) with a radio each, plus an "Automatiškai"
switch.

## 6. Accessibility

```css
@media (prefers-reduced-transparency:reduce){html.glass :is(nav.tabs, main > .pills, .toast, .alert, .fab, .sheet .x, .x.onimg){--glass-a:.94}}
```
Glass must never be the only thing separating text from a busy photo: keep labels at full ink on glass, and keep
content tiles solid.
