# Keynote mode: one special screen in black

For a single screen that should feel like an Apple keynote slide — a launch screen, a "mode" (party, focus, workout),
a big announcement. The rest of the app stays daytime. In the reference app this is "Balius." (party mode).

**Rules:** pure black page, one hero at a time, huge type, lots of air, **one** gradient that belongs to this screen
only (never reused in the daytime UI), dark `#1d1d1f` tiles, white text, grey `#86868b` secondary, blue pills for
actions. The screen has its own palette variables scoped to its container so it looks the same in light and dark mode.

```css
#mode{--b-tile:#1d1d1f;--b-ink:#f5f5f7;--b-mute:#86868b;--b-hair:rgba(255,255,255,.1);--b-blue:#0071e3;--b-link:#2997ff;
  --b-grad:linear-gradient(90deg,#FF3E8A,#FF9F45 45%,#B76BFF 90%);
  position:fixed;inset:0;z-index:55;overflow-y:auto;overscroll-behavior:contain;background:#000;color:var(--b-ink);padding-bottom:calc(30px + env(safe-area-inset-bottom))}
.k-top{position:relative;text-align:center;padding:calc(env(safe-area-inset-top) + 64px) 16px 0;max-width:640px;margin:0 auto}
/* the name: 64 px, the gradient sweeps across once as it appears */
.k-name{font-size:64px;line-height:1.05;font-weight:700;letter-spacing:-.035em;margin:0;
  background:var(--b-grad) 0 0/200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sheen 1.8s cubic-bezier(.3,0,.2,1) both}
@keyframes sheen{from{background-position:100% 0}to{background-position:0 0}}
.k-tag{font-size:24px;line-height:1.2;font-weight:600;letter-spacing:-.01em;margin:8px 0 0}
.k-big{display:block;font-size:72px;line-height:1;font-weight:200;letter-spacing:-.03em;font-variant-numeric:tabular-nums}  /* a countdown or a headline number */
.k-stats{display:grid;grid-template-columns:repeat(3,1fr);margin:48px 0 0;border-top:1px solid var(--b-hair);padding-top:28px}
.k-stats div+div{border-left:1px solid var(--b-hair)}
.k-stats b{display:block;font-size:40px;line-height:1;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.k-stats span{display:block;font-size:13px;line-height:1.3;color:var(--b-mute);margin-top:8px}
/* sticky dark segmented control with a white sliding pill */
.k-seg{position:sticky;top:calc(env(safe-area-inset-top) + 10px);z-index:2;display:grid;grid-template-columns:repeat(3,1fr);margin:40px auto 0;max-width:360px;padding:3px;border-radius:999px;
  background:rgba(40,40,42,.72);-webkit-backdrop-filter:saturate(1.8) blur(20px);backdrop-filter:saturate(1.8) blur(20px);box-shadow:inset 0 0 0 1px var(--b-hair)}
.k-seg button{position:relative;z-index:1;border:0;background:none;border-radius:999px;padding:9px 0;font-size:15px;font-weight:600;color:var(--b-ink)}
.k-seg .on{color:#000}
.k-thumb{position:absolute;top:3px;bottom:3px;left:3px;width:calc((100% - 6px) / 3);border-radius:999px;background:var(--b-ink);transform:translateX(calc(var(--i) * 100%));transition:transform .45s cubic-bezier(.3,1.25,.4,1)}
/* a section: a hero image that melts into the black, a 40 px head, a grey lede, then dark tiles */
.k-hero{display:block;width:calc(100% + 32px);margin:0 -16px;aspect-ratio:10/7;object-fit:cover;
  -webkit-mask-image:radial-gradient(75% 70% at 50% 48%,#000 60%,transparent);mask-image:radial-gradient(75% 70% at 50% 48%,#000 60%,transparent);opacity:0;transition:opacity .6s}
.k-hero.ok{opacity:1}
.k-h{font-size:40px;line-height:1.1;font-weight:700;letter-spacing:-.025em}
.k-hs{font-size:19px;line-height:1.35;color:var(--b-mute);margin:8px auto 24px;max-width:420px}
.k-item{background:var(--b-tile);border-radius:20px;padding:20px}
.k-add{border:0;border-radius:999px;padding:8px 18px;background:var(--b-blue);color:#fff;font-size:15px;font-weight:600;min-width:96px}
.k-add.has{background:var(--b-ink);color:#1d1d1f}   /* after adding: "2 ×" in a white pill */
/* a gradient-bordered call-out tile */
.k-cta{display:block;width:100%;border-radius:20px;padding:30px 20px;text-align:center;color:var(--b-ink);
  background:linear-gradient(#000,#000) padding-box,var(--b-grad) border-box;border:1.5px solid transparent}
.k-foot{font-size:13px;line-height:1.5;color:var(--b-mute);text-align:center;margin:28px 0 0}   /* a wry Apple-style sign-off line */
@media (prefers-reduced-motion:reduce){.k-name{animation:none}}
```
Entry: the whole screen fades and scales in from .96. A small floating "+92 kcal" label can rise from a tapped button
and fade (fixed position, `text-shadow` for contrast). Hero images: product-style renders on pure black (the reference
app used Blender renders), masked with a radial gradient so their edges dissolve into the page.

A matching banner can link back to the screen from the daytime UI: a black rounded bar with the screen's name in the
gradient (text clip) and a thin live number on the right.

Gestures that feel like setting up an Apple device suit an "arming" step before such a screen: slide to unlock
(a shimmering label in a frosted track, a white knob), a circle traced with a finger, a Touch-ID-style hold where a
fingerprint fills in a neon colour, then a 3-2-1. Keep each step skippable on Reduced Motion.
