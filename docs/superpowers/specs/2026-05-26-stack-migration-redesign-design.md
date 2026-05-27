# Stack Migration & Redesign — Design Spec

**Date:** 2026-05-26
**Status:** Approved (design); pending implementation plan
**Author:** Teoman Kırma (with Claude)

## 1. Goal

Migrate `my-website-v2` (personal portfolio) from HeroUI + Motion to **shadcn/ui + GSAP** while **redesigning** the site for a modern, dark/dev-focused aesthetic. Bump React/Vite/Tailwind to current versions. Keep the single-page scrolling structure and the EN/TR internationalization.

This is a "swap + redesign" — sections may look meaningfully different from the current site. Look-and-feel parity is **not** a requirement.

## 2. Non-goals

- Multi-page routing (stays single-page).
- Switching state management away from Zustand.
- Replacing EmailJS, react-hook-form, or Zod.
- Server rendering or framework change (Vite SPA remains).
- A test framework (none currently configured; not added now).
- New i18n languages beyond EN/TR.
- Replacing the `usePageMeta` hook, `toSectionHref` util, or `useAppStore` shape (`language`, `isMenuOpen`, `email`).

## 3. Scope decisions (resolved during brainstorming)

| Question | Decision |
|---|---|
| Migration goal | Tech swap + full redesign |
| Aesthetic | Dark/dev-focused (GitHub redesign, shadcn site, Resend vibe) |
| Page structure | Single-page scroll |
| Typewriter in hero | **Drop** (replace with GSAP SplitText reveal) |
| Testimonials section | **Drop entirely** (was dummy data) |
| Skills grid | Rework as horizontal infinite marquee (GSAP) |
| Other sections | Keep (KnowMeMore, Resume, Portfolio, Contact) but restyled |
| Theme toggle | Keep light / dark / system |
| EN/TR i18n | Keep + LanguageSwitcher |
| Toast library | **Sonner** (replaces HeroUI `addToast`) |
| Migration sequencing | Phased branches, one foundation PR + per-section PRs |
| Migration approach | **A — Strip & Rebuild** (each PR fully replaces a section with new components + GSAP + redesigned look) |

## 4. Architecture

### 4.1 Dependency changes

**Add (latest stable):**

- `gsap`, `@gsap/react` — animations (GSAP 3.13+ ships SplitText/ScrollTrigger/etc. free).
- `sonner` — toasts.
- `next-themes` — theme provider (works in Vite/React, despite the name).
- `lucide-react` — icons.
- `@fontsource-variable/geist`, `@fontsource-variable/geist-mono` — bundled fonts (no external fetch).
- `class-variance-authority`, `clsx`, `tailwind-merge` — shadcn dependencies pulled in by `shadcn init`.
- `tw-animate-css` — animation utilities shadcn requires for Tailwind v4.
- Radix primitives pulled in transitively by each `npx shadcn@latest add <component>` call.

**Bump:**

- `react`, `react-dom` → React 19 latest.
- `vite` → Vite 7 latest.
- `@vitejs/plugin-react-swc` → latest.
- `tailwindcss`, `@tailwindcss/vite` → Tailwind v4 latest.
- `typescript` → ~5.8 latest patch.
- `@types/react`, `@types/react-dom`, `@types/node` → matching latest.
- ESLint + plugins → latest.

**Remove:**

- `@heroui/react`, `@heroui/use-theme`
- `motion`, `framer-motion`
- `react-simple-typewriter`
- `react-slick`, `@types/react-slick` (currently installed but unused — confirmed via grep)
- `hero.ts` (file)
- Font Awesome `<script>` in `index.html` (icons move to `lucide-react`)

**Kept untouched:**

- `zustand`, `@emailjs/browser`, `luxon`, `react-hook-form`, `@hookform/resolvers`, `zod`.

### 4.2 Folder structure

