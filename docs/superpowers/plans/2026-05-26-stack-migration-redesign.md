# Stack Migration & Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the personal portfolio from HeroUI + Motion to shadcn/ui + GSAP while redesigning the site to a dark/dev-focused aesthetic, across four feature branches.

**Architecture:** Strip-and-rebuild section-by-section. Phase 0 is a foundation branch that bumps deps, installs shadcn primitives, wires GSAP + Sonner + next-themes, and leaves the site in a "Migrating…" placeholder state. Phases 1–3 each replace 2–3 sections per branch. Phase 4 is polish.

**Tech Stack:** React 19 · Vite 7 · TypeScript 5.8 · Tailwind v4 · shadcn/ui (Radix primitives) · GSAP 3.13+ (ScrollTrigger + SplitText) · Sonner · next-themes · lucide-react · Geist Variable fonts · Zustand · react-hook-form + Zod · EmailJS · Luxon.

**Source spec:** `docs/superpowers/specs/2026-05-26-stack-migration-redesign-design.md`

**Verification model:** This codebase has no test framework. Every task verifies with some combination of `npm run lint`, `npm run build`, and manual dev-server checks (EN + TR, light + dark + system). The plan calls these checks out explicitly per task.

---

## File Structure

### Created in Phase 0

| Path | Responsibility |
|---|---|
| `components.json` | shadcn CLI config (style, base color, paths) |
| `src/lib/utils.ts` | `cn()` Tailwind merge helper (shadcn convention) |
| `src/lib/gsap.ts` | Single GSAP plugin registration + reduced-motion handling |
| `src/components/ui/*` | shadcn primitives (`button.tsx`, `card.tsx`, `dialog.tsx`, etc.) added via CLI |

### Replaced in Phase 0 (file paths stay, contents fully rewritten)

| Path | Old | New |
|---|---|---|
| `src/index.css` | Tailwind v4 + HeroUI plugin + Manrope ref | Tailwind v4 + shadcn oklch tokens + Geist + dot-grid utility |
| `src/main.tsx` | HeroUI/Toast providers | `ThemeProvider` (next-themes) + `Toaster` (sonner) |
| `src/App.tsx` | Renders all section components | Renders a placeholder shell |
| `index.html` | Manrope + Font Awesome | Geist self-hosted (no external scripts) |
| `src/components/common/Animations.tsx` | Motion `Stagger`/`Item`/`Reveal`/`Hover` | GSAP `<Reveal>` only |
| `src/components/common/ThemeSwitcher.tsx` | `@heroui/use-theme` + HeroUI Dropdown | `next-themes` + shadcn `DropdownMenu` |
| `src/components/common/LanguageSwitcher.tsx` | HeroUI Dropdown | shadcn `DropdownMenu` |
| `src/components/common/SectionHeader.tsx` | Motion primitives | GSAP `<Reveal>` + plain DOM |
| `src/components/common/PageSection.tsx` | Same logic, no HeroUI | Same logic, no HeroUI |
| `src/components/common/DownloadResumeButton.tsx` | HeroUI Button + Link | shadcn `Button` (with `asChild` + `<a>`) |
| `src/components/common/index.ts` | Re-exports Motion + HeroUI bits | Re-exports new primitives only |
| `src/components/index.ts` | Re-exports old top-level sections | Re-exports new sections (empty until Phase 1) |
| `src/i18n/index.ts` | Includes `testimonial` keys + `testimonials` shared | Testimonial keys removed; new `hero` keys added |
| `src/types/index.ts` | Includes `LocaleTestimonial`, `SharedI18n.testimonials` | Testimonial types removed |

### Deleted in Phase 0

| Path | Reason |
|---|---|
| `hero.ts` | HeroUI Tailwind plugin |
| `src/components/Header.tsx` | Old top-level section file (rebuilt in Phase 1 under `sections/`) |
| `src/components/Home.tsx` | Replaced by `sections/Hero.tsx` (Phase 1) |
| `src/components/KnowMeMore.tsx` | Replaced by `sections/About.tsx` (Phase 2) |
| `src/components/Resume.tsx` | Replaced by `sections/Resume.tsx` (Phase 2) |
| `src/components/Portfolio.tsx` | Replaced by `sections/Portfolio.tsx` (Phase 3) |
| `src/components/Testimonial.tsx` | Section removed entirely |
| `src/components/ContactMe.tsx` | Replaced by `sections/Contact.tsx` (Phase 3) |
| `src/components/Footer.tsx` | Replaced by `sections/Footer.tsx` (Phase 3) |
| `src/components/common/animationVariants.ts` | Replaced by inline GSAP definitions in `Animations.tsx` |
| `src/components/common/SkillLogo.tsx` | Replaced by `SkillsMarquee` items (Phase 2) |
| `src/components/common/PortfolioCard.tsx` | Rebuilt in Phase 3 |

### Created in Phases 1–3

| Path | Phase | Purpose |
|---|---|---|
| `src/components/sections/Header.tsx` | 1 | Sticky nav with `NavigationMenu` (desktop) + `Sheet` (mobile) |
| `src/components/sections/Hero.tsx` | 1 | Eyebrow, SplitText headline, CTAs, dot-grid background |
| `src/components/sections/About.tsx` | 2 | Two-column avatar + bio + profile facts + stats strip |
| `src/components/sections/Resume.tsx` | 2 | Education + Experience cards + skills marquee |
| `src/components/common/SkillsMarquee.tsx` | 2 | Infinite horizontal scrolling skill row, GSAP-driven |
| `src/components/sections/Portfolio.tsx` | 3 | Project grid + `Dialog` detail view |
| `src/components/common/PortfolioCard.tsx` | 3 | Single project card |
| `src/components/sections/Contact.tsx` | 3 | Form + social links, Sonner toasts |
| `src/components/sections/Footer.tsx` | 3 | Centered copyright |

---

## Phase 0 — Foundation

Branch: `feat/migration-foundation`. End state: app boots, `npm run build` passes, `npm run lint` clean, theme toggle works, language switcher works, page shows a "Migrating…" placeholder with the new Header rendering correctly.

### Task 0.1: Create the branch and verify clean baseline

**Files:** none modified

- [ ] **Step 1: Confirm you're on main with a clean tree**

Run: `git status`
Expected output:
```
On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

- [ ] **Step 2: Verify baseline still builds before changing anything**

Run: `npm install && npm run lint && npm run build`
Expected: no errors. `dist/` is regenerated.

- [ ] **Step 3: Create and switch to the foundation branch**

Run: `git checkout -b feat/migration-foundation`

---

### Task 0.2: Add new runtime dependencies

**Files:**
- Modify: `package.json` (npm writes it automatically)

- [ ] **Step 1: Install runtime deps in one command**

Run:
```bash
npm install \
  gsap@latest \
  @gsap/react@latest \
  sonner@latest \
  next-themes@latest \
  lucide-react@latest \
  @fontsource-variable/geist@latest \
  @fontsource-variable/geist-mono@latest \
  class-variance-authority@latest \
  clsx@latest \
  tailwind-merge@latest \
  tw-animate-css@latest
```

Expected: `npm install` succeeds with `added N packages`. No peer-dep warnings about Tailwind v4 / React 19 incompatibility.

- [ ] **Step 2: Sanity-check `package.json`**

Open `package.json` and confirm all 11 packages above appear under `dependencies`. If any landed under `devDependencies`, leave them — they're runtime-resolved at build, so the location is harmless for a Vite SPA.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(deps): add shadcn, gsap, sonner, next-themes, lucide, geist runtime deps"
```

---

