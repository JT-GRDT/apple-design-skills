# Components

Copy-paste recipes. All use the variables from `tokens.css`. Class names are short on purpose (they came from a single
big HTML file); rename freely, keep the values.

## Contents
1. Page header: title + caption line
2. Section heads (two-tone) and day heads
3. Lists and rows (iOS grouped table)
4. Buttons: pill, secondary, destructive, link, stepper, quick chips
5. Sliding pill switcher (segmented control)
6. Tags, status dots, progress bars
7. Cards grid (photo cards)
8. Hero number, ring and spec row
9. Bottom sheet (with grabber and close)
10. Big number input sheet
11. Toast with undo
12. Alert (iOS dialog)
13. Switch, round checkbox, radio
14. Tab bar (frosted, sliding indicator)
15. Empty states, text fields, steps/onboarding screens

---

## 1. Page header

```html
<h1>Recipes.</h1>
<div class="sync"><i></i>Išsaugota debesyje · vardas <svg class="gear">…</svg></div>
```
```css
.sync{font-size:13px;color:var(--muted);margin:8px 2px 28px;display:flex;align-items:center;gap:6px}
.sync.warn{color:var(--warn)}
.sync i{width:6px;height:6px;border-radius:50%;background:currentColor;display:inline-block}
```
The caption line under the title carries status (sync, account) and the way into settings; it stays quiet grey.

## 2. Section heads

```html
<div class="sh">Pusryčiai. <span>5 receptai.</span></div>
<h2 class="dh"><b>Šiandien.</b> <span>Ketvirtadienis, spalio 15 d.</span><em>1 790 kcal</em></h2>
```
```css
.sh{font-size:24px;font-weight:700;letter-spacing:-.02em;line-height:1.2;margin:36px 2px 14px}
.sh span{color:var(--muted)}
.dh{margin:40px 2px 14px;font-size:24px;line-height:1.2;letter-spacing:-.02em}
.dh b{font-weight:700}
.dh span{color:var(--muted);font-weight:700}
.dh em{display:block;margin-top:4px;font-style:normal;font-size:15px;font-weight:600;letter-spacing:0;color:var(--muted)}
.lede{font-size:21px;line-height:1.3;letter-spacing:-.01em;margin:0 2px 18px}  /* a one-line summary under a title */
```

## 3. Lists and rows

```html
<div class="list">
  <button class="row" data-key="r:42"><img class="th" src="…" alt="">
    <div class="grow"><div class="t">Name</div><div class="s">Secondary line</div></div>
    <div class="amt">400 g<small>≈ 7 vnt.</small></div><svg class="chev">…</svg></button>
</div>
```
```css
.list{background:var(--card);border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shadow)}
.row{display:flex;align-items:center;gap:14px;padding:14px 18px;min-height:56px;position:relative;width:100%;text-align:left;background:none;border:0;transition:background .2s}
.row+.row::before{content:"";position:absolute;top:0;left:18px;right:0;height:1px;background:var(--hair)}  /* inset separator */
.list.thumbs .row+.row::before{left:96px}   /* rows with a 64 px thumbnail: separator starts at the text */
button.row:active{background:var(--soft)}
.grow{flex:1;min-width:0}
.t{font-size:17px;line-height:1.3}.t.b{font-weight:600}
.s{font-size:14px;color:var(--muted);margin-top:2px;line-height:1.35}
.cap{font-size:14px;color:var(--muted)}
.amt{font-size:19px;font-weight:600;letter-spacing:-.01em;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
.amt small{display:block;font-weight:400;font-size:13px;letter-spacing:0;color:var(--muted)}
.th{width:64px;height:64px;border-radius:var(--r-md);object-fit:cover;flex:none;background:var(--fill)}
.chev{color:var(--muted);opacity:.5;flex:none}
.summary{background:var(--card);border-radius:var(--r-lg);padding:18px;display:flex;align-items:center;gap:14px;box-shadow:var(--shadow)}
.note{background:var(--card);border-radius:var(--r-lg);padding:18px;line-height:1.55;box-shadow:var(--shadow)}
```
Give every row that can appear, disappear or move a stable `data-key` (record id, product name, `day:meal`) so the
morph can animate it (motion.md).