```
src/
├── App.tsx
├── main.tsx
├── index.css                          # Tailwind v4 entry + theme tokens
├── lib/
│   ├── utils.ts                       # shadcn cn() helper
│   └── gsap.ts                        # plugin registration + facade
├── components/
│   ├── ui/                            # shadcn primitives (button, card, dialog, …)
│   ├── sections/                      # one file per page section
│   │   ├── Header.tsx
│   │   ├── Hero.tsx                   # renamed from Home.tsx
│   │   ├── About.tsx                  # renamed from KnowMeMore.tsx
│   │   ├── Resume.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Contact.tsx                # renamed from ContactMe.tsx
│   │   └── Footer.tsx
│   ├── common/
│   │   ├── Animations.tsx             # GSAP <Reveal>
│   │   ├── SectionHeader.tsx
│   │   ├── PageSection.tsx
│   │   ├── ThemeSwitcher.tsx          # next-themes + shadcn DropdownMenu
│   │   ├── LanguageSwitcher.tsx       # shadcn DropdownMenu
│   │   ├── DownloadResumeButton.tsx
│   │   ├── PortfolioCard.tsx
│   │   ├── SkillsMarquee.tsx          # new
│   │   └── index.ts                   # barrel
│   └── index.ts                       # barrel
├── hooks/                             # unchanged: useAppStore, usePageMeta
├── i18n/                              # unchanged (minus testimonial keys)
├── schemas/                           # unchanged
├── types/                             # adjusted (drop testimonial type)
├── utils/                             # unchanged
└── assets/                            # unchanged
```

Old top-level component files (`Home.tsx`, `KnowMeMore.tsx`, `Resume.tsx`, `Portfolio.tsx`, `Testimonial.tsx`, `ContactMe.tsx`, `Footer.tsx`, `Header.tsx`) are deleted as their replacements ship. `Testimonial.tsx` is deleted permanently (no replacement).

### 4.3 Provider stack (main.tsx)

```
<StrictMode>
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <App />
    <Toaster richColors closeButton />  {/* Sonner */}
  </ThemeProvider>
</StrictMode>
```

`HeroUIProvider` and `@heroui/react`'s `ToastProvider` are removed.

## 5. Theme tokens & visual identity

### 5.1 Color tokens

All colors in `oklch()` (shadcn convention). Defined in `src/index.css` under `:root` (light) and `.dark`, exposed to Tailwind via `@theme inline`.

| Token | Purpose |
|---|---|
| `--background` / `--foreground` | Page background and body text |
| `--card` / `--card-foreground` | Card surfaces |
| `--popover` / `--popover-foreground` | Dropdown / dialog surfaces |
| `--muted` / `--muted-foreground` | Secondary text, subtle backgrounds |
| `--accent` / `--accent-foreground` | Hover states |
| `--primary` / `--primary-foreground` | Brand green (existing `#17c964` expressed in oklch) |
| `--destructive` | Error states |
| `--border` | Hairlines (low-opacity white in dark mode) |
| `--input` | Form control borders |
| `--ring` | Focus rings (matches primary) |
| `--radius` | `0.75rem` (12px) base |

Brand accent green is retained as the primary; lightness adjusted per mode so contrast passes on both backgrounds.

### 5.2 Typography

- Sans: **Geist Variable** (`@fontsource-variable/geist`). Applied to `html` via `--font-sans`.
- Mono: **Geist Mono Variable** (`@fontsource-variable/geist-mono`). Applied to `code, pre, kbd, samp` and to opt-in mono utilities (eyebrow lines, badges, kbd hints).
- Heading scale: `tracking-tight` on `h2/h3`, `tracking-tighter` on hero `h1`.
- Replaces the current system stack + Manrope reference and removes `--nextui-fonts-*` vars.

### 5.3 Background & texture

