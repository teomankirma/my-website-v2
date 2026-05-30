# Portfolio Redesign — Design Spec

**Date:** 2026-05-30
**Status:** Approved
**Author:** Teoman Kırma (with Claude)
**Supersedes:** `2026-05-26-stack-migration-redesign-design.md` (that direction's foundation PR #10 was reverted; this is a fresh start)

---

## 1. Goal

Completely redesign the personal portfolio with a new visual language, a new framework, and a new file structure. This is a **full overhaul**, not a component re-skin: every section gets a new composition, new type, new color, and new motion. Content (copy, projects, EN/TR translations), the EmailJS contact wiring, and stable section anchors are preserved; the design is not constrained by the old layout.

**Design Read:** *Developer portfolio for recruiters and prospective clients, with a dark-technical / terminal-flavored language, leaning toward Next.js + shadcn/ui + GSAP, Geist type, emerald accent, dark default with a light counterpart.*

---

## 2. Decisions (resolved during brainstorming)

| Question | Decision |
|---|---|
| Redesign mode | Overhaul — fresh start, no anchoring on the reverted spec |
| Component library | **shadcn/ui** (explicit user choice) |
| Animation | **GSAP** + `@gsap/react` (explicit user choice) |
| Framework | **Migrate to Next.js (App Router)** |
| i18n | **next-intl** with message files + `[locale]` routing |
| Visual direction | **Dark Technical** (off-black, mono accents, dot-grid, terminal motifs) |
| Accent color | **Emerald green** (continuity with current `#17c964` brand) |
| Theme | Dark default + light counterpart + system; manual toggle kept |
| Hero visual | Asymmetric split with **portrait photo** on the right |
| Motion budget | One signature heavy moment (Portfolio horizontal-pan) + hero on-load reveal + light scroll-reveals elsewhere |
| Sticky-stack "What I Do" section | **Cut** — keep the page lean (6 sections) |
| Testimonials | **Dropped entirely** (was dummy lorem data) |
| Contact form | **Kept** (EmailJS + react-hook-form + Zod), Sonner toasts |
| Sections | Header, Hero, About, Resume, Portfolio, Contact, Footer |

### 2.1 Design dials (design-taste-frontend)

- `DESIGN_VARIANCE: 7` — asymmetric hero, varied layout families, no centered-hero default.
- `MOTION_INTENSITY: 7` — motion is real and motivated, not decorative; one pinned scroll moment.
- `VISUAL_DENSITY: 4` — comfortable web-app spacing, mono for numbers, hairlines over heavy cards.

---

## 3. Non-goals

- No CMS, blog, or backend services beyond the existing EmailJS contact flow.
- No new locales beyond EN/TR.
- No e-commerce, auth, or dashboards.
- No rewrite of the project content / copy (only restructured into message files; light copy polish allowed where strings are broken or filler).
- No analytics platform change (keep optional GA via env var).
- No design-system mixing — shadcn/ui only.

---

## 4. Tech stack

### 4.1 Framework & hosting

- **Next.js (latest stable) — App Router**, React 19, TypeScript strict.
- **Deploy target: Vercel** (matches the user's existing `teo-*.vercel.app` projects). This lets next-intl middleware run for locale detection + clean `/en` `/tr` URLs.
  - *Alternative (flagged for review):* `output: 'export'` static build for any static host. Per next-intl docs this works **but** disables middleware: locale prefix becomes mandatory, automatic locale detection is off, and static rendering is required. Recommendation is Vercel + middleware; static export is the fallback.

### 4.2 Dependencies

**Add:**
- `next` (App Router), already have `react` / `react-dom` 19.
- `next-intl` — i18n (messages + routing).
- shadcn/ui via `npx shadcn@latest init` — pulls `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, Radix primitives, and `lucide-react`.
- `gsap` + `@gsap/react` (GSAP 3.13+ ships ScrollTrigger / SplitText free).
- `sonner` — toasts.
- `next-themes` — light/dark/system.
- `geist` — Geist Sans + Geist Mono via `next/font`.

**Keep:**
- `@emailjs/browser`, `react-hook-form`, `@hookform/resolvers`, `zod`, `luxon`.

**Remove:**
- `@heroui/react`, `@heroui/use-theme`, `hero.ts`.
- `framer-motion`, `motion` (GSAP replaces; Tailwind handles micro-transitions).
- `react-simple-typewriter` (typewriter dropped).
- `react-slick`, `@types/react-slick` (unused / testimonial carousel removed).
- `zustand` — **dropped.** With locale in the URL (next-intl), theme in next-themes, and menu state local to the shadcn `Sheet`, there is no global state left to hold. (Flagged in §13 in case a future need appears.)
- Vite-specific config (`vite.config.ts`, `@vitejs/plugin-react-swc`, `@tailwindcss/vite`, `index.html`, `src/main.tsx`) — replaced by the Next.js app.
- Font Awesome `<script>` — icons move to `lucide-react`.

### 4.3 Icons

`lucide-react` (shadcn's default). Acceptable here because the project adopts shadcn, which depends on it. One icon family, `strokeWidth` standardized at `1.75`.

---

## 5. Project structure (Next.js App Router)

```
.
├── next.config.ts                 # (output:'export' only if static fallback chosen)
├── messages/
│   ├── en.json                    # all EN strings (from current i18n)
│   └── tr.json                    # all TR strings
├── public/                        # static assets servable by URL
│   └── (favicons, og image, resume.pdf)
├── src/
│   ├── i18n/
│   │   ├── routing.ts             # defineRouting({locales:['en','tr'], defaultLocale:'en'})
│   │   ├── navigation.ts          # Link/redirect/usePathname/useRouter wrappers
│   │   └── request.ts             # getRequestConfig (server message loading)
│   ├── middleware.ts              # createMiddleware(routing)  (Vercel path)
│   ├── app/
│   │   ├── layout.tsx             # <html> shell, fonts, suppressHydrationWarning
│   │   └── [locale]/
│   │       ├── layout.tsx         # locale validate + NextIntlClientProvider + ThemeProvider + <Toaster/>
│   │       └── page.tsx           # assembles the section components
│   ├── components/
│   │   ├── ui/                    # shadcn primitives (button, card, dialog, dropdown-menu,
│   │   │                          #   input, textarea, sheet, form, label, badge, tooltip,
│   │   │                          #   separator, sonner, navigation-menu)
│   │   ├── sections/
│   │   │   ├── header.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── about.tsx
│   │   │   ├── resume.tsx
│   │   │   ├── portfolio.tsx      # 'use client' — horizontal-pan + Dialog
│   │   │   ├── contact.tsx        # 'use client' — form + EmailJS
│   │   │   └── footer.tsx
│   │   ├── common/
│   │   │   ├── reveal.tsx         # 'use client' — GSAP scroll-reveal primitive
│   │   │   ├── horizontal-pan.tsx # 'use client' — GSAP pinned pan (canonical skeleton)
│   │   │   ├── skills-marquee.tsx # 'use client'
│   │   │   ├── section.tsx        # section wrapper (id + spacing)
│   │   │   ├── section-header.tsx
│   │   │   ├── theme-switcher.tsx # 'use client'
│   │   │   ├── language-switcher.tsx
│   │   │   └── download-resume-button.tsx
│   │   └── providers.tsx          # 'use client' — ThemeProvider wrapper
│   ├── lib/
│   │   ├── utils.ts               # cn()
│   │   ├── gsap.ts                # registerPlugin(ScrollTrigger, SplitText, useGSAP) once
│   │   └── projects.ts            # project data (images, links, tech, dates) — locale-neutral
│   ├── schemas/
│   │   └── contact.ts             # zod schema, localized messages
│   └── styles/
│       └── globals.css            # Tailwind v4 import + tokens + @theme inline
└── docs/superpowers/...           # specs + plans
```

Old `src/components/*` (HeroUI sections), `src/hooks/*`, `src/utils/index.ts` (`toSectionHref`), and `src/i18n/index.ts` are removed/replaced. `toSectionHref`'s job (stable anchors) is replaced by hardcoded stable `id`s on each `<Section>` (see §11). Assets in `src/assets/` move to imports under `src/lib/projects.ts` or to `public/`.

---

## 6. i18n architecture (next-intl)

- `routing.ts`: `defineRouting({ locales: ['en','tr'], defaultLocale: 'en' })`.
- `middleware.ts`: `createMiddleware(routing)` with the documented matcher (excludes `/api`, `/_next`, `/_vercel`, dotted files). Handles locale detection + `/` → `/en` redirect on Vercel.
- `app/[locale]/layout.tsx`: validates `locale` with `hasLocale(...)` → `notFound()` otherwise; wraps children in `NextIntlClientProvider`. `generateStaticParams()` returns both locales.
- Messages: `messages/en.json` + `messages/tr.json`, grouped by section (`header`, `hero`, `about`, `resume`, `portfolio`, `contact`, `footer`, `validation`). Migrated 1:1 from `src/i18n/index.ts`, minus testimonials.
- Locale-neutral data (project image src, links, tech strings, dates, social URLs, email) lives in `src/lib/projects.ts` and `src/lib/site.ts` — not duplicated per language. Only human-readable strings (titles, descriptions, labels) go in message files.
- Type safety: augment `next-intl` messages type from `en.json` so keys are checked.
- Dynamic values (age, years of experience, current year) computed with Luxon and passed as ICU message arguments.

---

## 7. Visual identity

### 7.1 Color tokens (`globals.css`)

shadcn token model in `oklch()`, `:root` = **light**, `.dark` = **dark (default applied via next-themes)**, exposed through `@theme inline`.

- Accent: **emerald** as `--primary`. Dark: ~`oklch(0.72 0.19 150)` (bright green on off-black). Light: a deeper emerald so text/fills pass WCAG AA on white.
- Neutrals: zinc family. Dark `--background` ≈ `oklch(0.16 0.005 285)` (off-black, never pure `#000`). Light `--background` ≈ off-white (never pure `#fff`).
- Standard shadcn tokens: `--foreground`, `--card(/-foreground)`, `--popover(/-foreground)`, `--muted(/-foreground)`, `--accent(/-foreground)`, `--primary(/-foreground)`, `--destructive`, `--border`, `--input`, `--ring` (= primary), `--radius`.
- **Color Consistency Lock:** emerald is the only accent on the entire page, both modes.
- Dark mode: hairline borders (`border-white/10`), no black drop shadows. Light mode: subtle tinted shadows.

### 7.2 Typography

- Sans: **Geist** (`next/font` via `geist/font/sans`) → `--font-sans`, default body + headings.
- Mono: **Geist Mono** (`geist/font/mono`) → `--font-mono`, used for eyebrows, the terminal prompt mark, badges, numbers, kbd hints, labels.
- Scale: hero `text-5xl md:text-7xl tracking-tighter`; section headings `text-3xl md:text-4xl tracking-tight`; body `text-base text-muted-foreground leading-relaxed max-w-[65ch]`.
- Emphasis within headlines = weight/italic of Geist itself, never a mixed serif.

### 7.3 Radius & texture

- One radius scale from `--radius: 0.75rem` (shadcn mapping). **Shape Consistency Lock**: cards/inputs share the scale; buttons may be the standard shadcn radius — documented and applied everywhere.
- Hero only: dot-grid utility + faint emerald radial glow behind the headline. Rest of the page: solid background within the locked theme. No section inverts mode (**Page Theme Lock**).

---

## 8. Motion system (GSAP)

### 8.1 Registration

`src/lib/gsap.ts` registers `ScrollTrigger`, `SplitText`, `useGSAP` once at module scope. All animated components import from `@/lib/gsap` and run effects inside `useGSAP(() => …, { scope: ref })` for automatic cleanup. Every animated component is a `'use client'` leaf.

### 8.2 Reduced motion (mandatory)

- A reduced-motion guard in `gsap.ts` (`gsap.matchMedia()` / `prefers-reduced-motion`) makes: hero reveal resolve instantly, scroll-reveals appear static, the marquee freeze at start, and the Portfolio pan degrade to a normal vertical scroll-snap grid.

### 8.3 Where motion fires

| Section | Motion | Why |
|---|---|---|
| Hero | On-load timeline: SplitText name reveal, subtitle/CTA fade-up, portrait scale-in (~1.2s). No scroll-hijack. | First paint must be instant; reward the landing. |
| About | Scroll-reveal fade/slide; stats count up once. | Calm beat; draw the eye down. |
| Resume | Scroll-reveal on the two cards; **skills marquee** (the one marquee on the page; pause on hover). | Breadth of skills without a long list. |
| Portfolio | **Pinned horizontal-pan** (canonical §5.B skeleton: `start:'top top'`, `pin:true`, `scrub`, `invalidateOnRefresh`). Mobile → horizontal scroll-snap, no pin. | Signature moment; panning invites browsing the gallery. |
| Contact | Scroll-reveal on the two columns. | Don't distract from conversion. |
| Footer | Static. | Quiet close. |

`Reveal` primitive (`common/reveal.tsx`): `variant` (`fadeUp`/`fadeIn`/`slideLeft`/`slideRight`), optional `stagger`/`delay`, `as` prop; uses ScrollTrigger `start:'top 80%'`, `once:true`.

---

## 9. Section designs

Each section uses a distinct layout family (no repetition). Eyebrows rationed: at most 2 across the page (hero + one other).

### 9.1 Header
shadcn `NavigationMenu` (desktop, single line, ≤72px tall) + `Sheet` (mobile). Sticky, `backdrop-blur`, hairline bottom border that fades in once scrolled (ScrollTrigger toggles a class). Mono wordmark with an emerald prompt dot. Right side: `LanguageSwitcher` + `ThemeSwitcher` (shadcn `DropdownMenu`, lucide `Sun`/`Moon`/`Laptop`). Anchors link to stable section ids.

### 9.2 Hero (asymmetric split)
Left: mono eyebrow (`~/teoman`), `h1` name (SplitText), role in `text-muted-foreground`, one-line tagline (≤20 words), two CTAs — primary **"Get in touch"** (emerald) + secondary outline **"Download résumé"** (distinct intents). Right: portrait (`me.png`) with 1px border + emerald glow. Dot-grid + radial glow background scoped to hero. `min-h-[100dvh]`, `pt` ≤ `pt-24`. Hero stack ≤4 text elements; no trust strip / tagline-below-CTAs.

### 9.3 About (prose + facts + stats)
Headline + two short paragraphs (existing `about` copy). A mono definition list of profile facts (name / from / email / age) with `divide-y divide-border` rows. Stats strip below: two big mono numbers (`experienceYear+`, `projectsNumber+`) with a separator. No big card boxes — grouped with hairlines and space. `DownloadResumeButton` lives here too (single résumé intent shared with hero).

### 9.4 Resume (cards + marquee)
Education + Experience as two shadcn `Card`s (logo square, title, role/program, location, dates as an emerald mono `Badge`). 2-col desktop → stacked mobile. Below: **skills marquee** — `overflow-hidden`, edge mask gradients, duplicated track, `xPercent:-50` loop, pause on hover, `Tooltip` per skill label.

### 9.5 Portfolio (pinned horizontal-pan + Dialog)
The 7 projects render as horizontal cards inside a pinned section that pans as the user scrolls (canonical horizontal-pan). Each card: screenshot (`aspect-[16/10]`), title, one-line description, tech-stack `Badge` chips; hover = lift + emerald border glow. Click → shadcn `Dialog`: image left, structured details right (Link / Technologies / Industry / Date with mono labels). **Mobile:** horizontal scroll-snap strip (swipe), no pin/hijack. Reduced-motion: vertical 1-col grid + Dialog.

### 9.6 Contact (split: pitch + form)
Left: heading (`contact.title`), short pitch, email link with sliding-underline hover, social row (lucide `Twitter`/`Github`/`Linkedin` → `site.ts` social URLs). Right: shadcn `Form` (react-hook-form) — `Input` name + email, `Textarea` message, submit `Button`. Validation: existing Zod schema, localized. **EmailJS unchanged:** same env vars, same `emailjs.sendForm`, same form `id` and field `name`s. Feedback via `sonner` (`toast.success`/`error`/`warning`) replacing the four HeroUI `addToast` calls 1:1. This is a `'use client'` leaf.

### 9.7 Footer
Mono, centered, hairline top border: `© {year} {name}. {footerCopyright}`. No motion.

---

## 10. State, theme, providers

- **Theme:** `next-themes` `ThemeProvider` (`attribute="class"`, `defaultTheme="dark"`, `enableSystem`) in `components/providers.tsx`, mounted in `app/[locale]/layout.tsx`. `<html suppressHydrationWarning>` in root layout.
- **Language:** entirely via next-intl routing (URL locale). `LanguageSwitcher` uses next-intl's `Link`/`useRouter` to swap locale on the current pathname.
- **Menu:** local `useState` inside the `Sheet`.
- **Toasts:** `<Toaster richColors closeButton />` (sonner) in the locale layout.
- No Zustand.

---

## 11. Content preservation & SEO

- **Section anchors preserved as stable, language-independent ids** (`#home`, `#about`, `#resume`, `#portfolio`, `#contact`) so deep links and nav keep working across locales. (Replaces `toSectionHref` transliteration.)
- Per-locale metadata via `generateMetadata` (title, description, `html lang`, OpenGraph). Replaces the `usePageMeta` hook.
- All project copy, EN/TR translations, project links/images, social links, and résumé carried over. Testimonials removed.
- Optional GA kept behind `VITE_`→`NEXT_PUBLIC_` env rename (`NEXT_PUBLIC_GA_MEASUREMENT_ID`); EmailJS env vars renamed to `NEXT_PUBLIC_EMAILJS_*` (Next.js public-env convention) — documented in README + `.env.example`.

---

## 12. Accessibility & performance

- WCAG AA contrast for all text, buttons, form fields, focus rings — verified in **both** modes.
- Full interactive states: form loading (disabled + spinner-in-button), inline field errors below inputs, sonner for transient success/failure. `:active` tactile feedback on buttons.
- `prefers-reduced-motion` honored everywhere (§8.2).
- `min-h-[100dvh]` for hero (never `h-screen`). Animate only `transform`/`opacity`.
- Targets: LCP < 2.5s (portrait via `next/image priority`), CLS < 0.1 (reserved image space, `next/font`), INP < 200ms. Lighthouse run in the polish phase.

---

## 13. Phased implementation (for writing-plans / subagent-driven-development)

**Branching strategy:** The entire redesign is built on a single long-lived feature branch (e.g. `redesign/dark-technical`), kept **off `main` until the whole site is done**. No incremental merges to `main` — merging anything affects production. Sub-branches per phase may be used internally and merged into the feature branch, but `main` is touched only once, at the end, on the user's explicit go-ahead. The phases below are internal milestones, not separate production PRs.

Sequencing the writing-plans step will detail; high-level phases:

- **Phase 0 — Foundation:** scaffold Next.js App Router; install deps; `shadcn init` + add components; `globals.css` tokens (emerald, dark default, light); Geist fonts; next-intl routing + middleware + message files migrated from `src/i18n`; `lib/gsap.ts`, `lib/utils.ts`, `lib/projects.ts`, `lib/site.ts`; providers + Toaster; common primitives (`Reveal`, `Section`, `SectionHeader`, `ThemeSwitcher`, `LanguageSwitcher`, `DownloadResumeButton`); remove Vite/HeroUI/Framer/zustand/etc. Done when `next build` + lint are clean and a placeholder page boots in EN/TR, light/dark.
- **Phase 1 — Header + Hero + Footer:** the frame and the landing moment (SplitText, sticky header, theme/lang switchers).
- **Phase 2 — About + Resume:** prose/facts/stats + cards + skills marquee.
- **Phase 3 — Portfolio + Contact:** horizontal-pan showcase + Dialog; contact form + EmailJS + sonner.
- **Phase 4 — Polish:** reduced-motion audit, Lighthouse, EN/TR + light/dark smoke test, README/AGENTS update, Pre-Flight Check (design-taste §14).

Sections in Phases 1–3 are independent files consuming Phase-0 primitives → parallelizable across subagents; orchestrator integrates into `app/[locale]/page.tsx` and runs gates.

---

## 14. Success criteria (every milestone)

- `next build` clean (strict types), `eslint` clean.
- EN + TR, light + dark + system, mobile + desktop all verified.
- Contact form submits via EmailJS; all toast states fire in both locales.
- No `@heroui`, `framer-motion`/`motion`, `react-simple-typewriter`, `react-slick`, `zustand`, or Vite config remaining.
- design-taste Pre-Flight Check passes (zero em-dashes, one accent, one theme, eyebrow count ≤ 2, no AI tells, real images, motivated motion, reduced-motion fallbacks).
- Lighthouse ≥ 90 performance after Phase 4.

---

## 15. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Migration is large (Vite→Next, HeroUI→shadcn, hand-i18n→next-intl) at once | Phased; Phase 0 lands a booting placeholder before sections build. |
| Static-export vs middleware ambiguity for i18n | Recommend Vercel + middleware; static-export fallback documented with its limitations (§4.1). |
| GSAP pin/scrub jank on mobile | Mobile uses scroll-snap (no pin); `invalidateOnRefresh`; reduced-motion degrades to grid. Per canonical §5.B skeleton. |
| EmailJS breakage in rebuild | Form `id`, field `name`s, and `sendForm` call preserved verbatim; env vars renamed to `NEXT_PUBLIC_*` and documented. |
| next-themes hydration flicker | `suppressHydrationWarning` on `<html>`, `defaultTheme="dark"`, `enableSystem`. |
| EN/TR string drift | Every new key lands in both `en.json` and `tr.json` in the same change; typed messages catch missing keys. |
| Portrait photo quality at hero scale | If `me.png` is too low-res, regenerate/crop or fall back to type-only hero (decision point in Phase 1). |

---

## 16. Open questions (deferred to the implementation plan)

- Final hero tagline + secondary-CTA copy (EN + TR).
- Whether `/` redirects to `/en` (Vercel middleware) or renders a locale picker.
- Exact skill list + order in the marquee.
- Whether to host the résumé PDF in `public/` or keep the current download source.
- Confirm Vercel as deploy target (vs static export).
