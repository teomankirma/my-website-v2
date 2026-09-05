# Redesign verification

Verified locally on September 4–5, 2026, using the production Next.js build and the in-app Chromium browser. The PR is for owner review; it has not been merged or manually deployed to production.

## Automated checks

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm test` — 4 tests passed: published hardware dimensions/panel ratio; 78 ANSI keys and arrow cluster; finite opening/showcase/closing poses; contact validation and length limits.
- `npm run build` — passed on Next.js 16.3.4 with no build warnings.
- `npm audit` — zero vulnerabilities, including development dependencies.
- `git diff --check` — passed.

## Browser checks

- Desktop 1440 × 900: opening, code typing, real project screens, closing/portrait, project gallery, biography, experience, contact, footer.
- Mobile 390 × 844 and 360 × 800: English/Turkish layout, story framing, portrait, navigation and biography. Also checked the header at 320 × 740. No document horizontal overflow.
- Both locales render their own copy, HTML language, canonical URL and social preview. No broken loaded images found.
- Chapter navigation reaches its correct scroll positions. The sticky stage stays at internal `scrollTop = 0` when buttons receive focus. `overflow: clip` prevents the earlier focus-induced vertical shift.
- Mobile menu opens, closes after a section link, and closes on Escape while returning focus to the menu button.
- Keyboard Tab exposes the skip link; Enter focuses the work section and places its top below the fixed header.
- Manual reduced motion removes the WebGL canvas and collapses the opening to one viewport; it persists after reload. The static posters were visually checked on desktop and mobile.
- Emulated OS reduced motion disables the manual override, shows the device-preference label, removes the canvas and reveals normal content.
- Simulated unavailable WebGL falls back to a loaded poster with a one-viewport hero. Remaining page sections continue working.
- Empty contact submission shows localized accessible errors. Intercepted HTTP 200 produces success feedback and clears the form; intercepted HTTP 500 produces failure feedback and preserves the message. **No test email was delivered.** Real EmailJS delivery was not exercised.
- No application errors in the browser logs. React Three Fiber currently emits an upstream `THREE.Clock` deprecation warning; this does not prevent rendering. Development-only Fast Refresh messages are absent from the production flow.

## Route and link checks

- `/` redirects to `/en` under the tested locale preference.
- `/en`, `/tr`, `/resume.pdf`, `/icon.svg`, `/robots.txt`, `/sitemap.xml`, and both localized OG images return HTTP 200.
- `/en/prototype` and `/tr/prototype` return HTTP 404, as intended after removal.
- Server HTML includes one H1, all five main sections, project content, biography and contact information before hydration. A noscript rule reduces the decorative opening to one viewport.
- All nine existing project URLs returned HTTP 200 when checked. No project destination was changed.

## Review screenshots

| View | Image |
| --- | --- |
| Opening | [Desktop opening](screenshots/01-opening.jpg) |
| Laptop / code | [MacBook chapter](screenshots/02-laptop.jpg) |
| Portrait | [Closing reveal](screenshots/03-portrait.jpg) |
| Work | [Selected projects](screenshots/04-work.jpg) |
| About | [Biography](screenshots/05-about.jpg) |
| Contact | [Contact section](screenshots/06-contact.jpg) |
| Mobile Turkish | [Mobile opening](screenshots/07-mobile-tr.jpg) |

## Practical limits

The MacBook panel/chassis use published dimensions; finer details and the decorative macOS interface are visual approximations. The current stable macOS and announced preview are distinguished in the design references. This is not a live desktop or an Apple-supplied CAD model.

Mobile testing used browser viewport emulation, not a physical iPhone or a low-power Android device. Rendering is demand-driven, DPR is capped, and reduced-motion/WebGL fallbacks are available, but physical-device performance and Safari should still be included in release review. No production merge or production deployment is authorized by these checks.