- Hero only: subtle dot-grid background utility + a faint accent-green radial glow behind the headline.
- Rest of the site: solid background. No additional texture.
- Dark mode: no drop shadows (don't read on dark); 1px low-opacity-white borders for surfaces.
- Light mode: shadcn's default subtle shadows on cards.

### 5.4 Radius & elevation

- Single base `--radius: 0.75rem`. Tailwind utilities (`rounded-lg`, `rounded-xl`, `rounded-2xl`) derive from it via shadcn's standard mapping.

## 6. Animation system (GSAP)

### 6.1 Plugin registration

Done **once** at module level in `src/lib/gsap.ts`:

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };
```

All sections import from `@/lib/gsap` only. No registration calls inside components.

### 6.2 Primitives — `src/components/common/Animations.tsx`

The four Motion primitives (`Stagger`, `Item`, `Reveal`, `Hover`) collapse to **one** GSAP primitive plus a Tailwind pattern.

- **`<Reveal>`** — single React component with `variant` prop covering: `fadeUp`, `fadeIn`, `slideLeft`, `slideRight`, `zoomIn`, `splitChars`, `splitWords`.
  - Implementation: scope ref + `useGSAP` runs `gsap.from('.reveal-item', { …, scrollTrigger: { trigger: scope.current, start: 'top 80%', once: true } })`.
  - For `splitChars` / `splitWords`, uses `SplitText` on the direct child element.
  - Optional `stagger` and `delay` props. `as` prop to render as `section`, `div`, `ul`, etc.
- **`Hover` wrapper** — deleted. Hover lift/scale becomes a Tailwind class pattern applied directly on the element (`transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]`).

### 6.3 Section-specific animations

| Section | Animation |
|---|---|
| Hero | `SplitText` chars stagger up on headline; subtitle fades; avatar scales in; dot-grid + glow fade; CTAs fade last. Single timeline, ~1.2s. |
| Section headers | `<Reveal variant="fadeUp">` on title; underline bar grows `scaleX 0→1` from left. |
| About | `<Reveal>` on each block. |
| Resume cards | `<Reveal stagger>` on the two cards. |
| Skills marquee | `gsap.to('.marquee-track', { xPercent: -50, duration: 30, ease: 'none', repeat: -1 })`. Pause on hover via `onMouseEnter/Leave` setting timeline `paused`. |
| Portfolio grid | `<Reveal stagger>` on card rows. Hover handled by Tailwind transforms. |
| Contact | `<Reveal>` on left + right columns. |

### 6.4 Accessibility — `prefers-reduced-motion`

- Global handler in `src/lib/gsap.ts` checks `window.matchMedia('(prefers-reduced-motion: reduce)')`. When true:
  - Set `gsap.defaults({ duration: 0 })`.
  - Disable marquee timeline (snap track to start, no autoplay).
  - All `Reveal` instances complete instantly to their `to` state.

### 6.5 Hydration & cleanup

- `useGSAP` from `@gsap/react` handles cleanup on unmount automatically via `gsap.context`.
- All selectors live inside `useGSAP(() => …, { scope: ref })` — no global leakage.

## 7. Section redesigns

### 7.1 Header

- shadcn `NavigationMenu` (desktop) + `Sheet` (mobile drawer) replace HeroUI `Navbar*`.
- Sticky top with `backdrop-blur`; 1px bottom border that fades in once `window.scrollY > 8` (ScrollTrigger toggles a class on the header).
- Brand: name in mono, accent-green dot prefix.
- Right: `LanguageSwitcher`, `ThemeSwitcher`, both shadcn `DropdownMenu` with lucide icons (`Sun`, `Moon`, `Laptop`).
- Mobile: `Sheet` from the left with menu items; same `toSectionHref` anchors.

### 7.2 Hero

- Drop the typewriter and the circular bordered avatar (avatar moves to About).
- Eyebrow: mono text like `~ /home/teoman` with the `~` in primary green.
- H1: `text-5xl md:text-7xl tracking-tighter`. Name on line 1; role on line 2 in `text-muted-foreground`. Animated by `SplitText` chars.
- Short tagline below (one sentence; pulled from i18n `home.welcome` + replacement key).
- Location pill: shadcn `Badge` + lucide `MapPin`, mono font.
- CTAs: primary shadcn `Button` "Get in touch" (filled green) + secondary outline `Button` "Download résumé".
- Background: dot-grid utility (CSS) constrained to hero section + radial accent glow.

### 7.3 About (formerly Know Me More)

- Two columns on desktop, stacked on mobile:
  - Left: large square avatar (`me.png`) with rounded corners + 1px border.
  - Right: headline + 2 paragraphs (existing `about.whoAmIA`/`whoAmIB`/`aboutMe`/`myExperiences`).
- Below: definition list of profile facts (name/email/age/from) with mono labels and `divide-y divide-border` rows.
- `DownloadResumeButton` below the list.
- Stats strip below the columns: two big numbers (`stats.experienceYear+`, `stats.projectsNumber+`) separated by vertical rule, mono labels.

### 7.4 Resume

- Education + Experience as shadcn `Card` components in a 2-column grid (stack on mobile).
- Each card: logo square (72×72, 1px border, rounded), title, role/program, location, dates as a small mono `Badge` in primary green.
- Below: **Skills marquee**.
  - Container has `overflow-hidden`, mask gradient on left/right edges.
  - Track contains the skill icons duplicated (so loop is seamless) and animates `xPercent: -50`.
  - Each skill: rounded square with logo; on hover, shadcn `Tooltip` shows label.
- `DownloadResumeButton` removed from this section (already in About).

### 7.5 Portfolio

- 3 / 2 / 1 column grid (desktop / tablet / mobile).
- Cards: shadcn `Card` with image up top (`aspect-[16/9]`), title + 1-line description in body, small tech-stack `Badge` chips.
- Hover: Tailwind transform + accent-green border glow.
- Detail view: shadcn `Dialog` (replaces HeroUI `Modal`). Wide layout — image left, structured details on the right with mono labels for Link / Technologies / Industry / Date.

### 7.6 Contact

- Two-column on desktop, stacked on mobile.
- Left: heading (`contact.title`), `hi.gif` image, email link with sliding-underline hover, social row (lucide `Twitter` / `Github` / `Linkedin`) using the existing `sharedI18n.socialLinks`.
- Right: shadcn `Form` (composes react-hook-form), `Input` for name + email, `Textarea` for message, submit `Button`.
- Validation: existing Zod schema (`makeContactFormSchema(language)`) and localized messages — no change.
- Feedback: `sonner` `toast.success / toast.error / toast.warning` — replaces all four `addToast(...)` calls in `ContactMe.tsx` 1:1 (`notConfiguredTitle/Description`, `successTitle/Description`, `failedTitle/Description`).
- EmailJS submission flow unchanged (same env vars, same `emailjs.sendForm` call, same `#contact-form` id).

