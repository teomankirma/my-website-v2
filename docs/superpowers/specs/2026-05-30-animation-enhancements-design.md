# Animation Enhancements — Design Spec

**Date:** 2026-05-30
**Status:** Approved
**Author:** Teoman Kırma (with Claude)
**Branch:** `redesign/dark-technical`
**Builds on:** `2026-05-30-portfolio-redesign-design.md` (the shipped redesign)

## 1. Goal

Make the portfolio's motion **continuous and noticeably more alive** while staying refined. Today the hero load reveal and all scroll reveals fire **once** and never replay; only the skills marquee and portfolio pan are continuous. This adds: re-triggering reveals, animated stat counters, heading text reveals, magnetic/hover micro-interactions, and scroll parallax — all reduced-motion safe.

**Design dials:** `MOTION_INTENSITY` raised from 7 → ~8 ("lively but refined"). `DESIGN_VARIANCE` / `VISUAL_DENSITY` unchanged.

## 2. Scope (resolved during brainstorming)

| Decision | Choice |
|---|---|
| "Continuous" reveals | **Re-trigger on scroll** (`toggleActions: "play none none reverse"`) — play on enter, reverse on scroll-back, replay each pass |
| Animated stat counters | **Yes** (About stats) |
| Heading text reveals | **Yes** (SplitText word stagger on section headings) |
| Magnetic / hover micro-interactions | **Yes** (magnetic CTAs, card tilt, nav underline + active highlight) |
| Parallax depth on scroll | **Yes** (scrubbed) |
| Ambient/idle looping motion | **No** (not selected; parallax provides on-scroll hero motion) |
| Intensity | **Noticeably lively but refined** |
| Reduced-motion | **Mandatory** — every effect degrades to instant/static |

## 3. Non-goals

- No new dependencies (GSAP 3.13 + `@gsap/react` already installed; ScrollTrigger + SplitText already registered in `lib/gsap.ts`).
- No idle/looping ambient motion (glow pulse, float) — explicitly out.
- No changes to the marquee or portfolio horizontal-pan (already continuous).
- No content, layout, i18n, or routing changes.
- No custom cursor (AI-tell / a11y-hostile).

## 4. Architecture

Reusable animation primitives + small hooks; each section opts in. All run inside `useGSAP` with scoped refs and a shared reduced-motion gate. No global animation controller.

```
src/lib/animation/
  use-magnetic.ts        # magnetic cursor-follow hook (gsap.quickTo + contextSafe)
  use-tilt.ts            # 3D tilt-toward-cursor hook (pointer-only)
src/components/common/
  reveal.tsx             # MODIFIED: toggleActions replay instead of once
  section-header.tsx     # MODIFIED: SplitText word-stagger reveal (re-triggering)
  counter.tsx            # NEW: count-up number, ScrollTrigger, re-triggers
  magnetic-button.tsx    # NEW: thin wrapper applying useMagnetic to a shadcn Button/child
```

### 4.1 Reduced-motion gate (shared rule)

Every animated unit wraps its GSAP work in `gsap.matchMedia()` keyed on `(prefers-reduced-motion: no-preference)` (the pattern already used across the app). When reduced motion is preferred:
- Reveals/headings render in final visible state (no `from`).
- Counters render the final number immediately.
- Magnetic / tilt / parallax handlers are not attached.

Hooks (`useMagnetic`, `useTilt`) early-return when `window.matchMedia('(prefers-reduced-motion: reduce)').matches` OR when the pointer is coarse (touch) — `(pointer: fine)` check.

## 5. Per-effect design

### 5.1 Re-triggering reveals (`reveal.tsx`)
- Replace `scrollTrigger: { ..., once: true }` with `toggleActions: "play none none reverse"` and remove `once`.
- Keep `start: "top 80%"`. Add `end: "bottom 20%"` so the reverse has a sensible boundary.
- Behavior: element animates in on enter; when the user scrolls back up past it, it reverses out; re-entering replays. Refined (smooth reverse), not a hard re-hide on every pixel.
- `variant`, `stagger`, `delay`, `as` props unchanged. Used by About, Resume, Contact — all inherit replay automatically.

### 5.2 Stat counters (`counter.tsx`)
- New `'use client'` `<Counter value={number} suffix?="+" className?=… durationMs?=… />`.
- Implementation: `gsap.from`-style proxy tween — `gsap.to({n: 0}, { n: value, duration: 1.2, ease: 'power2.out', snap: { n: 1 }, onUpdate })` writing `Math.round` to the element's text; driven by a ScrollTrigger on the element with `toggleActions: "play none none reset"` so it re-counts on re-entry (reset to 0 on leave-back, replays on re-enter).
- About section swaps the two static numbers (`{EXPERIENCE_YEARS}+`, `{projectsNumber}+`) for `<Counter value={EXPERIENCE_YEARS} suffix="+" />` and `<Counter value={Number(projectsNumber)} suffix="+" />`. Mono styling preserved.
- Reduced motion: render `value + suffix` directly.

### 5.3 Heading text reveals (`section-header.tsx`)
- `SectionHeader` becomes a `'use client'` component that runs `SplitText` (type: `words`) on its `h2` and animates `words` with `y`/`autoAlpha` stagger via ScrollTrigger `toggleActions: "play none none reverse"`.
- `SplitText.revert()` in cleanup; re-split safe. Keep the existing `h2` classes (`text-3xl md:text-4xl font-bold tracking-tight`).
- Applies to About, Resume, Portfolio, Contact headings. (Hero already has its own SplitText.)
- Reduced motion: no split, heading static.

