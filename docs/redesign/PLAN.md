# Portfolio redesign

Authorized: full redesign, cleanup, verification, commit/push and a pull request. Do not merge.

## Direction

A vivid cobalt opening, neutral silver MacBook hardware, violet project chapters, a coral portrait reveal, spacious project stories, a lavender personal section, a dark violet experience section, and an electric-blue contact finish. English and Turkish remain first-class. Scrolling drives the story; no autoplay. A global reduced-motion toggle and OS preference provide a static alternative.

## Hardware and screen references

- https://www.apple.com/macbook-pro/specs/ — current 14-inch M5 family, 312.6 × 221.2 × 15.5 mm chassis; 3024 × 1964 display at 254 ppi (302.4 × 196.4 mm), 78-key ANSI Magic Keyboard including 12 full-height function keys and Touch ID.
- https://www.apple.com/os/macos/ — macOS 27 Golden Gate preview as of September 2026. Use its refined translucent toolbar treatment as visual inspiration, not a claim to reproduce a running OS.
- Apple's keyboard, display, closed-lid and side-port reference images linked from its specifications page inform the custom geometry. The screen aspect and chassis proportions use published measurements. Bezel/keyboard details are visually matched approximations.
- Latest stable system: macOS Tahoe 26.6.2, per https://support.apple.com/en-us/109033. macOS 27 is a preview; use both as visual references.
- Apple logo vector: Simple Icons (CC0), retained as a single inline vector. Orient leaf toward the front edge on the closed lid, so the logo reads upright to someone facing the back of an open laptop.

## Implementation

1. Replace the older Touch Bar model with custom dimensioned geometry and an ANSI keyboard atlas aligned to actual key sizes.
2. Rework the macOS-style desktop, active-app menus, status icons, notch-safe spacing, Safari toolbar, window controls, and colorful code presentation. Preserve screenshot colors with unlit sRGB materials.
3. Promote the scroll story into the homepage with a portrait reveal; build all remaining sections around the same art direction.
4. Preserve all nine project links, original biography, employment/education, résumé, contact validation and EmailJS integration.
5. Remove prototype route/folders, theme switching, unused components/assets/dependencies; update metadata/OG and repository docs.
6. Verify both locales, desktop/mobile, keyboard navigation, reduced motion, WebGL fallback, form validation, links, build and lint. Open a PR with screenshots and verification notes, leave unmerged.