### 7.7 Footer

- Same copyright string (`copyrightLabel © {year} {name}. {footerCopyright}`).
- Mono font, centered, subtle 1px top border.

## 8. State, i18n, and types

- `useAppStore` keys (`language`, `isMenuOpen`, `email`) unchanged.
- `usePageMeta` hook unchanged.
- `toSectionHref` util unchanged. Anchors remain stable across the redesign.
- `PageSection` component kept, but rebuilt around shadcn primitives; same `menuIndex` + `header` API.
- i18n changes:
  - **Remove** `testimonial` key from `translations.en` and `translations.tr`.
  - **Remove** `testimonials` object from `sharedI18n`.
  - **Remove** `Testimonial`-related types in `src/types`.
  - **Add** any new keys the redesigned hero needs (e.g., eyebrow text, secondary CTA label) — exact key set finalized in the implementation plan.
- All i18n updates touch both EN and TR.

## 9. Phased PR plan

### Phase 0 — Foundation (`feat/migration-foundation`)

1. Bump React, React-DOM, Vite, `@vitejs/plugin-react-swc`, Tailwind, `@tailwindcss/vite`, TypeScript, type packages, ESLint + plugins.
2. Remove `@heroui/*`, `motion`, `framer-motion`, `react-slick`, `@types/react-slick`, `react-simple-typewriter`, `hero.ts`. Strip `@plugin '../hero.ts'` and `@source '...@heroui/theme...'` from `src/index.css`. Remove the Font Awesome `<script>` from `index.html`.
3. Add `gsap`, `@gsap/react`, `sonner`, `next-themes`, `lucide-react`, `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`.
4. Run `npx shadcn@latest init` (Tailwind v4 + Vite + dark mode + neutral base + custom primary). Pre-install the components needed across the site so they're ready before Phase 1: `button`, `card`, `dialog`, `dropdown-menu`, `input`, `textarea`, `sheet`, `navigation-menu`, `form`, `label`, `badge`, `avatar`, `tooltip`, `sonner`, `separator`.
5. Add `src/lib/utils.ts` (`cn`) and `src/lib/gsap.ts` (plugin registration + reduced-motion).
6. Rewrite `src/index.css`: Tailwind v4 import, font imports, `:root` + `.dark` token blocks, `@theme inline`.
7. Replace `main.tsx` provider stack: `ThemeProvider` (next-themes) wraps `App`; `<Toaster />` rendered alongside.
8. Build new common primitives:
   - `Animations.tsx` (the GSAP `<Reveal>`).
   - `ThemeSwitcher.tsx` (next-themes + shadcn `DropdownMenu`).
   - `LanguageSwitcher.tsx` (shadcn `DropdownMenu`).
   - `PageSection.tsx`, `SectionHeader.tsx` rebuilt around shadcn.
