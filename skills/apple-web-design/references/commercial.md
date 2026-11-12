# Before selling an app in this style

Looking like Apple is not, by itself, a legal problem: copyright protects specific artwork, icons and text, not a
visual style, and the EU (CJEU C-393/09) only protects interface elements that are original rather than dictated by
function. Apple's real levers are trademarks, trade dress and — for App Store apps — the App Review Guidelines.
Not legal advice; have a lawyer check before launch. Checked 2026-10-18 (sources below).

Do these before a commercial / App Store release:

1. **No nested Activity-style rings.** App Review guideline 5.2.5: apps must not look confusingly similar to an Apple
   product or interface, and "If your app displays Activity rings, they should not visualize Move, Exercise, or Stand
   data in a way that resembles the Activity control." Use one progress ring; show other measures as bars or timelines.
2. **Don't name Apple fonts.** Remove `"SF Pro Text"` / `"SF Pro"` from font stacks: the SF license only covers
   mock-ups for Apple platforms. `-apple-system` / `system-ui` still give SF on Apple devices (the OS supplies it).
3. **No Apple names in your UI or marketing as comparisons** ("like iPhone", "Liquid Glass", "Apple Watch-style").
   Referential use is fine ("works with iPhone", "steps from Apple Health"). Never put Apple marks in the app's name or icon.
4. **Third-party data and images keep their licences.** Example: Open Food Facts is ODbL — credit it with links to the
   site and the licence wherever its data appears, and share back data you add. Unsplash photos are fine commercially.
5. **Guideline 4.2 (minimum functionality):** a wrapped website gets rejected unless it adds native value (HealthKit,
   native scanning, notifications…). **3.1.1:** paid features must use in-app purchase.
6. **Health data** (weight, calories, conditions) is special-category data under GDPR: explicit consent, privacy
   policy, export and deletion.

The reference app kept a personal copy with the full Apple look and made these changes in its commercial copy
which is a worked example of each point above.

Sources: App Store Review Guidelines (developer.apple.com/app-store/review/guidelines); Apple trademark guidelines
(apple.com/legal/intellectual-property/guidelinesfor3rdparties.html); Apple developer forums on SF font licensing;
Fieldfisher on CJEU C-393/09; Open Food Facts ODbL wiki.