### Task 0.3: Initialize shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- May modify: `vite.config.ts` (alias — already present), `tsconfig.app.json` (paths — already present)
- May modify: `src/index.css` (shadcn writes its own baseline — we'll overwrite it in Task 0.5)

- [ ] **Step 1: Run shadcn init**

Run:
```bash
npx shadcn@latest init --base-color neutral --yes
```

If the CLI asks any interactive questions despite `--yes`, accept defaults except: **base color = neutral**, **CSS variables = yes**, **React Server Components = no** (this is a Vite SPA, not Next.js).

Expected outputs:
- `components.json` created at repo root
- `src/lib/utils.ts` created with `cn` helper
- `src/index.css` overwritten with shadcn defaults (we'll replace it in Task 0.5)
- `tailwind.config.*` may or may not be created — Tailwind v4 doesn't require it

- [ ] **Step 2: Confirm `src/lib/utils.ts` exists and contains the canonical `cn` helper**

Open `src/lib/utils.ts`. It must read exactly:
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

If it differs, overwrite it with the snippet above.

- [ ] **Step 3: Confirm `components.json` has the expected shape**

Open `components.json`. Verify it sets `"style": "new-york"` (or `"default"`), `"tsx": true`, `"baseColor": "neutral"`, `"cssVariables": true`, and that `"aliases"` map to `@/components`, `@/lib`, `@/hooks`, `@/components/ui`. Adjust if any path is wrong.

- [ ] **Step 4: Do not commit yet** — Task 0.4 adds the primitives.

---

### Task 0.4: Add shadcn primitives via the CLI

**Files:**
- Create: `src/components/ui/{button,card,dialog,dropdown-menu,input,textarea,sheet,navigation-menu,form,label,badge,avatar,tooltip,sonner,separator}.tsx`

- [ ] **Step 1: Install every primitive used across all sections in one command**

Run:
```bash
npx shadcn@latest add \
  button card dialog dropdown-menu input textarea sheet navigation-menu \
  form label badge avatar tooltip sonner separator --yes
```

Expected: 15 files created under `src/components/ui/`. Each command also adds the relevant Radix dependency to `package.json`.

- [ ] **Step 2: Confirm all 15 ui files exist**

Run: `ls src/components/ui`
Expected list (order may differ):
```
avatar.tsx
badge.tsx
button.tsx
card.tsx
dialog.tsx
dropdown-menu.tsx
form.tsx
input.tsx
label.tsx
navigation-menu.tsx
separator.tsx
sheet.tsx
sonner.tsx
textarea.tsx
tooltip.tsx
```

- [ ] **Step 3: Commit shadcn setup**

```bash
git add components.json src/lib/utils.ts src/components/ui package.json package-lock.json
git commit -m "feat(shadcn): init shadcn/ui and add base primitives"
```

---

### Task 0.5: Write the design tokens in `src/index.css`

**Files:**
- Modify: `src/index.css` (full rewrite)

- [ ] **Step 1: Replace the entire file contents**

Overwrite `src/index.css` with:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@fontsource-variable/geist";
@import "@fontsource-variable/geist-mono";

@source './**/*.{js,jsx,ts,tsx,mdx,html}';
@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.18 0 0);

  --card: oklch(1 0 0);
  --card-foreground: oklch(0.18 0 0);

  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.18 0 0);

  --primary: oklch(0.7 0.19 146);
  --primary-foreground: oklch(0.99 0 0);

  --secondary: oklch(0.96 0 0);
  --secondary-foreground: oklch(0.2 0 0);

  --muted: oklch(0.96 0 0);
  --muted-foreground: oklch(0.5 0 0);

  --accent: oklch(0.96 0 0);
  --accent-foreground: oklch(0.2 0 0);

  --destructive: oklch(0.6 0.22 28);
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(0.92 0 0);
  --input: oklch(0.92 0 0);
  --ring: oklch(0.7 0.19 146);

  --radius: 0.75rem;

  --font-sans: "Geist Variable", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", sans-serif;
  --font-mono: "Geist Mono Variable", Menlo, Monaco, "Lucida Console",
    "Liberation Mono", monospace;
}

.dark {
  --background: oklch(0.14 0 0);
  --foreground: oklch(0.96 0 0);

  --card: oklch(0.18 0 0);
  --card-foreground: oklch(0.96 0 0);

  --popover: oklch(0.18 0 0);
  --popover-foreground: oklch(0.96 0 0);

  --primary: oklch(0.78 0.18 146);
  --primary-foreground: oklch(0.14 0 0);

  --secondary: oklch(0.22 0 0);
  --secondary-foreground: oklch(0.96 0 0);

  --muted: oklch(0.22 0 0);
  --muted-foreground: oklch(0.65 0 0);

  --accent: oklch(0.22 0 0);
  --accent-foreground: oklch(0.96 0 0);

  --destructive: oklch(0.55 0.22 28);
  --destructive-foreground: oklch(0.99 0 0);

  --border: oklch(1 0 0 / 0.08);
  --input: oklch(1 0 0 / 0.12);
  --ring: oklch(0.78 0.18 146);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}