9. Replace `App.tsx` with placeholder content so the app still boots (`<main><h1>Migrating…</h1></main>` plus the new `Header` shell if available).
10. Delete old `src/components/{Header,Home,KnowMeMore,Resume,Portfolio,Testimonial,ContactMe,Footer}.tsx` (they'd fail to compile after Phase 0 removes deps).
11. Delete old `src/components/common/{Animations.tsx,animationVariants.ts,ThemeSwitcher.tsx,LanguageSwitcher.tsx,DownloadResumeButton.tsx,PortfolioCard.tsx,SkillLogo.tsx}` and the parts of `src/components/index.ts` referencing them; rebuild barrel exports for the new common primitives.
12. Remove testimonial i18n entries + types in this phase (so the type-checker is clean).

**Done when:** `npm run dev` boots, `npm run build` is green, `npm run lint` is clean, light/dark/system toggle works, EN/TR switcher works, no `@heroui`/`motion`/`framer-motion`/`react-simple-typewriter` imports remain anywhere.

**Known temporary state:** site shows placeholders for all sections — acceptable for a personal portfolio while phased PRs land.

### Phase 1 — Header + Hero (`feat/migration-header-hero`)

- Build `sections/Header.tsx` and `sections/Hero.tsx` per § 7.1 / 7.2.
- Wire into `App.tsx`; delete the foundation placeholder.
- Add any new hero i18n keys (eyebrow / secondary CTA) in EN + TR.
- **Done when:** Hero renders in both languages, both themes, SplitText animation runs, sticky header border appears on scroll.

### Phase 2 — About + Resume (`feat/migration-about-resume`)

- Build `sections/About.tsx` per § 7.3.
- Build `sections/Resume.tsx` (cards + skills marquee) per § 7.4.
- Verify marquee pause-on-hover and reduced-motion fallback.
- **Done when:** Both sections render in EN + TR, dark + light + system. Marquee runs smoothly at 60fps locally.

### Phase 3 — Portfolio + Contact + Footer (`feat/migration-portfolio-contact`)

- Build `sections/Portfolio.tsx` (grid + Dialog) per § 7.5.
- Build `sections/Contact.tsx` per § 7.6 (Sonner replaces `addToast`).
- Build `sections/Footer.tsx` per § 7.7.
- Final `App.tsx` is now: `<Header /><Hero /><About /><Resume /><Portfolio /><Contact /><Footer />`.
- **Done when:** all sections render, contact form submits via EmailJS, all four toast states fire correctly in EN + TR.

### Phase 4 — Polish (`feat/migration-polish`)

- Reduced-motion audit across all sections.
- Lighthouse: LCP < 2.5s, CLS < 0.1, INP < 200ms target on local desktop run.
- EN/TR + light/dark/system smoke test on every section.
- Update `README.md` and `AGENTS.md` to reflect the new stack (shadcn, GSAP, Sonner, next-themes, Geist) and the new file structure.
- Verify Tailwind `@source` globs in `index.css` cover all current file paths.

## 10. Subagent-driven development fit

Each of phases 1–3 contains two largely independent section builds. Within a phase, the implementation plan can dispatch parallel subagents to draft each section in its own file:

- Sections share **no mutable state** during build (separate files, separate scope refs, separate i18n key additions which can be reconciled at merge).
- Common primitives (`Reveal`, `Button`, etc.) exist by Phase 0 — subagents consume them.
- Each subagent returns a working file; the orchestrator integrates them into `App.tsx` and runs the verification gates.

The detailed subagent dispatch plan is the responsibility of the subsequent **writing-plans** step, not this design.

## 11. Success criteria (applied to every PR)

- `npm run build` succeeds (clean type-check).
- `npm run lint` is clean.
- Manual dev-server check: EN + TR, light + dark + system, mobile + desktop widths.
- No regressions in contact form submission (Phase 3+).
- No `@heroui`, `motion`, `framer-motion`, `react-simple-typewriter`, or `react-slick` imports after Phase 0.
- Lighthouse mobile/desktop performance ≥ 90 after Phase 4.

## 12. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Phase 0 leaves site in a placeholder state on `main` | Acceptable tradeoff (personal portfolio, low traffic). Could be hidden behind a deploy preview branch if desired — out of scope here. |
| Tailwind v4 + shadcn theme conflicts with existing `--color-accent` token | New tokens fully replace the current `:root` block; `--color-accent: #17c964` is removed and reborn as `--primary` in oklch. |
| GSAP scope leakage across sections | Strict rule: every `useGSAP` call must pass `{ scope: ref }`. Code review checklist for each PR. |
| `next-themes` flicker on first paint | Use `defaultTheme="system"` + `enableSystem`; add `suppressHydrationWarning` on `<html>` (Vite SPA — manual hint in `index.html`). |
| EmailJS env vars or templates break in redesign | Field names and form id `#contact-form` preserved verbatim. Same `emailjs.sendForm` call. |
| Reduced-motion users see broken marquee | Marquee is disabled (track snapped to start, no autoplay) when `prefers-reduced-motion: reduce`. |
| EN/TR string drift during redesign | Every new i18n key must land in both languages in the same PR. Lint check optional, manual review mandatory. |

## 13. Open questions to resolve in the implementation plan

- Exact hero copy (eyebrow text, secondary CTA label, new tagline) in EN + TR.
- Whether to drop the `email` field from `useAppStore` (it's read from i18n, not edited at runtime — possibly removable).
- Final skill list and order in the marquee.
- Whether `react-slick` types should be removed in Phase 0 alongside the package (yes — confirmed in §4.1).

These are deliberately deferred; they do not affect the architecture.