Destructive row action, iOS edit-mode style (red ⊖):
```css
.del{width:24px;height:24px;border-radius:50%;border:0;padding:0;flex:none;background:var(--bad);position:relative;transition:transform .3s var(--spring)}
.del::after{content:"";position:absolute;left:6px;right:6px;top:50%;height:2.4px;margin-top:-1.2px;border-radius:2px;background:#fff}
.del:active{transform:scale(.88)}
```

## 4. Buttons

```css
.btn{appearance:none;border:0;border-radius:999px;padding:15px 24px;font-weight:600;font-size:17px;line-height:1;background:var(--primary);color:var(--on-primary);display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .3s var(--spring),opacity .2s}
.btn.sec{background:var(--card);color:var(--primary);box-shadow:var(--shadow)}   /* on the page background */
.btn.fill{background:var(--fill);color:var(--primary)}                           /* secondary */
.btn.bad{background:var(--fill);color:var(--bad)}                                /* destructive: red text, never a red slab */
.btn.wide{width:100%}
.btn:disabled{opacity:.4}
.btn:active,.card:active,.x:active,.quick button:active,.step button:active{transform:scale(.96)}   /* every tap presses */
.btns{display:flex;gap:10px;flex-wrap:wrap}.btns .btn{flex:1;white-space:nowrap}
.link{background:none;border:0;color:var(--primary);font-weight:400;padding:8px 4px;font-size:17px}
/* − 3 + stepper */
.step{display:inline-flex;align-items:center;background:var(--fill);border-radius:999px}
.step button{width:44px;height:38px;border:0;background:none;color:var(--primary);font-size:22px;line-height:1;transition:transform .3s var(--spring)}
.step span{min-width:26px;text-align:center;font-weight:600;font-variant-numeric:tabular-nums}
/* quick-value chips under a big number: −100 −10 +10 +100 */
.quick{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:18px}
.quick button{border:0;background:var(--fill);border-radius:999px;padding:11px 0;font-weight:600;color:var(--primary);transition:transform .3s var(--spring)}
.quick button.on{background:var(--primary);color:var(--on-primary)}
```
One primary (blue) button per screen or sheet. Everything else is `.fill`, `.link` or a row.

## 5. Sliding pill switcher

