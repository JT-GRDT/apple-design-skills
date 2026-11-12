# Review checklist

Run through this before calling a screen done. Look at real screenshots — most problems in this style are visual
(a gap, a grey that disappears on glass, a number that jumps), and code review misses them.

## Screenshots

Capture every screen and sheet at iPhone size (390 × 844, deviceScaleFactor 2) in **light and dark**, then look at
each one. With Playwright (`playwright-core` + installed Edge/Chrome, no browser download needed):
```js
const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ channel: 'msedge' });   // or 'chrome'
  for (const colorScheme of ['light', 'dark']) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme, isMobile: true, hasTouch: true })).newPage();
    await p.goto('http://localhost:8787/'); await p.waitForTimeout(1200);
    await p.screenshot({ path: `shot-${colorScheme}-home.png` });
    // …navigate / open sheets, one screenshot each
  }
  await b.close();
})();
```
Also run once with `reducedMotion: 'reduce'` in the context options: everything must still work and nothing animates.

## Look

- [ ] One blue primary action per screen/sheet; everything else grey pills, links or rows.
- [ ] Titles end with a full stop; section heads are two-tone; no ALL CAPS, no exclamation marks.
- [ ] Big numbers are thin and tabular; they don't shift width while changing.
- [ ] Tiles have no borders; separators are inset hairlines; spacing (not lines) separates sections.
- [ ] Dark mode: true black page, `#1d1d1f` tiles, no shadows, blue is `#2997ff`, nothing unreadable.
- [ ] Status colours only where they mean something; any extra hue labels one kind of data consistently.
- [ ] Text on glass is full ink; content tiles are solid.
- [ ] Nothing hides behind the tab bar (bottom padding ≥ 110 px + safe area); safe areas respected at top and bottom.
- [ ] Touch targets ≥ 44 px; small round buttons have an `aria-label`.
- [ ] Long words and long numbers fit at 390 px (Lithuanian words are long: test the longest labels).

## Feel

- [ ] Every tap gives feedback (press scale or row highlight) within one frame.
- [ ] Re-renders are morphs: scroll position, focus and typed text survive a background sync.
- [ ] Rows that appear/disappear/move have stable `data-key`s and animate; nothing jumps.
- [ ] Each tab keeps its own scroll position; tapping the active tab scrolls to the top.
- [ ] Sheets spring up and close by ✕, scrim tap and swipe down; page scroll is locked behind them.
- [ ] Every destructive or data-changing tap can be undone from the toast; confirmations use the in-app alert.
- [ ] Overlays stack correctly: alerts above everything (including full-screen onboarding/login).
- [ ] Gestures: a drag never counts as a tap; vertical moves scroll.
- [ ] Reduced Motion: no transitions or keyframes, and the UI still works.
- [ ] No console errors.

## Writing

- [ ] Button labels are verbs; captions say what happens ("Produktai bus atimti iš šaldytuvo").
- [ ] Numbers use the locale (`toLocaleString('lt-LT')`: "2 040", "4,1 l"); compare screenshots/tests after
      normalising spaces (Lithuanian uses a no-break space in thousands).
- [ ] Errors say what to do next.
