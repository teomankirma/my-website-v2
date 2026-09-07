# Portfolio redesign

Authorized: full redesign, cleanup, verification, commit/push and a pull request. Do not merge.

## Direction

A near-black, cinematic portfolio with subtle charcoal section changes, off-white typography, muted gray supporting text, and restrained orange accents. The laptop uses neutral aluminum and white studio lighting; project images retain their original colors. English and Turkish remain first-class. Scrolling drives the story; no autoplay. A stable Animations On / Off switch and OS preference provide a static alternative. The header and center navigation are independently centered, including above the 1700px width cap.

## Hardware and screen references

- https://www.apple.com/macbook-pro/specs/ — current 14-inch M5 family, 312.6 × 221.2 × 15.5 mm chassis; 3024 × 1964 display at 254 ppi (302.4 × 196.4 mm), 78-key ANSI Magic Keyboard including 12 full-height function keys and Touch ID.
- https://www.apple.com/os/macos/ — macOS 27 Golden Gate preview as of September 2026. Use its refined translucent toolbar treatment as visual inspiration, not a claim to reproduce a running OS.
- Apple's keyboard, display, closed-lid and side-port reference images linked from its specifications page inform the custom geometry. The screen aspect and chassis proportions use published measurements. Bezel/keyboard details are visually matched approximations.
- Latest stable system: macOS Tahoe 26.6.2, per https://support.apple.com/en-us/109033. macOS 27 is a preview; use both as visual references.
- Apple logo vector: Simple Icons (CC0), retained as a single inline vector. Orient leaf toward the front edge on the closed lid, so the logo reads upright to someone facing the back of an open laptop.

## Implementation

1. Replace the older Touch Bar model with custom dimensioned geometry and an ANSI keyboard atlas aligned to actual key sizes.
2. Rework the macOS-style desktop, active-app menus, status icons, notch-safe spacing, Safari toolbar, window controls, and colorful code presentation. Preserve screenshot colors with unlit sRGB materials. Use a graphite desktop wallpaper and neutral window chrome.
3. Promote the scroll story into the homepage with a portrait reveal; build all remaining sections around the same dark art direction.
4. Preserve all nine project links, original biography, employment/education, résumé, contact validation and EmailJS integration.
5. Remove prototype route/folders, theme switching, unused components/assets/dependencies; update metadata/OG and repository docs.
6. Verify both locales, desktop/mobile, keyboard navigation, reduced motion, WebGL fallback, form validation, links, build and lint. Open a PR with screenshots and verification notes, leave unmerged.

## Rendering revision — September 7

The current React Three Fiber 9.7.0 still constructs deprecated THREE.Clock internally. This scroll-only scene now uses a directly owned Three.js renderer and one-shot requestAnimationFrame invalidation. No time accumulator is required. Three.js and its type definitions remain current; no warning is hidden and no dependency is downgraded. Fiber/drei and 47 now-unused packages are removed. Resources, pending frames, observers and listeners are released on teardown; unavailable or lost WebGL still falls back to the static poster.

Upstream reference: https://github.com/pmndrs/react-three-fiber/issues/3741
