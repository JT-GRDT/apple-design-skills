---
name: apple-web-design
description: >-
  Apple.com / iOS 26 look and feel for web apps (plain HTML/CSS/JS, PWAs, Cloudflare Workers sites, Capacitor-wrapped
  apps), distilled from a shipped iPhone-first app: Apple daytime tokens with automatic dark mode, huge keynote titles
  with full stops, two-tone section heads, borderless tiles, blue pill buttons, sliding pill switchers, a frosted or
  Liquid Glass tab bar that tucks on scroll, bottom sheets, toasts, iOS alerts and switches, thin big numbers, and
  in-place motion (morph, FLIP, number roll, springy presses, haptic ticks) that respects Reduced Motion. Use this skill
  whenever the user wants a web UI to look or feel like Apple, iPhone, iOS or Apple.com, mentions Liquid Glass, keynote
  style, "make it look like Apple", or asks to polish, redesign or build screens for a web or
  PWA app in that style — even if they don't say "Apple". For React Native / Expo apps use apple-design-system instead.
---

# Apple web design

A design language for web apps that should feel like a native iPhone app or an Apple.com product page. It was built,
tested on real iPhones and refined screen by screen in a shipped meal-planner app,
whose single `index.html` was the reference implementation). Everything here is plain CSS and vanilla JS, no framework or
library, so it drops into any project.

The goal is one quiet product, end to end: light grey page, white tiles, one blue accent, big confident type, and every
tap answered by motion in place. Nothing jumps, nothing re-renders the whole screen, typed text and scroll position are
never lost.

## How to use this skill

1. **New UI:** paste `references/tokens.css` into the page first. Then build screens from the component recipes in
   `references/components.md`. Add `assets/morph.js` and the motion layer from `references/motion.md` if the UI
   re-renders from state.
2. **Existing UI:** keep the project's structure and data. Swap colours, type and shapes to the tokens, then convert
   components one by one. Don't rewrite logic to restyle it.
3. **Glass:** read `references/liquid-glass.md` only when the user wants Liquid Glass / iOS 26 glass (tab bar, floating
   buttons, toasts, sheet buttons).
4. **Dark showcase screens** (a launch screen, a "mode" like a party or focus screen): `references/keynote.md`.
5. **Before calling it done:** run `references/checklist.md` — screenshots in light and dark at 390×844.
6. **If the app will be sold** (App Store or commercially): read `references/commercial.md` first. Some of the most
   Apple-looking details are the ones Apple objects to.

Read only the references you need; each is self-contained.

## The core rules (why they matter)

**Colour: one accent, used sparingly.** Page `#f5f5f7`, tiles `#fff`, ink `#1d1d1f`, secondary `#6e6e73`, action blue
`#0071e3` (dark: `#000` / `#1d1d1f` / `#f5f5f7` / `#86868b` / `#2997ff`). Blue means "you can act here", so it goes on
primary buttons, links, the selected tab and progress — nowhere decorative. Status colours (`--ok` green, `--warn`
amber, `--bad` red) only ever carry meaning. Extra hues (water cyan, steps orange) are allowed when they label one kind
of data consistently everywhere it appears. A brand gradient, if any, belongs to one special screen only.

**Dark mode follows the phone.** Every colour is a CSS variable redefined under `prefers-color-scheme: dark`. Dark is
true black pages with `#1d1d1f` tiles, and shadows switch off (`--shadow:none`) because they read as dirt on black.

**Type does the hierarchy, not boxes.** System font stack (`-apple-system, BlinkMacSystemFont, system-ui, sans-serif`,
which gives SF on Apple devices), 17 px body, tight negative letter-spacing on anything large:
- Page titles 40–48 px bold, −0.035em, **with a trailing full stop**: "Recipes." — the Apple.com headline voice.
- Two-tone section heads, 24 px bold: the first phrase in ink, the rest grey: "**Pirkiniai.** <grey>Trūksta 15 produktų.</grey>".
  Both parts end with a full stop.
- Big numbers are thin (weight 200–300) and huge (38–72 px) with `font-variant-numeric: tabular-nums` so digits don't
  jitter while they change. Smaller stat numbers (spec rows) are 600.
- Captions 13–14 px grey. Don't go below 12 px.

**Shapes: borderless tiles, pills, generous space.** Radii 8 / 14 / 22 / 28 px; tiles have no borders and a very soft
shadow (`0 4px 18px rgba(0,0,0,.06)`). Rows inside a tile are separated by a hairline that starts at the text, not the
edge (iOS inset separator). Buttons are pills (`border-radius: 999px`): primary solid blue with white text, secondary
grey-fill with blue text, destructive grey-fill with red text. Photos run edge to edge inside their tile.

**Layout: one column, phone first.** `max-width: 720px` centred, 16 px side gutters, safe-area insets on every fixed
edge (`env(safe-area-inset-*)`), 110 px bottom padding so content clears the tab bar. Touch targets ≥ 44 px.

**Motion: everything moves in place.** Re-render with a DOM morph instead of `innerHTML` so nodes survive; new rows
grow in, removed rows leave as a fading ghost, moved rows glide (FLIP), changed numbers roll, pills slide, sheets spring
up, buttons press in (scale .96, spring curve). Two curves cover almost everything:
`--spring: cubic-bezier(.3,1.4,.5,1)` (presses, small pops) and `--ease: cubic-bezier(.2,.8,.2,1)` (fades, bars);
iOS's own `cubic-bezier(.32,.72,0,1)` (no overshoot) for sheets and big moves. All of it switches off under
`prefers-reduced-motion: reduce` — check it, don't assume.

**Copy: short, human, Apple-voiced.** Titles with full stops, verbs on buttons ("Pagaminau", "Pridėti"), numbers formatted
for the locale (`toLocaleString(lang)`; Lithuanian uses spaces in thousands and a decimal comma), no exclamation marks,
no emoji in chrome (emoji are fine as content icons, e.g. 🍸 for a drink entry). Error text says what to do next.

## Decisions already made (don't relitigate)

These came out of real feedback while building the reference app:
- The primary blue action stays **solid blue** even inside glass UIs — tinted-glass blue buttons were tried and rejected.
- Liquid Glass is **on by default** but user-switchable, with a strength slider; content cards stay solid so text stays
  readable. Glass is for floating chrome only.
- Recipe/product photos are the imagery; no illustrations or stock-y decorations.
- iOS 26 behaviour wins when in doubt: tab bar floats as a capsule and tucks into a small button when scrolling down;
  glass swells (scale up) under the finger instead of sinking.
- Each tab remembers its own scroll position; tapping the active tab scrolls to top.
- A toast can be swiped up to dismiss and has an Atšaukti / Undo action for every destructive or data-changing tap.

## Files

- `references/tokens.css` — the complete token block (light + dark, radii, shadows, curves). Paste as-is.
- `references/components.md` — copy-paste HTML + CSS for every component, with notes on behaviour.
- `references/motion.md` — the animation helper, morph hooks, FLIP, number roll, tab switch, sheets, swipe and hold
  gestures, haptic tick, reduced motion.
- `references/liquid-glass.md` — the iOS 26 glass material, the Chromium refraction lens, the tucking tab bar.
- `references/keynote.md` — the black "keynote" style for one special screen.
- `references/checklist.md` — review checklist and a screenshot script.
- `references/commercial.md` — what to change before selling an app in this style.
- `assets/morph.js` — the 70-line DOM morph (keyed rows, focus- and typing-safe, falls back to innerHTML).