A grey track with one white pill that slides under the chosen option (Apple's segmented control). The pill is a
separate element positioned by script, so it can animate between options of different widths.

```html
<nav class="pills"><i class="thumb" data-live></i>
  <button class="on" data-v="all">Visi</button><button data-v="p">Pusryčiai</button>…</nav>
```
```css
.pills{position:relative;display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;background:var(--fill);border-radius:999px;padding:3px}
.pills::-webkit-scrollbar{display:none}
.pills button{position:relative;z-index:1;flex:1 0 auto;border:0;background:none;border-radius:999px;padding:9px 15px;font-size:15px;font-weight:600;white-space:nowrap;color:var(--ink);transition:transform .3s var(--spring)}
.pills button:active{transform:scale(.94)}
.pills .thumb{position:absolute;top:3px;bottom:3px;left:0;width:0;border-radius:999px;background:var(--card);box-shadow:0 2px 8px rgba(0,0,0,.12);transition:transform .45s cubic-bezier(.3,1.25,.4,1),width .45s cubic-bezier(.3,1.25,.4,1)}
@media (prefers-color-scheme:dark){.pills .thumb{background:#636366}}
/* sticky + frosted when it filters a long page */
main > .pills{position:sticky;top:calc(env(safe-area-inset-top) + 8px);z-index:3;box-shadow:var(--shadow);background:color-mix(in srgb,var(--fill) 85%,transparent);-webkit-backdrop-filter:saturate(1.8) blur(20px);backdrop-filter:saturate(1.8) blur(20px)}
```
```js
// Place each pill under its chosen button. Call after every render and on resize (rotation changes widths).
function syncPills(root = document) {
  root.querySelectorAll('.pills').forEach(p => {
    const on = p.querySelector('button.on'), t = p.querySelector('.thumb'); if (!on || !t) return;
    const first = !t.style.width;  // first placement: jump there, don't slide in from the left edge
    if (first) t.style.transition = 'none';
    t.style.width = on.offsetWidth + 'px'; t.style.transform = `translateX(${on.offsetLeft}px)`;
    if (first) { void t.offsetWidth; t.style.transition = ''; }
  });
}
addEventListener('resize', () => syncPills());
```
`data-live` tells the morph to leave the thumb alone (script owns its position).

## 6. Tags, status dots, progress

```css
.tag{display:inline-block;font-size:12px;font-weight:600;padding:4px 9px;border-radius:999px;white-space:nowrap}
.tag.ok{color:var(--ok);background:color-mix(in srgb,var(--ok) 14%,transparent)}
.tag.warn{color:var(--warn);background:color-mix(in srgb,var(--warn) 14%,transparent)}
.tag.bad{color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,transparent)}
.tag.none{color:var(--muted);background:var(--fill)}
.st{width:24px;height:24px;border-radius:50%;flex:none;display:grid;place-items:center;color:#fff;font-size:13px;font-weight:700}  /* ✓ ! ✕ */
.st.ok{background:var(--ok)}.st.warn{background:var(--warn)}.st.bad{background:var(--bad)}
.bar{height:6px;border-radius:999px;background:var(--fill);overflow:hidden}
.bar i{display:block;height:100%;border-radius:999px;background:var(--primary);transition:width .7s var(--ease)}
/* a large verdict pill (e.g. a product rating) */
.verdict{margin:20px auto 0;width:fit-content;border-radius:999px;padding:12px 24px;font-size:19px;font-weight:700}
.verdict.ok{color:var(--ok);background:color-mix(in srgb,var(--ok) 14%,transparent)}
```

## 7. Cards grid

```css
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px}
.card{background:var(--card);border-radius:var(--r-lg);overflow:hidden;border:0;padding:0;text-align:left;display:flex;flex-direction:column;box-shadow:var(--shadow);transition:transform .3s var(--spring)}
.card img{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:var(--fill)}
.card .bd{padding:14px 16px 16px;display:flex;flex-direction:column;gap:6px;flex:1}
.card .nm{font-size:17px;font-weight:600;line-height:1.25;letter-spacing:-.01em;flex:1}
```
Photo on top edge to edge, bold name, one grey meta line, one status tag. Photos fade in when loaded (motion.md).

## 8. Hero number, ring, spec row

A single progress ring with a thin huge number inside, a bold one-liner under it, then a two- or four-column spec row
(keynote-style stats separated by hairlines).
```html
<div class="hero"><svg class="ring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52"/>
  <circle class="fg" cx="60" cy="60" r="52" pathLength="100" style="stroke-dashoffset:42"/></svg>
  <div class="hero-in"><b data-roll>1 180</b><span>iš 2 040 kcal šiandien</span></div></div>
<p class="hero-sub">Liko 860 kcal</p>
<div class="spec"><div><b>930</b><span>kcal iš meniu</span></div><div><b>250</b><span>iš 250 laisvų kcal</span></div></div>
```
```css
.hero{position:relative;width:min(240px,64vw);aspect-ratio:1;margin:4px auto 0}
.ring{display:block;width:100%;height:100%;transform:rotate(90deg)}  /* display:block, else an inline SVG gets a baseline gap and sits off-centre; +90°: starts at the bottom centre */
.ring circle{fill:none;stroke:var(--fill);stroke-width:10}
.ring .fg{stroke:var(--primary);stroke-linecap:round;stroke-dasharray:100;transition:stroke-dashoffset .9s var(--ease),stroke .3s}
.ring .fg.over{stroke:var(--bad)}
.hero-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.hero-in b{font-size:38px;font-weight:200;letter-spacing:-.045em;line-height:1;font-variant-numeric:tabular-nums}
.hero-in span{font-size:12px;color:var(--muted);margin-top:5px;max-width:96px}
.hero-sub{text-align:center;font-size:19px;font-weight:600;letter-spacing:-.01em;margin:14px 0 0}
.spec{display:grid;grid-template-columns:1fr 1fr;margin:28px 0 10px;border-top:1px solid var(--hair);padding-top:22px;text-align:center}
.spec div+div{border-left:1px solid var(--hair)}
.spec b{font-size:36px;font-weight:600;letter-spacing:-.03em;line-height:1;font-variant-numeric:tabular-nums}
.spec span{display:block;font-size:13px;color:var(--muted);margin-top:6px}
.macros{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--hair);padding-top:18px}  /* 4-up variant */
.macros div{text-align:center}.macros div+div{border-left:1px solid var(--hair)}
.macros b{display:block;font-size:28px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.macros span{font-size:12px;color:var(--muted)}
```
`pathLength="100"` makes `stroke-dashoffset` a plain percentage left. Use **one** ring; see commercial.md before
nesting rings.

A legend under the hero: label left, coloured value right, small round icon buttons (✎, +):
```css
.legend{margin:18px auto 0;max-width:320px}
.lg{display:flex;align-items:center;gap:10px;padding:7px 0;font-size:17px}
.lg+.lg{border-top:1px solid var(--hair)}
.lg span{flex:1;font-weight:600}
.lg b{font-weight:600;font-variant-numeric:tabular-nums}
.lg .pen{width:28px;height:28px;border-radius:50%;border:0;padding:0;background:var(--fill);color:var(--muted);display:grid;place-items:center}
```

## 9. Bottom sheet

```html
<div class="scrim"></div>
<div class="sheet"><div class="grab"><button class="x" aria-label="Uždaryti">✕</button></div>
  <div class="sp"><h3>Pridėti.</h3> … </div></div>
```
```css
.scrim{position:fixed;inset:0;background:var(--scrim);opacity:0;pointer-events:none;transition:opacity .4s;z-index:20}
.sheet{position:fixed;left:0;right:0;bottom:0;margin:0 auto;max-width:720px;max-height:calc(100% - env(safe-area-inset-top) - 12px);background:var(--bg);border-radius:var(--r-xl) var(--r-xl) 0 0;transform:translateY(105%);transition:transform .5s var(--ios);overflow-y:auto;overscroll-behavior:contain;z-index:21;padding-bottom:calc(24px + env(safe-area-inset-bottom))}
body.sheet-open .scrim{opacity:1;pointer-events:auto}
body.sheet-open .sheet{transform:none}
body.sheet-open{overflow:hidden}
.grab{position:sticky;top:0;height:0;z-index:2}
.grab::before{content:"";position:absolute;top:7px;left:50%;width:36px;height:5px;margin-left:-18px;border-radius:999px;background:var(--muted);opacity:.45}
.x{position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:50%;border:0;background:var(--fill);color:var(--muted);display:grid;place-items:center;transition:transform .3s var(--spring)}
.x.onimg{background:rgba(0,0,0,.35);color:#fff;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}  /* over a photo */
.sp{padding:22px 18px 0}
.sp h2{font-size:32px;font-weight:700;letter-spacing:-.03em;margin:6px 0 0;line-height:1.1}
.sp h3{font-size:28px;font-weight:700;letter-spacing:-.025em;margin:0;padding-right:44px;line-height:1.15}
.sheet .hero{width:100%;aspect-ratio:4/3;max-height:50vh;object-fit:cover;display:block}  /* product-page sheet: photo first */
```
Product-page sheet order: edge-to-edge photo → grey caption → big bold name → spec row → controls → list → steps →
one blue action. A sheet can open another and come back (keep a `back` reference) instead of stacking.

## 10. Big number input

```html
<div class="bigin"><input id="amt" type="number" inputmode="numeric" value="330"><span>ml</span></div>
<div class="quick"><button>+250</button>…</div><button class="btn wide">Pridėti</button>
```
```css
.bigin{display:flex;align-items:baseline;justify-content:center;gap:6px;margin:18px 0 22px}
.bigin input{width:190px;border:0;background:none;font-size:72px;font-weight:200;text-align:right;outline:none;letter-spacing:-.04em;padding:0;font-variant-numeric:tabular-nums;-moz-appearance:textfield;appearance:textfield}
.bigin input::-webkit-inner-spin-button,.bigin input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.bigin span{font-size:28px;font-weight:500;color:var(--muted)}
```
For decimals in locales with a comma, use `type="text" inputmode="decimal"` and parse `value.replace(',', '.')` —
`type=number` rejects "72,5" in some browsers.

## 11. Toast with undo

Top of the screen, dark tile (glass when Liquid Glass is on), auto-hides after ~3.5 s, swipe up to dismiss.
```css
.toast{position:fixed;left:16px;right:16px;top:calc(env(safe-area-inset-top) + 8px);max-width:420px;margin:0 auto;background:var(--tile);color:var(--on-tile);border-radius:18px;padding:14px 18px;display:flex;align-items:center;gap:12px;font-size:15px;z-index:70;transform:translateY(-24px) scale(.96);opacity:0;pointer-events:none;transition:transform .45s var(--spring),opacity .3s;touch-action:none;user-select:none}
.toast.show{transform:none;opacity:1;pointer-events:auto}
.toast span{flex:1}
.toast button{background:none;border:0;color:var(--tile-link);font-weight:600;font-size:15px;padding:0}
```
Every data-changing action snapshots state first and offers "Atšaukti"; undo restores the snapshot. Swipe: follow the
finger upward (a downward pull moves only 20 %), dismiss past −24 px, otherwise spring back; a drag must never count
as a tap on the undo button (swallow the click within ~400 ms of a drag). When resetting inline styles after a
swipe, clear `style.cssText` — leftover `opacity`/`transform` hides the next toast.

## 12. Alert

```html
<div class="alert-wrap"><div class="alert"><div class="ab"><b>Išvalyti planą?</b><p>Visi patiekalai bus pašalinti.</p></div>
  <div class="ac"><button>Atšaukti</button><button class="bad">Išvalyti</button></div></div></div>
```
```css
.alert-wrap{position:fixed;inset:0;background:var(--scrim);display:grid;place-items:center;z-index:101;opacity:0;pointer-events:none;transition:opacity .25s}  /* above every overlay */
.alert-wrap.show{opacity:1;pointer-events:auto}
.alert{width:280px;background:var(--card);border-radius:20px;text-align:center;overflow:hidden;transform:scale(1.1);transition:transform .4s var(--spring)}
.alert-wrap.show .alert{transform:none}
.alert .ab{padding:22px 18px 18px}.alert b{display:block;font-size:17px;font-weight:600}
.alert p{margin:6px 0 0;font-size:13px;color:var(--muted)}
.alert .ac{display:flex;border-top:1px solid var(--hair)}
.alert .ac button{flex:1;border:0;background:none;padding:13px;font-size:17px;color:var(--primary)}
.alert .ac button+button{border-left:1px solid var(--hair);font-weight:600}
.alert .ac button.bad{color:var(--bad)}
```
Use it as a promise: `confirmBox(title, msg, okLabel, destructive) → Promise<boolean>`. Never `window.confirm()`.
Keep its z-index above every full-screen overlay (onboarding, login), or the dialog opens hidden underneath.

## 13. Switch, round checkbox, radio

```css
.sw{appearance:none;-webkit-appearance:none;width:51px;height:31px;border-radius:999px;background:var(--fill);position:relative;flex:none;margin:0;transition:background .25s;cursor:pointer}
.sw::after{content:"";position:absolute;top:2px;left:2px;width:27px;height:27px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.18);transition:transform .35s var(--spring)}
.sw:checked{background:var(--ok)}
.sw:checked::after{transform:translateX(20px)}
/* round tick (shopping list): fills, then the row leaves */
.ck{width:28px;height:28px;border-radius:50%;border:1.5px solid var(--muted);flex:none;display:grid;place-items:center;color:#fff;transition:background .25s,border-color .25s,transform .3s var(--spring)}
.ck svg{opacity:0;transform:scale(.5);transition:opacity .2s,transform .3s var(--spring)}
.row.checked .ck{background:var(--primary);border-color:var(--primary);transform:scale(1.08)}
.row.checked .ck svg{opacity:1;transform:none}
.row.checked .grow{opacity:.4;text-decoration:line-through}
/* radio under a preview (theme picker) */
.rad{width:24px;height:24px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--muted);display:grid;place-items:center}
[aria-pressed="true"] .rad{background:var(--primary);box-shadow:none}
[aria-pressed="true"] .rad::after{content:"";width:6px;height:11px;margin-top:-3px;border:solid #fff;border-width:0 2.2px 2.2px 0;transform:rotate(45deg)}
```
A switch row: `<label class="row"><div class="grow"><div class="t">Title</div><div class="s">What it does</div></div><input type="checkbox" class="sw"></label>`.
Plain checkboxes (consent etc.): `accent-color:var(--primary)`, 22 px, and keep them out of any `flex:1` input rule
— a generic `.row input{flex:1;min-width:0}` squeezes a checkbox to 0 px wide.

## 14. Tab bar (frosted, without glass)

```html
<nav class="tabs"><div class="tabs-in" style="--i:0"><i class="tab-ind"></i>
  <button class="tab on"><svg>…</svg><span class="tl">Recipes</span></button>…</div></nav>
```
```css
nav.tabs{position:fixed;left:0;right:0;bottom:0;background:var(--bar);-webkit-backdrop-filter:saturate(180%) blur(24px);backdrop-filter:saturate(180%) blur(24px);padding:0 8px env(safe-area-inset-bottom);z-index:10}
nav.tabs::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:var(--hair)}
.tabs-in{position:relative;display:flex;max-width:560px;margin:0 auto}
.tab-ind{position:absolute;top:5px;bottom:3px;left:0;width:20%;border-radius:999px;background:color-mix(in srgb,var(--primary) 11%,transparent);translate:calc(var(--i) * 100%) 0;transition:translate .5s var(--ios)}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 0 7px;font-size:10px;font-weight:600;color:var(--muted);background:none;border:0;position:relative;z-index:1;transition:color .3s,transform .3s var(--spring)}
.tab:active{transform:scale(.92)}
.tab.on{color:var(--primary)}
.tab .bdg{position:absolute;top:3px;left:calc(50% + 6px);background:var(--badge);color:#fff;font-size:12px;font-weight:600;min-width:18px;height:18px;border-radius:999px;padding:0 5px;display:grid;place-items:center}
```
Position the indicator with the `translate` property, not `transform`: if you later animate `scale` on it (the liquid
stretch), a scale multiplies a transform's translation and tabs further right overshoot more. Width = 100% / tab count.
For the iOS 26 floating capsule that tucks on scroll, see liquid-glass.md.

## 15. Empty states, fields, step screens

```css
.empty{text-align:center;padding:64px 24px;color:var(--muted)}
.empty b{display:block;color:var(--ink);font-size:24px;font-weight:700;letter-spacing:-.02em;margin-bottom:8px}
.inp{width:100%;border:0;border-radius:999px;background:var(--card);padding:15px 20px;font-size:17px;outline:none;box-shadow:var(--shadow);transition:box-shadow .2s}
.inp:focus{box-shadow:0 0 0 3px color-mix(in srgb,var(--primary) 30%,transparent)}
```
Form fields as rows inside a `.list` (label left, borderless input right) read as iOS Settings. Multi-step flows
(onboarding, setup): one question per screen, a thin progress bar on top (4 px, `--fill` track, `--primary` fill),
a huge title with a full stop, choices as rows with a blue ✓ on the chosen one, Atgal (grey `.fill`) + Toliau (blue)
at the bottom, Toliau disabled (opacity .4) until the step is valid. A warning under a choice is red text on a 10 %
red tint (`color-mix(in srgb,var(--bad) 10%,transparent)`), 14 px radius. Give the first step a quiet way out
(a `.link` "Atsijungti") so nobody is trapped.