### 5.4 Magnetic CTAs (`use-magnetic.ts` + `magnetic-button.tsx`)
- `useMagnetic(ref, { strength = 0.35, max = 8 })`: on `pointermove` over the element, `gsap.quickTo` the element's `x`/`y` toward the cursor offset (clamped to `max` px); on `pointerleave`, `quickTo` back to 0. Created inside `useGSAP`/`contextSafe`; listeners removed in cleanup. Skips when reduced-motion or coarse pointer.
- `<MagneticButton>` renders its child (a shadcn `Button` via `asChild`/ref) with the hook applied.
- Applied to: hero "Get in touch" + "Download résumé" CTAs, and the contact "Send message" button. Capped pull ~8px + slight press feedback on `:active` (existing).

### 5.5 Portfolio card tilt (`use-tilt.ts`)
- `useTilt(ref, { max = 6 })`: on `pointermove`, compute normalized cursor position within the card and `gsap.quickTo` `rotateX`/`rotateY` (±max deg) + small `scale`; reset on leave. `transform-style: preserve-3d`, `perspective` on the card. Pointer-only, reduced-motion safe.
- Applied to each portfolio project card (the `DialogTrigger` button). Combines with the existing hover lift/border-glow.

### 5.6 Nav underline + active-section highlight (`header.tsx`)
- Desktop nav links: animated underline on hover/focus (CSS `scaleX` from-left transition — no JS needed; refined).
- Active-section highlight: one ScrollTrigger per section (or a single observer) toggles an `data-active` attribute on the matching nav link as each section enters; active link shows the underline + `text-foreground`. Reduced-motion: highlight still works (it's a state, not motion), underline transition disabled.

### 5.7 Parallax depth (`hero.tsx` + section backgrounds)
- Hero: scrubbed ScrollTrigger (`start: "top top"`, `end: "bottom top"`, `scrub: 1`) moves `.dot-grid` and the emerald glow by a small `yPercent`/`y` (slower than content) — depth as the hero scrolls away.
- Section headings (`SectionHeader`) get an optional subtle `y` parallax (scrubbed) so they drift slightly relative to body content. Kept small to avoid jank.
- Reduced motion / mobile: parallax disabled (mobile via matchMedia `(min-width: 768px)` to protect perf).

## 6. Files touched

| File | Change |
|---|---|
| `src/lib/gsap.ts` | (verify) export helpers; reduced-motion already handled per-component |
| `src/lib/animation/use-magnetic.ts` | NEW hook |
| `src/lib/animation/use-tilt.ts` | NEW hook |
| `src/components/common/reveal.tsx` | replay via toggleActions |
| `src/components/common/section-header.tsx` | SplitText heading reveal + optional parallax; becomes client |
| `src/components/common/counter.tsx` | NEW count-up |
| `src/components/common/magnetic-button.tsx` | NEW wrapper |
| `src/components/sections/about.tsx` | use `<Counter>` for stats |
| `src/components/sections/hero.tsx` | magnetic CTAs + hero parallax |
| `src/components/sections/portfolio.tsx` | card tilt |
| `src/components/sections/contact.tsx` | magnetic submit |
| `src/components/sections/header.tsx` | nav underline + active highlight |

## 7. Success criteria

- `npx tsc --noEmit`, `npm run build`, `npm run lint` all clean.
- Reveals replay when scrolling a section out and back in (verified in browser, EN + TR).
- Stat counters animate 0→value on entry and re-count on re-entry.
- Section headings animate word-by-word on entry; replay on re-entry.
- Hero CTAs + contact submit have a subtle magnetic pull (desktop, fine pointer only); portfolio cards tilt toward cursor.
- Nav underline animates on hover; active link tracks the scrolled section.
- Hero glow/dot-grid parallax visibly lags content on scroll (desktop).
- With `prefers-reduced-motion: reduce`: NO magnetic/tilt/parallax, counters show final value, reveals + headings render static. Verified via DevTools emulation.
- 60fps target; only `transform`/`opacity` (and `rotateX/Y`) animated; no `window.addEventListener('scroll')` for animation (ScrollTrigger only).

## 8. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Re-triggering reveals feel distracting | `play none none reverse` (smooth reverse, not re-hide); `start: top 80%` so it only reverses well above viewport |
| Magnetic/tilt jank on mobile | Pointer-only (`(pointer: fine)`) + reduced-motion guard; not attached on touch |
| SplitText reflow / re-split on resize | `SplitText.revert()` in cleanup; matchMedia re-runs cleanly |
| Parallax causing layout shift / scroll jank | `transform` only, `scrub` smoothing, desktop-only, small magnitudes |
| Heading SplitText breaking i18n strings | SplitText operates on rendered text nodes; works for EN + TR; revert restores original DOM |
| Counter showing wrong value under reduced motion | Explicit branch renders `value + suffix` directly |

## 9. Open questions (defer to plan)

- Exact magnitudes (magnetic `max`, tilt `max`, parallax `yPercent`) — start with the spec defaults, tune during browser verification.
- Whether the contact submit should be magnetic while disabled (lean: no magnetic until enabled/valid).