html,
body {
  font-family: var(--font-sans);
  background-color: var(--background);
  color: var(--foreground);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

code,
pre,
kbd,
samp {
  font-family: var(--font-mono);
}

/* Hero dot-grid utility — applied only to the hero section's background layer */
.bg-dot-grid {
  background-image: radial-gradient(
    circle at center,
    var(--border) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
}

/* Hero radial accent glow — sits behind the headline */
.bg-hero-glow {
  background: radial-gradient(
    ellipse at center,
    color-mix(in oklch, var(--primary) 18%, transparent) 0%,
    transparent 60%
  );
}
```

- [ ] **Step 2: Do not commit yet** — `src/main.tsx` and `src/App.tsx` still import `@heroui/react` and will fail TypeScript. Continue.

---

### Task 0.6: Strip `index.html`

**Files:**
- Modify: `index.html` (replace head)

- [ ] **Step 1: Overwrite `index.html`**

Replace the entire file with:

```html
<!doctype html>
<html lang="en" suppressHydrationWarning>
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Teoman Kirma</title>
    <meta name="description" content="Personal portfolio of Teoman Kirma." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Removed: Google Fonts Manrope link, Font Awesome `<script>`. Geist is now bundled via the `@fontsource-variable/geist` imports in `src/index.css`.

---

### Task 0.7: Write `src/lib/gsap.ts`

**Files:**
- Create: `src/lib/gsap.ts`

- [ ] **Step 1: Create the file**

Write `src/lib/gsap.ts`:

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

if (typeof window !== "undefined") {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const applyReducedMotion = (reduced: boolean) => {
    gsap.defaults({ duration: reduced ? 0 : 0.6 });
    if (reduced) {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    }
  };
  applyReducedMotion(mq.matches);
  mq.addEventListener("change", (e) => applyReducedMotion(e.matches));
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
```

- [ ] **Step 2: Don't commit yet** — kept with Task 0.8's primitives.

---

### Task 0.8: Rewrite `src/components/common/Animations.tsx`

**Files:**
- Modify: `src/components/common/Animations.tsx` (full rewrite)

- [ ] **Step 1: Overwrite the file**

Write:

```tsx
import { useRef, type ElementType, type PropsWithChildren } from "react";
import { useGSAP, gsap, SplitText } from "@/lib/gsap";

type Variant =
  | "fadeUp"
  | "fadeIn"
  | "slideLeft"
  | "slideRight"
  | "zoomIn"
  | "splitChars"
  | "splitWords";

type RevealProps = PropsWithChildren<{
  as?: ElementType;
  className?: string;
  variant?: Variant;
  delay?: number;
  stagger?: number;
  /** When true, each direct child becomes a staggered item via the `.reveal-item` class. */
  staggerChildren?: boolean;
  /** ScrollTrigger start position (default "top 80%"). */
  start?: string;
}>;

const fromMap = {
  fadeUp: { y: 24, autoAlpha: 0 },
  fadeIn: { autoAlpha: 0 },
  slideLeft: { x: -32, autoAlpha: 0 },
  slideRight: { x: 32, autoAlpha: 0 },
  zoomIn: { scale: 0.95, autoAlpha: 0 },
  splitChars: { y: 24, autoAlpha: 0 },
  splitWords: { y: 24, autoAlpha: 0 },
} as const;

export function Reveal({
  as: Tag = "div",
  className,
  variant = "fadeUp",
  delay = 0,
  stagger = 0.08,
  staggerChildren = false,
  start = "top 80%",
  children,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const base = { ...fromMap[variant], ease: "power3.out", delay };
      const scrollTrigger = {
        trigger: ref.current,
        start,
        once: true,
      };

      if (variant === "splitChars" || variant === "splitWords") {
        const target = ref.current.firstElementChild as HTMLElement | null;
        if (!target) return;
        const split = SplitText.create(target, {
          type: variant === "splitChars" ? "chars" : "words",
        });
        const targets = variant === "splitChars" ? split.chars : split.words;
        gsap.from(targets, {
          ...base,
          stagger,
          duration: 0.5,
          scrollTrigger,
        });
        return () => split.revert();
      }

      if (staggerChildren) {
        gsap.from(ref.current.querySelectorAll(":scope > .reveal-item"), {
          ...base,
          stagger,
          scrollTrigger,
        });
      } else {
        gsap.from(ref.current, {
          ...base,
          scrollTrigger,
        });
      }
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
```

Note: When using `staggerChildren`, child elements must include `className="reveal-item"`. When using `splitChars`/`splitWords`, the **single direct child** (e.g., `<h1>`) is the split target.

---

### Task 0.9: Rewrite `src/components/common/ThemeSwitcher.tsx`

**Files:**
- Modify: `src/components/common/ThemeSwitcher.tsx` (full rewrite)

- [ ] **Step 1: Overwrite the file**

```tsx
import { useTheme } from "next-themes";
import { Laptop, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const current = theme ?? "system";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Theme: ${current}`}
          className="transition-transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
        >
          {current === "light" && <Sun className="h-4 w-4" />}
          {current === "dark" && <Moon className="h-4 w-4" />}
          {current === "system" && <Laptop className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### Task 0.10: Rewrite `src/components/common/LanguageSwitcher.tsx`

**Files:**
- Modify: `src/components/common/LanguageSwitcher.tsx` (full rewrite)

- [ ] **Step 1: Overwrite the file**

```tsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Language } from "@/types";
import { useAppStore } from "@/hooks/useAppStore";

function getLangEmoji(lang: Language) {
  return lang === "tr" ? "🇹🇷" : "🇬🇧";
}

function getLangLabel(lang: Language) {
  return lang === "tr" ? "Türkçe" : "English";
}

export function LanguageSwitcher() {
  const language = useAppStore((s) => s.language);
  const updateState = useAppStore((s) => s.updateState);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Language: ${getLangLabel(language)}`}
          className="transition-transform hover:-translate-y-0.5 hover:scale-105 active:scale-95"
        >
          <span aria-hidden className="text-lg">
            {getLangEmoji(language)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => updateState({ language: Language.EN })}>
          🇬🇧 English
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => updateState({ language: Language.TR })}>
          🇹🇷 Türkçe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

### Task 0.11: Rewrite shared section primitives

**Files:**
- Modify: `src/components/common/SectionHeader.tsx`
- Modify: `src/components/common/PageSection.tsx`
- Modify: `src/components/common/DownloadResumeButton.tsx`

- [ ] **Step 1: Overwrite `SectionHeader.tsx`**

```tsx
import type { SectionHeaderProps } from "@/types";
import { Reveal } from "./Animations";

export function SectionHeader({ header }: SectionHeaderProps) {
  return (
    <Reveal className="text-center pb-4" staggerChildren stagger={0.1}>
      <h2 className="reveal-item text-3xl md:text-5xl font-bold tracking-tight pb-2">
        {header}
      </h2>
      <div className="reveal-item mt-2 md:mt-3 h-1 w-16 mx-auto bg-primary rounded-full origin-left" />
    </Reveal>
  );
}
```

- [ ] **Step 2: Overwrite `PageSection.tsx`**

```tsx
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";
import { toSectionHref } from "@/utils";
import { SectionHeader } from "./SectionHeader";
import type { PageSectionProps } from "@/types";

export function PageSection({
  menuIndex,
  header,
  className,
  children,
}: PageSectionProps) {
  const language = useAppStore((s) => s.language);
  const t = translations[language];
  const id = toSectionHref(t.menuItems[menuIndex]).slice(1);
  const sectionClass = `section py-20 md:py-28${className ? ` ${className}` : ""}`;

  return (
    <section id={id} className={sectionClass}>
      {header ? (
        <div className="container mx-auto px-6 md:px-10">
          <SectionHeader header={header} />
        </div>
      ) : null}
      {children}
    </section>
  );
}
```

- [ ] **Step 3: Overwrite `DownloadResumeButton.tsx`**

```tsx
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export function DownloadResumeButton() {
  const language = useAppStore((s) => s.language);
  const t = translations[language];
  const resume = `${import.meta.env.BASE_URL}teoman-kirma-resume.pdf`;

  return (
    <Button asChild size="lg" className="rounded-full font-semibold">
      <a href={resume} download>
        <Download className="h-4 w-4" />
        {t.profile.downloadResume}
      </a>
    </Button>
  );
}
```

---

### Task 0.12: Rewrite the common barrel and delete obsolete primitive files

**Files:**
- Modify: `src/components/common/index.ts` (full rewrite)
- Delete: `src/components/common/animationVariants.ts`
- Delete: `src/components/common/SkillLogo.tsx`
- Delete: `src/components/common/PortfolioCard.tsx`

- [ ] **Step 1: Overwrite `src/components/common/index.ts`**

```ts
export { Reveal } from "./Animations";
export { SectionHeader } from "./SectionHeader";
export { PageSection } from "./PageSection";
export { ThemeSwitcher } from "./ThemeSwitcher";
export { LanguageSwitcher } from "./LanguageSwitcher";
export { DownloadResumeButton } from "./DownloadResumeButton";
```

- [ ] **Step 2: Delete the three obsolete files**

Run:
```bash
git rm src/components/common/animationVariants.ts
git rm src/components/common/SkillLogo.tsx
git rm src/components/common/PortfolioCard.tsx
```

---

### Task 0.13: Replace the providers in `src/main.tsx`

**Files:**
- Modify: `src/main.tsx` (full rewrite)

- [ ] **Step 1: Overwrite the file**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import { App } from "./App.tsx";
import { initGoogleAnalytics } from "@/utils/googleAnalytics";

initGoogleAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
      <Toaster richColors closeButton position="top-right" />
    </ThemeProvider>
  </StrictMode>
);
```

`HeroUIProvider` and HeroUI's `ToastProvider` are gone. `next-themes` writes `class="dark"` on `<html>` and our `.dark` CSS rules pick it up.

---

### Task 0.14: Replace `src/App.tsx` with a placeholder shell

**Files:**
- Modify: `src/App.tsx` (full rewrite)

- [ ] **Step 1: Overwrite the file**

```tsx
import { ThemeSwitcher, LanguageSwitcher } from "@/components/common";
import { usePageMeta } from "@/hooks/usePageMeta";

export const App = () => {
  usePageMeta();
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-6 md:px-10">
          <span className="font-mono text-sm">
            <span className="text-primary">●</span> Teoman Kirma
          </span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 md:px-10 py-32 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Migrating…
        </h1>
        <p className="mt-4 text-muted-foreground">
          The site is being rebuilt with shadcn/ui and GSAP.
        </p>
      </main>
    </>
  );
};

export default App;
```

This is the placeholder. Phase 1 swaps it for the real Header + Hero.

---

### Task 0.15: Delete old top-level section files and rewrite the components barrel

**Files:**
- Delete: `src/components/{Header,Home,KnowMeMore,Resume,Portfolio,Testimonial,ContactMe,Footer}.tsx`
- Modify: `src/components/index.ts` (rewrite)

- [ ] **Step 1: Delete the eight files**

```bash
git rm src/components/Header.tsx \
       src/components/Home.tsx \
       src/components/KnowMeMore.tsx \
       src/components/Resume.tsx \
       src/components/Portfolio.tsx \
       src/components/Testimonial.tsx \
       src/components/ContactMe.tsx \
       src/components/Footer.tsx
```

- [ ] **Step 2: Replace `src/components/index.ts` with an empty placeholder**

```ts
// Section barrels populated in Phases 1–3.
export {};
```

---

### Task 0.16: Remove all testimonial references from i18n and types

**Files:**
- Modify: `src/i18n/index.ts`
- Modify: `src/types/index.ts`

- [ ] **Step 1: Strip testimonial keys from `src/types/index.ts`**

In `src/types/index.ts`, **delete** the following:
- The `testimonial: { items: LocaleTestimonial[]; }` block inside `Translation` (lines ~68-70 in the current file).
- The `testimonials: { [key: string]: { key: string; name: string; rating: number } }` block inside `SharedI18n` (lines ~128-134).
- The `LocaleTestimonial` type at the bottom (lines ~171-175).

- [ ] **Step 2: Strip testimonial keys from `src/i18n/index.ts`**

In `src/i18n/index.ts`, **delete**:
- The `testimonials: { jay: …, patrick: …, chris: …, dennis: … }` block in `sharedI18n` (lines ~87-92).
- The entire `testimonial: { items: [...] }` block in `translations.en` (lines ~270-297).
- The entire `testimonial: { items: [...] }` block in `translations.tr` (lines ~507-534).

- [ ] **Step 3: Trim "Testimonial" out of both `menuItems` arrays**

In `translations.en`, replace:
```ts
    menuItems: [
      "Home",
      "About Me",
      "Resume",
      "Portfolio",
      "Testimonial",
      "Contact Me",
    ],
```
with:
```ts
    menuItems: ["Home", "About Me", "Resume", "Portfolio", "Contact Me"],
```

In `translations.tr`, replace:
```ts
    menuItems: [
      "Anasayfa",
      "Hakkımda",
      "Özgeçmiş",
      "Portföy",
      "Referanslar",
      "Bana Ulaşın",
    ],
```
with:
```ts
    menuItems: ["Anasayfa", "Hakkımda", "Özgeçmiş", "Portföy", "Bana Ulaşın"],
```

From this point on, Contact's section index is **4**, not 5.

- [ ] **Step 4: Verify type check is green**

Run: `npx tsc -b --noEmit`
Expected: zero errors. If any code still references `testimonial`, `testimonials`, or expects 6-entry menuItems, search and fix those references.

---

### Task 0.17: Add new Hero i18n keys

**Files:**
- Modify: `src/types/index.ts` (extend `Translation['home']`)
- Modify: `src/i18n/index.ts` (add EN + TR values)

- [ ] **Step 1: Extend the `home` type in `src/types/index.ts`**

Replace the existing `home` block inside `Translation` (which currently has `welcome`, `typewriter`, `location`, `hireMe`) with:

```ts
  home: {
    eyebrow: string;
    headlineLine1: string;
    headlineLine2: string;
    tagline: string;
    location: string;
    hireMe: string;
    secondaryCta: string;
  };
```

- [ ] **Step 2: Update `translations.en.home` in `src/i18n/index.ts`**

Replace the existing `home` block in the English translations with:

```ts
    home: {
      eyebrow: "~ /home/teoman",
      headlineLine1: "Teoman Kirma",
      headlineLine2: "Fullstack Developer",
      tagline:
        "I build performant, accessible web apps and the distributed systems behind them.",
      location: "Based in Izmir, Turkiye.",
      hireMe: "Get in touch",
      secondaryCta: "Download résumé",
    },
```

- [ ] **Step 3: Update `translations.tr.home` in `src/i18n/index.ts`**

Replace the Turkish `home` block with:

```ts
    home: {
      eyebrow: "~ /home/teoman",
      headlineLine1: "Teoman Kırma",
      headlineLine2: "Fullstack Geliştirici",
      tagline:
        "Performanslı ve erişilebilir web uygulamaları ile arkasındaki dağıtık sistemleri kuruyorum.",
      location: "İzmir, Türkiye merkezliyim.",
      hireMe: "İletişime geç",
      secondaryCta: "CV indir",
    },
```

- [ ] **Step 4: Verify**

Run: `npx tsc -b --noEmit`
Expected: zero errors.

---

### Task 0.18: Remove old deps and `hero.ts`

**Files:**
- Modify: `package.json`
- Delete: `hero.ts`

- [ ] **Step 1: Uninstall old packages**

Run:
```bash
npm uninstall \
  @heroui/react \
  @heroui/use-theme \
  motion \
  framer-motion \
  react-simple-typewriter \
  react-slick \
  @types/react-slick
```

Expected: `removed N packages`. `package.json` no longer lists any of the above.

- [ ] **Step 2: Delete `hero.ts`**

```bash
git rm hero.ts
```

- [ ] **Step 3: Verify nothing still imports the removed packages**

Run:
```bash
git grep -nE "@heroui|framer-motion|react-simple-typewriter|react-slick|motion/react" -- 'src/' 'index.html'
```
Expected: no output. If any results appear, hunt them down before continuing.

---

### Task 0.19: Bump React, Vite, TypeScript, and toolchain to latest

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Run the bumps**

```bash
npm install \
  react@latest react-dom@latest \
  @types/react@latest @types/react-dom@latest \
  vite@latest @vitejs/plugin-react-swc@latest \
  tailwindcss@latest @tailwindcss/vite@latest \
  typescript@latest \
  eslint@latest \
  @eslint/js@latest \
  typescript-eslint@latest \
  eslint-plugin-react-hooks@latest \
  eslint-plugin-react-refresh@latest \
  globals@latest \
  @types/node@latest
```

Expected: no peer-dep errors.

- [ ] **Step 2: Verify lint + build still pass**

Run: `npm run lint && npm run build`
Expected: both succeed. If a lint rule changed between versions and breaks, fix the affected files inline (no `--no-verify`).

---

### Task 0.20: Phase 0 smoke test and merge

**Files:** none modified

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Open `http://localhost:5173` in a browser.

- [ ] **Step 2: Visual checks**

Verify all six combinations work:
- Light + EN: placeholder reads "Migrating…", header shows "● Teoman Kirma".
- Light + TR: same layout, no untranslated strings.
- Dark + EN: dark background takes effect, green dot is visible.
- Dark + TR: as above.
- System + EN/TR: matches OS preference.
- Theme switcher dropdown shows three options with lucide icons.
- Language switcher toggles between 🇬🇧 / 🇹🇷.

- [ ] **Step 3: Final verification commands**

```bash
npm run lint
npm run build
```
Expected: zero errors.

- [ ] **Step 4: Commit Phase 0 wrap-up**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat(migration): foundation — shadcn + gsap + sonner + next-themes

Replaces HeroUI + Motion with shadcn/ui primitives, GSAP 3.13, Sonner toasts,
and next-themes for theme switching. Bumps React, Vite, Tailwind, TypeScript,
and ESLint toolchain to latest. Removes testimonial section from i18n + types.
Adds new hero i18n keys (eyebrow, headlineLine1, headlineLine2, tagline,
secondaryCta) in EN + TR. Leaves the site rendering a placeholder + header
shell; section components are rebuilt in Phases 1-3.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: Push and open PR**

```bash
git push -u origin feat/migration-foundation
gh pr create --title "feat(migration): foundation — shadcn + gsap + sonner + next-themes" --body "$(cat <<'EOF'
## Summary
- Replace HeroUI with shadcn/ui (15 primitives installed) and Motion with GSAP 3.13 (ScrollTrigger + SplitText + useGSAP).
- Switch toasts to Sonner; theme switching to next-themes; icons to lucide-react; fonts to bundled Geist Variable.
- Bump React, Vite, Tailwind, TypeScript, and ESLint toolchain to latest.
- Remove testimonial section + dummy data from i18n and types.
- Add new hero i18n keys in EN + TR.
- Site currently renders a placeholder; section components land in Phases 1-3.

## Test plan
- [ ] `npm run lint` clean
- [ ] `npm run build` clean
- [ ] Dev server boots; placeholder visible
- [ ] Theme switcher cycles light / dark / system, persisted via next-themes
- [ ] Language switcher cycles EN / TR; header label localizes via `usePageMeta`
- [ ] No `@heroui`, `motion`, `framer-motion`, or `react-simple-typewriter` import remains

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Phase 0 done. Merge after review (or rebase + merge depending on your repo workflow), then `git checkout main && git pull` before Phase 1.

---

## Phase 1 — Header + Hero

Branch: `feat/migration-header-hero`. Replaces the placeholder shell with the real sticky `Header` (using shadcn `NavigationMenu` + `Sheet`) and a redesigned `Hero` with GSAP `SplitText` headline reveal.

### Task 1.1: Create the branch from updated main

- [ ] **Step 1: Sync main and branch**

```bash
git checkout main && git pull
git checkout -b feat/migration-header-hero
```

---

### Task 1.2: Build the new `Header` section

**Files:**
- Create: `src/components/sections/Header.tsx`

- [ ] **Step 1: Create the file**

Write `src/components/sections/Header.tsx`:

```tsx
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher, LanguageSwitcher } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";
import { toSectionHref } from "@/utils";
import { cn } from "@/lib/utils";

export function Header() {
  const language = useAppStore((s) => s.language);
  const isMenuOpen = useAppStore((s) => s.isMenuOpen);
  const updateState = useAppStore((s) => s.updateState);
  const t = translations[language];

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/80 backdrop-blur transition-colors",
        scrolled ? "border-b border-border" : "border-b border-transparent"
      )}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-6 md:px-10">
        <a
          href={toSectionHref(t.menuItems[0])}
          onClick={scrollToTop}
          className="font-mono text-sm hover:opacity-80 transition-opacity"
        >
          <span className="text-primary">●</span> {t.name}
        </a>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-2">
            {t.menuItems.map((item) => (
              <NavigationMenuItem key={item}>
                <NavigationMenuLink
                  href={toSectionHref(item)}
                  className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Sheet
            open={isMenuOpen}
            onOpenChange={(open) => updateState({ isMenuOpen: open })}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetTitle className="px-6 pt-6 font-mono text-sm">
                <span className="text-primary">●</span> {t.name}
              </SheetTitle>
              <nav className="mt-8 flex flex-col gap-1 px-3">
                {t.menuItems.map((item) => (
                  <a
                    key={item}
                    href={toSectionHref(item)}
                    onClick={() => updateState({ isMenuOpen: false })}
                    className="rounded-md px-3 py-2 text-base font-medium hover:bg-accent transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
```

---

### Task 1.3: Build the new `Hero` section

**Files:**
- Create: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Create the file**

Write `src/components/sections/Hero.tsx`:

```tsx
import { useRef } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";
import { toSectionHref } from "@/utils";
import { useGSAP, gsap, SplitText } from "@/lib/gsap";

export function Hero() {
  const language = useAppStore((s) => s.language);
  const t = translations[language];
  const homeId = toSectionHref(t.menuItems[0]).slice(1);
  const contactHref = toSectionHref(t.menuItems[4]);
  const resumeHref = `${import.meta.env.BASE_URL}teoman-kirma-resume.pdf`;

  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const h1 = root.querySelector<HTMLHeadingElement>("[data-hero-headline]");
      if (!h1) return;
      const split = SplitText.create(h1, { type: "chars,words" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(root.querySelector("[data-hero-eyebrow]"), {
        y: 12,
        autoAlpha: 0,
        duration: 0.4,
      })
        .from(
          split.chars,
          { y: 24, autoAlpha: 0, stagger: 0.02, duration: 0.5 },
          "-=0.1"
        )
        .from(
          root.querySelector("[data-hero-tagline]"),
          { y: 16, autoAlpha: 0, duration: 0.5 },
          "-=0.2"
        )
        .from(
          root.querySelector("[data-hero-location]"),
          { y: 12, autoAlpha: 0, duration: 0.4 },
          "-=0.2"
        )
        .from(
          root.querySelectorAll("[data-hero-cta]"),
          { y: 12, autoAlpha: 0, stagger: 0.1, duration: 0.4 },
          "-=0.2"
        );

      return () => split.revert();
    },
    { scope, dependencies: [language] }
  );

  return (
    <section
      id={homeId}
      ref={scope}
      className="relative flex min-h-[80svh] items-center justify-center overflow-hidden"
    >
      <div className="bg-dot-grid absolute inset-0 -z-20 opacity-40" />
      <div className="bg-hero-glow absolute inset-x-0 top-1/3 -z-10 h-[60%]" />

      <div className="container mx-auto px-6 md:px-10 text-center">
        <p
          data-hero-eyebrow
          className="font-mono text-sm text-muted-foreground"
        >
          <span className="text-primary">~</span> /home/teoman
        </p>

        <h1
          data-hero-headline
          className="mt-6 text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05]"
        >
          {t.home.headlineLine1}
          <br />
          <span className="text-muted-foreground">{t.home.headlineLine2}</span>
        </h1>

        <p
          data-hero-tagline
          className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-foreground/80"
        >
          {t.home.tagline}
        </p>

        <Badge
          data-hero-location
          variant="outline"
          className="mt-6 font-mono text-xs"
        >
          <MapPin className="mr-1 h-3 w-3" /> {t.home.location}
        </Badge>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3">
          <Button
            data-hero-cta
            asChild
            size="lg"
            className="rounded-full font-semibold"
          >
            <a href={contactHref}>{t.home.hireMe}</a>
          </Button>
          <Button
            data-hero-cta
            asChild
            size="lg"
            variant="outline"
            className="rounded-full font-semibold"
          >
            <a href={resumeHref} download>
              {t.home.secondaryCta}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

---

### Task 1.4: Wire Header + Hero into `App.tsx`

**Files:**
- Modify: `src/App.tsx` (full rewrite)
- Modify: `src/components/index.ts` (re-export new sections)

- [ ] **Step 1: Overwrite `src/components/index.ts`**

```ts
export { Header } from "./sections/Header";
export { Hero } from "./sections/Hero";
```

- [ ] **Step 2: Overwrite `src/App.tsx`**

```tsx
import { Header, Hero } from "@/components";
import { usePageMeta } from "@/hooks/usePageMeta";

export const App = () => {
  usePageMeta();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <section className="container mx-auto px-6 md:px-10 py-32 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            More sections coming…
          </h2>
          <p className="mt-2 text-muted-foreground">
            About, Resume, Portfolio, and Contact land in upcoming phases.
          </p>
        </section>
      </main>
    </>
  );
};

export default App;
```

---

### Task 1.5: Phase 1 verification and PR

- [ ] **Step 1: Lint and build**

Run: `npm run lint && npm run build`
Expected: both green.

- [ ] **Step 2: Dev server visual check**

Run: `npm run dev` and verify:
- Hero loads, headline chars stagger in with SplitText.
- Eyebrow, tagline, location badge, and CTAs animate sequentially.
- Resize to <1024px: desktop nav hides, hamburger button appears, Sheet opens from the left.
- Click "Get in touch": page scrolls (no Contact section yet — just confirm anchor `#contact-me` does not error).
- Toggle theme: hero re-renders without artifacts; SplitText animation re-runs cleanly when language changes (dependencies array).
- EN → TR: headline + tagline + location + CTA labels swap; layout stable.
- `prefers-reduced-motion`: animations skip (set OS-level or DevTools rendering tab).

- [ ] **Step 3: Commit + PR**

```bash
git add -A
git commit -m "feat(migration): rebuild Header + Hero with shadcn + GSAP SplitText"
git push -u origin feat/migration-header-hero
gh pr create --title "feat(migration): Header + Hero" --body "$(cat <<'EOF'
## Summary
- New sticky Header with shadcn NavigationMenu (desktop) + Sheet (mobile)
- New Hero with eyebrow, GSAP SplitText headline, tagline, location badge, primary + outline CTAs
- Drops typewriter; replaces with SplitText character reveal

## Test plan
- [ ] Lint + build clean
- [ ] Header scroll border appears past 8px
- [ ] Mobile Sheet menu opens and closes
- [ ] Hero animation runs once per language switch
- [ ] EN + TR labels both render

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Merge, then `git checkout main && git pull`.

---

## Phase 2 — About + Resume + Skills Marquee

Branch: `feat/migration-about-resume`. Adds the About section (formerly KnowMeMore), the Resume cards, and the infinite-scroll skills marquee.

### Task 2.1: Create the branch

- [ ] **Step 1: Branch**

```bash
git checkout main && git pull
git checkout -b feat/migration-about-resume
```

---

### Task 2.2: Build the `About` section

**Files:**
- Create: `src/components/sections/About.tsx`

- [ ] **Step 1: Create the file**

Write `src/components/sections/About.tsx`:

```tsx
import {
  PageSection,
  Reveal,
  DownloadResumeButton,
} from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";
import me from "@/assets/me.png";

export function About() {
  const language = useAppStore((s) => s.language);
  const email = useAppStore((s) => s.email);
  const t = translations[language];
  const headerLabel = t.menuItems[1];

  return (
    <PageSection menuIndex={1} header={headerLabel}>
      <div className="container mx-auto px-6 md:px-10">
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-5" variant="slideLeft">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
              <img
                src={me}
                alt={t.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </Reveal>

          <Reveal
            className="lg:col-span-7 space-y-6"
            staggerChildren
            variant="fadeUp"
          >
            <h3 className="reveal-item text-2xl md:text-3xl font-semibold tracking-tight">
              {t.about.whoAmIA}{" "}
              <span className="text-primary font-bold">{t.name}</span>,{" "}
              {t.about.whoAmIB}.
            </h3>
            <p className="reveal-item text-base md:text-lg text-foreground/80">
              {t.about.aboutMe}
            </p>
            <p className="reveal-item text-base md:text-lg text-foreground/80">
              {t.about.myExperiences}
            </p>

            <dl className="reveal-item divide-y divide-border text-sm md:text-base">
              <div className="grid grid-cols-[8rem_1fr] py-3">
                <dt className="font-mono text-muted-foreground">
                  {t.profile.nameLabel}
                </dt>
                <dd>{t.name}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] py-3">
                <dt className="font-mono text-muted-foreground">
                  {t.profile.emailLabel}
                </dt>
                <dd>
                  <a
                    href={`mailto:${email}`}
                    className="relative inline-block after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full focus-visible:after:w-full"
                  >
                    {email}
                  </a>
                </dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] py-3">
                <dt className="font-mono text-muted-foreground">
                  {t.profile.ageLabel}
                </dt>
                <dd>{t.profile.age}</dd>
              </div>
              <div className="grid grid-cols-[8rem_1fr] py-3">
                <dt className="font-mono text-muted-foreground">
                  {t.profile.fromLabel}
                </dt>
                <dd>{t.profile.from}</dd>
              </div>
            </dl>

            <div className="reveal-item pt-2">
              <DownloadResumeButton />
            </div>
          </Reveal>
        </div>

        <Reveal
          className="mt-16 grid grid-cols-2 gap-8 items-center"
          staggerChildren
          variant="fadeUp"
        >
          <div className="reveal-item text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {t.stats.experienceYear}+
            </h2>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {t.stats.experienceText}
            </p>
          </div>
          <div className="reveal-item flex flex-col items-center">
            <div className="text-center border-l border-border pl-8">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {t.stats.projectsNumber}+
              </h2>
              <p className="mt-1 font-mono text-sm text-muted-foreground">
                {t.stats.projectsLabel}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </PageSection>
  );
}
```

---

### Task 2.3: Build the `SkillsMarquee` common component

**Files:**
- Create: `src/components/common/SkillsMarquee.tsx`
- Modify: `src/components/common/index.ts` (export it)

- [ ] **Step 1: Create the marquee**

Write `src/components/common/SkillsMarquee.tsx`:

```tsx
import { useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGSAP, gsap } from "@/lib/gsap";

export type SkillsMarqueeItem = {
  label: string;
  src: string;
  imgClassName?: string;
};

type Props = {
  items: SkillsMarqueeItem[];
  /** Pixels-per-second equivalent — controls speed (default 30s for full cycle). */
  durationSeconds?: number;
};

export function SkillsMarquee({ items, durationSeconds = 30 }: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!trackRef.current) return;
      const tween = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: durationSeconds,
        repeat: -1,
      });
      const onEnter = () => tween.pause();
      const onLeave = () => tween.resume();
      const root = scope.current;
      root?.addEventListener("mouseenter", onEnter);
      root?.addEventListener("mouseleave", onLeave);
      return () => {
        root?.removeEventListener("mouseenter", onEnter);
        root?.removeEventListener("mouseleave", onLeave);
        tween.kill();
      };
    },
    { scope }
  );

  // Duplicate items so the -50% loop is seamless.
  const doubled = [...items, ...items];

  return (
    <div
      ref={scope}
      className="relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <TooltipProvider delayDuration={150}>
        <div ref={trackRef} className="flex w-max gap-8 py-6">
          {doubled.map((skill, i) => (
            <Tooltip key={`${skill.label}-${i}`}>
              <TooltipTrigger asChild>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-card">
                  <img
                    src={skill.src}
                    alt={skill.label}
                    className={`h-12 w-12 object-contain ${skill.imgClassName ?? ""}`}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>{skill.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
```

- [ ] **Step 2: Add to the common barrel**

Append to `src/components/common/index.ts`:

```ts
export { SkillsMarquee } from "./SkillsMarquee";
export type { SkillsMarqueeItem } from "./SkillsMarquee";
```

---

### Task 2.4: Build the `Resume` section

**Files:**
- Create: `src/components/sections/Resume.tsx`

- [ ] **Step 1: Create the file**

Write `src/components/sections/Resume.tsx`:

```tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PageSection,
  Reveal,
  SkillsMarquee,
  type SkillsMarqueeItem,
} from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations, sharedI18n } from "@/i18n";
import uniLogo from "@/assets/nisantasi-university.png";
import companyLogo from "@/assets/bytesandpixels.jpeg";
import reactLogo from "@/assets/react.svg";
import tsLogo from "@/assets/typescript.svg";
import pythonLogo from "@/assets/python.svg";
import nextLogo from "@/assets/nextjs.svg";
import zustandLogo from "@/assets/zustand.svg";
import tanstackLogo from "@/assets/tanstack.svg";

export function Resume() {
  const language = useAppStore((s) => s.language);
  const t = translations[language];
  const { eduYears, companyName, gpa } = sharedI18n;
  const headerLabel = t.menuItems[2];

  const skills: SkillsMarqueeItem[] = [
    { label: sharedI18n.react, src: reactLogo },
    { label: sharedI18n.typescript, src: tsLogo },
    { label: sharedI18n.python, src: pythonLogo },
    { label: sharedI18n.nextjs, src: nextLogo, imgClassName: "dark:invert" },
    { label: sharedI18n.zustand, src: zustandLogo },
    { label: sharedI18n.tanstack, src: tanstackLogo, imgClassName: "invert dark:invert-0" },
  ];

  return (
    <PageSection menuIndex={2} header={headerLabel}>
      <div className="container mx-auto px-6 md:px-10">
        <Reveal
          className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8"
          staggerChildren
        >
          <Card className="reveal-item bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-xl md:text-2xl font-semibold mb-6">
                {t.resume.eduTitle}
              </h3>
              <div className="flex items-start gap-5">
                <img
                  src={uniLogo}
                  alt={t.resume.schoolName}
                  className="h-[72px] w-[72px] rounded-lg border border-border object-contain bg-secondary"
                />
                <div className="flex-1">
                  <Badge className="font-mono">{eduYears}</Badge>
                  <div className="mt-3 space-y-1">
                    <h4 className="text-lg md:text-xl font-semibold tracking-tight">
                      {t.resume.schoolName}
                    </h4>
                    <p className="text-foreground/80">{t.resume.degree}</p>
                    <p className="text-muted-foreground">
                      {t.resume.gpaLabel}: {gpa}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="reveal-item bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-xl md:text-2xl font-semibold mb-6">
                {t.resume.expTitle}
              </h3>
              <div className="flex items-start gap-5">
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-[72px] w-[72px] rounded-lg border border-border object-contain bg-secondary"
                />
                <div className="flex-1">
                  <Badge className="font-mono">{t.resume.expDates}</Badge>
                  <div className="mt-3 space-y-1">
                    <h4 className="text-lg md:text-xl font-semibold tracking-tight">
                      {companyName}
                    </h4>
                    <p className="text-foreground/80">{t.resume.expRole}</p>
                    <p className="text-muted-foreground">{t.resume.expLocation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>

      <div className="container mx-auto px-6 md:px-10 mt-16">
        <Reveal>
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-center">
            My Skills
          </h3>
          <SkillsMarquee items={skills} />
        </Reveal>
      </div>
    </PageSection>
  );
}
```

---

### Task 2.5: Wire About + Resume into `App.tsx`

**Files:**
- Modify: `src/components/index.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Extend `src/components/index.ts`**

```ts
export { Header } from "./sections/Header";
export { Hero } from "./sections/Hero";
export { About } from "./sections/About";
export { Resume } from "./sections/Resume";
```

- [ ] **Step 2: Overwrite `src/App.tsx`**

```tsx
import { Header, Hero, About, Resume } from "@/components";
import { usePageMeta } from "@/hooks/usePageMeta";

export const App = () => {
  usePageMeta();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Resume />
        <section className="container mx-auto px-6 md:px-10 py-32 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Portfolio + Contact coming next…
          </h2>
        </section>
      </main>
    </>
  );
};

export default App;
```

---

### Task 2.6: Phase 2 verification and PR

- [ ] **Step 1: Lint + build**

Run: `npm run lint && npm run build`
Expected: both green.

- [ ] **Step 2: Dev server checks**

Run `npm run dev` and confirm:
- About section reveals from scroll, bio paragraphs appear in stagger.
- Profile facts list renders with mono labels and dividers.
- Stats strip shows two big numbers, separated by border.
- Resume cards render with logos, badges (mono dates).
- Skills marquee scrolls infinitely, pauses on hover, snaps gracefully under `prefers-reduced-motion`.
- Skill tooltip appears after ~150ms hover.
- EN ↔ TR swap re-renders all text without console warnings.
- Light ↔ dark ↔ system all readable.

- [ ] **Step 3: Commit + PR**

```bash
git add -A
git commit -m "feat(migration): rebuild About + Resume + SkillsMarquee with shadcn + GSAP"
git push -u origin feat/migration-about-resume
gh pr create --title "feat(migration): About + Resume" --body "$(cat <<'EOF'
## Summary
- New About section (avatar + bio + profile facts + stats strip)
- New Resume section with shadcn Cards for Education + Experience
- New SkillsMarquee — infinite horizontal scroll, pause on hover, GSAP-driven, with shadcn Tooltip per skill

## Test plan
- [ ] Lint + build clean
- [ ] Reveals fire once per section on scroll
- [ ] Marquee pauses on hover and resumes on leave
- [ ] EN + TR text correct
- [ ] Light + dark + system all readable

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Merge, then `git checkout main && git pull`.

---

## Phase 3 — Portfolio + Contact + Footer

Branch: `feat/migration-portfolio-contact`. Replaces the remaining sections.

### Task 3.1: Create the branch

- [ ] **Step 1: Branch**

```bash
git checkout main && git pull
git checkout -b feat/migration-portfolio-contact
```

---

### Task 3.2: Build the new `PortfolioCard` common component

**Files:**
- Create: `src/components/common/PortfolioCard.tsx`
- Modify: `src/components/common/index.ts`

- [ ] **Step 1: Create the card**

Write `src/components/common/PortfolioCard.tsx`:

```tsx
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { PortfolioCardProps } from "@/types";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export function PortfolioCard({
  title,
  imageSrc,
  imageAlt,
  dummyText,
  linkHref,
  linkLabel,
  technologies,
  industry,
  date,
}: PortfolioCardProps) {
  const [open, setOpen] = useState(false);
  const language = useAppStore((s) => s.language);
  const t = translations[language];
  const labels = t.portfolio.cardLabels;

  return (
    <>
      <Card
        className="group cursor-pointer overflow-hidden bg-card border-border transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_0_0_1px_var(--primary)/30%]"
        onClick={() => setOpen(true)}
      >
        <CardContent className="p-0">
          <div className="aspect-[16/9] w-full overflow-hidden bg-secondary flex items-center justify-center">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-auto max-w-full object-contain"
            />
          </div>
          <div className="p-4 space-y-2">
            <h3 className="text-base md:text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {dummyText}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {technologies
                .split(",")
                .slice(0, 4)
                .map((tech) => (
                  <Badge
                    key={tech.trim()}
                    variant="secondary"
                    className="font-mono text-[10px]"
                  >
                    {tech.trim()}
                  </Badge>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">{title}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="rounded-xl overflow-hidden bg-secondary">
              <img src={imageSrc} alt={imageAlt} className="w-full h-auto" />
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">
                  {labels.projectInfo}
                </h4>
                <p className="text-foreground/80">{dummyText}</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">
                  {labels.projectDetails}
                </h4>
                <dl className="divide-y divide-border">
                  <div className="grid grid-cols-[7rem_1fr] py-2.5">
                    <dt className="font-mono text-muted-foreground">
                      {labels.link}
                    </dt>
                    <dd>
                      <a
                        href={linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                      >
                        {linkLabel}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </dd>
                  </div>
                  <div className="grid grid-cols-[7rem_1fr] py-2.5">
                    <dt className="font-mono text-muted-foreground">
                      {labels.technologies}
                    </dt>
                    <dd>{technologies}</dd>
                  </div>
                  <div className="grid grid-cols-[7rem_1fr] py-2.5">
                    <dt className="font-mono text-muted-foreground">
                      {labels.industry}
                    </dt>
                    <dd>{industry}</dd>
                  </div>
                  <div className="grid grid-cols-[7rem_1fr] py-2.5">
                    <dt className="font-mono text-muted-foreground">
                      {labels.date}
                    </dt>
                    <dd>{date}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

- [ ] **Step 2: Append to barrel**

Add to `src/components/common/index.ts`:

```ts
export { PortfolioCard } from "./PortfolioCard";
```

---

### Task 3.3: Build the `Portfolio` section

**Files:**
- Create: `src/components/sections/Portfolio.tsx`

- [ ] **Step 1: Create the file**

Write `src/components/sections/Portfolio.tsx`:

```tsx
import { useMemo } from "react";
import {
  PageSection,
  PortfolioCard,
  Reveal,
} from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations } from "@/i18n";

export function Portfolio() {
  const language = useAppStore((s) => s.language);
  const t = translations[language];
  const headerLabel = t.menuItems[3];

  const orderedItems = useMemo(
    () => [...(t.portfolio.items ?? [])].reverse(),
    [t.portfolio.items]
  );

  return (
    <PageSection menuIndex={3} header={headerLabel}>
      <div className="container mx-auto px-6 md:px-10">
        <Reveal>
          <p className="text-center text-lg font-medium py-8 text-muted-foreground">
            {t.portfolio.subtitle}
          </p>
        </Reveal>
        <Reveal
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerChildren
          stagger={0.1}
        >
          {orderedItems.map((item) => (
            <div key={item.key} className="reveal-item">
              <PortfolioCard
                title={item.title}
                imageSrc={item.imageSrc}
                imageAlt={item.imageAlt}
                dummyText={item.description}
                linkHref={item.details.linkHref}
                linkLabel={item.details.linkLabel}
                technologies={item.details.technologies}
                industry={item.details.industry}
                date={item.details.date}
              />
            </div>
          ))}
        </Reveal>
      </div>
    </PageSection>
  );
}
```

---

### Task 3.4: Build the `Contact` section

**Files:**
- Create: `src/components/sections/Contact.tsx`

- [ ] **Step 1: Create the file**

Write `src/components/sections/Contact.tsx`:

```tsx
import { Mail, Twitter, Github, Linkedin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PageSection, Reveal } from "@/components/common";
import { useAppStore } from "@/hooks/useAppStore";
import { translations, sharedI18n } from "@/i18n";
import {
  contactDefaultValues,
  makeContactFormSchema,
  type ContactFormSchemaValues,
} from "@/schemas";
import hi from "@/assets/hi.gif";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export function Contact() {
  const language = useAppStore((s) => s.language);
  const email = useAppStore((s) => s.email);
  const t = translations[language];
  const headerLabel = t.menuItems[4];

  const formSchema = makeContactFormSchema(language);
  const form = useForm<ContactFormSchemaValues>({
    resolver: zodResolver(formSchema),
    defaultValues: contactDefaultValues,
    mode: "onTouched",
  });

  const onSubmit = async () => {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.warning(t.contact.toast.notConfiguredTitle, {
        description: t.contact.toast.notConfiguredDescription,
      });
      return;
    }
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        "#contact-form",
        EMAILJS_PUBLIC_KEY
      );
      toast.success(t.contact.toast.successTitle, {
        description: t.contact.toast.successDescription,
      });
      form.reset();
    } catch {
      toast.error(t.contact.toast.failedTitle, {
        description: t.contact.toast.failedDescription,
      });
    }
  };

  return (
    <PageSection menuIndex={4} header={headerLabel}>
      <div className="container mx-auto px-6 md:px-10">
        <Reveal
          className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
          staggerChildren
        >
          <div className="reveal-item lg:col-span-4 space-y-6">
            <h3 className="text-xl md:text-2xl font-semibold">
              {t.contact.title}
            </h3>
            <img
              src={hi}
              alt="Hello gif"
              className="w-full h-56 rounded-lg object-cover border border-border"
            />
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <a
                href={`mailto:${email}`}
                className="relative font-bold after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full focus-visible:after:w-full"
              >
                {email}
              </a>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4">
                {t.contact.followMe}
              </h3>
              <div className="flex items-center gap-4 text-muted-foreground">
                <a
                  href={sharedI18n.socialLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="transition-transform hover:-translate-y-0.5 hover:text-primary"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href={sharedI18n.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="transition-transform hover:-translate-y-0.5 hover:text-primary"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href={sharedI18n.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="transition-transform hover:-translate-y-0.5 hover:text-primary"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="reveal-item lg:col-span-8">
            <h3 className="text-xl md:text-2xl font-semibold mb-6">
              {t.contact.sendMeANote}
            </h3>
            <Form {...form}>
              <form
                id="contact-form"
                noValidate
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.contact.yourNameLabel}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.profile.emailLabel}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.contact.messageLabel}</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={6}
                          placeholder={t.contact.messagePlaceholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    size="lg"
                    className="rounded-full font-semibold px-8"
                    disabled={!form.formState.isValid || form.formState.isSubmitting}
                  >
                    {t.contact.sendMessageButton}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Reveal>
      </div>
    </PageSection>
  );
}
```

---

### Task 3.5: Build the new `Footer` section

**Files:**
- Create: `src/components/sections/Footer.tsx`

- [ ] **Step 1: Create the file**

Write `src/components/sections/Footer.tsx`:

```tsx
import { useAppStore } from "@/hooks/useAppStore";
import { translations, sharedI18n } from "@/i18n";

export function Footer() {
  const language = useAppStore((s) => s.language);
  const t = translations[language];
  const { footerCopyright, copyrightLabel } = t.footer;
  const { currentYear } = sharedI18n;

  return (
    <footer className="border-t border-border py-10 md:py-12">
      <div className="container mx-auto px-6 md:px-10">
        <p className="text-center font-mono text-sm text-muted-foreground">
          {copyrightLabel} © {currentYear} {t.name}. {footerCopyright}
        </p>
      </div>
    </footer>
  );
}
```

---

### Task 3.6: Wire the final `App.tsx`

**Files:**
- Modify: `src/components/index.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Extend `src/components/index.ts`**

```ts
export { Header } from "./sections/Header";
export { Hero } from "./sections/Hero";
export { About } from "./sections/About";
export { Resume } from "./sections/Resume";
export { Portfolio } from "./sections/Portfolio";
export { Contact } from "./sections/Contact";
export { Footer } from "./sections/Footer";
```

- [ ] **Step 2: Overwrite `src/App.tsx`**

```tsx
import {
  Header,
  Hero,
  About,
  Resume,
  Portfolio,
  Contact,
  Footer,
} from "@/components";
import { usePageMeta } from "@/hooks/usePageMeta";

export const App = () => {
  usePageMeta();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Resume />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;
```

---

### Task 3.7: Phase 3 verification and PR

- [ ] **Step 1: Lint + build**

Run: `npm run lint && npm run build`
Expected: both green.

- [ ] **Step 2: Dev server full smoke test**

Run `npm run dev`. Verify:
- Header desktop nav shows 5 items (Home / About Me / Resume / Portfolio / Contact Me). Mobile Sheet too.
- All sections render in order: Hero → About → Resume → Portfolio → Contact → Footer.
- Portfolio: cards reveal in stagger; click a card → Dialog opens with image + details; Esc / click outside / close button dismiss it.
- Portfolio card hover: lift + green border tint.
- Contact form: empty submit blocked; valid submit attempt triggers Sonner toast (`warning` if EmailJS env vars are unset, `success` or `error` otherwise).
- Toggle language → toast titles and validation messages also localize.
- Toggle theme → no visual regressions across any section.
- `prefers-reduced-motion`: reveals snap to final state, marquee freezes.

- [ ] **Step 3: Commit + PR**

```bash
git add -A
git commit -m "feat(migration): rebuild Portfolio + Contact + Footer; switch to Sonner toasts"
git push -u origin feat/migration-portfolio-contact
gh pr create --title "feat(migration): Portfolio + Contact + Footer" --body "$(cat <<'EOF'
## Summary
- New PortfolioCard with shadcn Card + Dialog; hover lift + accent ring
- New Portfolio grid (3/2/1) with reverse-chronological order
- New Contact section with shadcn Form, Sonner toasts (replaces HeroUI addToast 1:1), and existing EmailJS flow preserved
- New Footer (mono, centered, top border)
- Trim menuItems to 5 entries (Testimonial removed)

## Test plan
- [ ] Lint + build clean
- [ ] Portfolio Dialog opens / closes / scrolls
- [ ] Contact form validates and submits; all four toast states fire
- [ ] EN + TR for every section
- [ ] Light + dark + system

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Merge, then `git checkout main && git pull`.

---

## Phase 4 — Polish

Branch: `feat/migration-polish`. Final pass for accessibility, performance, docs.

### Task 4.1: Reduced-motion audit

**Files:** none modified unless an issue is found

- [ ] **Step 1: Toggle reduced-motion in Chrome DevTools**

Open DevTools → Rendering → "Emulate CSS media feature `prefers-reduced-motion`" → `reduce`.

- [ ] **Step 2: Verify every section**

For each section (Hero, About, Resume, Portfolio, Contact, Header sticky border, Skills marquee), reload and confirm the content is **visible at final state** without animation. Marquee should be stationary or not visible-as-scrolling.

- [ ] **Step 3: Fix any issues**

If an element animates regardless: locate the `useGSAP` block, check whether `gsap.from(...)` is being skipped. The global `gsap.defaults({ duration: reduced ? 0 : 0.6 })` in `src/lib/gsap.ts` makes `from` complete instantly; if you still see motion, the call probably uses an explicit `duration:` that overrides the default. Convert it to use the default by removing the local `duration` when `mq.matches`.

---

### Task 4.2: Lighthouse performance pass

**Files:** none unless an issue is found

- [ ] **Step 1: Build + preview**

```bash
npm run build
npm run preview
```

- [ ] **Step 2: Run Lighthouse**

In Chrome DevTools → Lighthouse → "Mobile" + "Performance, Accessibility, Best Practices, SEO" → Analyze the preview URL.

- [ ] **Step 3: Targets**

- Performance ≥ 90
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
- Accessibility ≥ 95

- [ ] **Step 4: Fix common issues**

- Large images: confirm portfolio screenshots are at reasonable resolution (consider `loading="lazy"` on Portfolio card images — add `loading="lazy"` to the `<img>` inside `PortfolioCard.tsx`).
- LCP delay: add `fetchPriority="high"` on the avatar image in About (the largest above-the-fold image once Hero is read).
- CLS from font swap: confirm Geist is loaded via `@fontsource-variable/geist` (already done in `src/index.css`); no external Google Fonts.

If targets are missed, commit fixes inline.

---

### Task 4.3: Update `README.md` and `AGENTS.md`

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: Update `README.md`**

In `README.md`, find every reference to **HeroUI** and replace with the new stack. Specifically:

- Replace the opening line "Personal portfolio for Teoman Kirma built with React, Vite, HeroUI, and TailwindCSS." with: "Personal portfolio for Teoman Kirma built with React, Vite, shadcn/ui, Tailwind v4, and GSAP."
- Remove the section about "HeroUI Tailwind plugin" / `hero.ts`.
- Update "Key Concepts → Theming" to mention `next-themes` instead of `@heroui/use-theme`.
- Update "Animations" bullet to read: "GSAP `<Reveal>` primitive in `src/components/common/Animations.tsx`. Section components use `useGSAP` from `@gsap/react`. Plugins registered once in `src/lib/gsap.ts`."
- Update "Forms" bullet to: "The contact form uses react-hook-form + Zod + shadcn `Form`. Submission feedback is delivered via Sonner toasts."

- [ ] **Step 2: Update `AGENTS.md`**

In `AGENTS.md`:
- Replace "HeroUI via `HeroUIProvider` in `main.tsx`" with "shadcn/ui primitives in `src/components/ui/`; `ThemeProvider` (next-themes) + `Toaster` (sonner) wrap the app in `main.tsx`."
- Remove the `@plugin '../hero.ts'` reference.
- Replace "Animations: `src/components/common/Animations.tsx` provides reusable Motion primitives" with "Animations: `src/components/common/Animations.tsx` exposes a single GSAP `<Reveal>` primitive; section-specific animations live inside each section's `useGSAP` block. Plugins are registered once in `src/lib/gsap.ts`."
- Update the components list to reference the new `src/components/sections/` directory and remove `Testimonial` from the list.
- Update the "Tech Stack" section: drop "HeroUI 2"; add "shadcn/ui", "GSAP 3.13", "Sonner", "next-themes", "lucide-react", "Geist Variable".
- Update "Motion usage" bullet to: "Use `<Reveal>` for scroll-driven section reveals (variants: fadeUp, fadeIn, slideLeft, slideRight, zoomIn, splitChars, splitWords). Hover lifts/scales should use Tailwind transform utilities, not a wrapper."
- Update i18n key list to drop the testimonial section and reflect the new `home` keys: `eyebrow`, `headlineLine1`, `headlineLine2`, `tagline`, `location`, `hireMe`, `secondaryCta`. Also note that `menuItems` is now 5 entries (Testimonial removed).

- [ ] **Step 3: Verify `@source` glob still matches**

Open `src/index.css`. Confirm `@source './**/*.{js,jsx,ts,tsx,mdx,html}';` is present and covers the new `src/components/sections/` and `src/components/ui/` directories (it does — the glob is recursive from `src/`).

---

### Task 4.4: Final cross-cutting smoke test and PR

- [ ] **Step 1: Run all verifications**

```bash
npm run lint
npm run build
npm run preview
```
Expected: all green.

- [ ] **Step 2: Smoke check the preview build**

Open the preview URL. Run through:
1. EN + light: every section renders, Lighthouse Performance ≥ 90.
2. EN + dark: every section renders.
3. TR + light + dark: every section renders, no untranslated strings.
4. Mobile breakpoint (DevTools 375×667): hero stacks, header collapses to Sheet, portfolio is 1 col.
5. Reduced-motion: all animations skip.
6. Contact form: valid submit → success toast; invalid → field errors; missing env → warning toast.
7. Portfolio: click a card → Dialog; Esc closes.

- [ ] **Step 3: Commit + PR**

```bash
git add -A
git commit -m "feat(migration): polish — reduced-motion audit, lighthouse, docs"
git push -u origin feat/migration-polish
gh pr create --title "feat(migration): polish" --body "$(cat <<'EOF'
## Summary
- Reduced-motion audit across all sections
- Lighthouse pass (Performance, LCP, CLS, INP targets met)
- README and AGENTS.md updated to reflect new stack

## Test plan
- [ ] Lint + build + preview all clean
- [ ] Lighthouse Performance ≥ 90
- [ ] EN + TR × light/dark/system × mobile/desktop matrix passes
- [ ] No `@heroui` / `motion` / `framer-motion` / `react-simple-typewriter` references in docs

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Merge. Migration complete.

---

## Appendix A — Verification commands cheat sheet

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR (port 5173) |
| `npm run lint` | ESLint across the project |
| `npm run build` | `tsc -b` then Vite production build to `dist/` |
| `npm run preview` | Serve the production build locally for Lighthouse |
| `npx tsc -b --noEmit` | Type-check only, no emit |
| `git grep -nE "@heroui\|framer-motion\|react-simple-typewriter\|react-slick\|motion/react" -- src/ index.html` | Confirm zero legacy imports remain |

---

## Appendix B — Subagent dispatch (for subagent-driven-development)

Phases 0 and 4 are largely sequential (each task depends on prior state and primarily touches config/docs) and should be executed in a single subagent stream.

Within phases 1–3, certain tasks are independent and can be dispatched in parallel:

- **Phase 1**: Task 1.2 (Header) and Task 1.3 (Hero) are independent — they touch separate files. Dispatch in parallel after Task 1.1. Task 1.4 (wire to App.tsx) depends on both. Task 1.5 is verification.
- **Phase 2**: Task 2.2 (About) and Task 2.3 (SkillsMarquee) are independent. Task 2.4 (Resume) depends on 2.3. Task 2.5 (App.tsx wiring) depends on 2.2 and 2.4. Task 2.6 is verification.
- **Phase 3**: Task 3.2 (PortfolioCard), Task 3.4 (Contact), and Task 3.5 (Footer) are independent. Task 3.3 (Portfolio section) depends on 3.2. Task 3.6 (App.tsx wiring) depends on 3.3, 3.4, 3.5. Task 3.7 is verification.

Recommended dispatch model: one subagent per leaf task, orchestrator merges and runs the integration tasks (App.tsx wiring + verification) directly.
