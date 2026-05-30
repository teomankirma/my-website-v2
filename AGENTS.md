# Repository Guidelines

## Project Overview

Personal portfolio for Teoman Kirma. Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, shadcn/ui, GSAP, next-intl (EN/TR), next-themes, sonner, Geist fonts, EmailJS.

**Branch:** All feature work happens on `redesign/dark-technical`. Do NOT merge to `main` without explicit user approval.

## Project Structure

```
├── messages/               # i18n strings - en.json and tr.json
├── public/                 # Static assets (resume.pdf, favicon.png)
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root passthrough (no <html> tag)
│   │   └── [locale]/
│   │       ├── layout.tsx           # Locale layout - owns <html lang>, Geist, Providers, Toaster
│   │       ├── page.tsx             # Full page assembly (all 6 sections)
│   │       └── opengraph-image.tsx  # Edge OG image 1200x630
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives (auto-generated, do not hand-edit)
│   │   ├── common/          # Shared: Reveal, SkillsMarquee, Section, SectionHeader,
│   │   │                    #         ThemeSwitcher, LanguageSwitcher, DownloadResumeButton
│   │   ├── sections/        # Header, Hero, About, Resume, Portfolio, Contact, Footer
│   │   └── providers.tsx    # ThemeProvider (next-themes)
│   ├── i18n/
│   │   ├── routing.ts       # Locales: ['en', 'tr'], default: 'en'
│   │   ├── request.ts       # getRequestConfig
│   │   └── navigation.ts    # createNavigation (Link, useRouter, usePathname, etc.)
│   ├── lib/
│   │   ├── gsap.ts          # Register ScrollTrigger + SplitText + useGSAP once
│   │   ├── site.ts          # Locale-neutral constants (EMAIL, SKILLS, SOCIAL_LINKS, AGE, etc.)
│   │   ├── projects.ts      # PROJECTS array
│   │   └── utils.ts         # cn()
│   ├── schemas/
│   │   └── contact.ts       # makeContactSchema (zod v4), ContactValues, ContactMessages
│   ├── styles/
│   │   └── globals.css      # @import "tailwindcss" + CSS tokens (dark default, emerald)
│   └── proxy.ts             # next-intl middleware (Next.js 16 convention - do NOT rename)
```

## Key Conventions

### Routing & i18n
- Locale prefix required: all pages are under `/[locale]`.
- `src/proxy.ts` is the middleware file (Next.js 16). Do not rename to `middleware.ts`.
- All human-readable strings belong in `messages/en.json` and `messages/tr.json`. Locale-neutral data (URLs, tech strings, computed values) belongs in `src/lib/`.
- Use `setRequestLocale(locale)` in Server Components; `useTranslations()` in Client Components.

### Components
- All components that use GSAP, hooks, event handlers, or browser APIs must be `'use client'`.
- Server Components: page.tsx, layout.tsx, About, Resume, Footer (no interactivity needed).
- GSAP animations: always inside `useGSAP(() => { ... }, {scope: ref})` from `@gsap/react`.
- Reduced motion: wrap ALL `gsap.from/to/timeline` calls in `gsap.matchMedia('(prefers-reduced-motion: no-preference)', ...)`.
- Import GSAP from `@/lib/gsap` (not directly from `gsap`) to ensure plugins are registered.

### Styling
- Tailwind v4 - CSS token approach (no tailwind.config.js).
- Tokens are in `src/styles/globals.css` under `:root` (light) and `.dark` (dark).
- Single emerald accent: `--primary` and `--ring` are `oklch(0.72 0.19 150)` in dark mode.
- shadcn/ui components live in `src/components/ui/`. Use `npx shadcn@latest add <component>` to add new ones.
- `cn()` from `@/lib/utils` for conditional class merging.

### Forms & Validation
- Contact form: react-hook-form + `zodResolver` + `makeContactSchema` from `@/schemas/contact`.
- Zod v4 idiom: use `{error: message}` param (not positional string) to avoid deprecation warnings.
- EmailJS field names (`name`, `email`, `message`) match the registered EmailJS template variables.

### Icons
- UI/functional icons: `lucide-react`.
- Brand icons (GitHub, LinkedIn, X/Twitter, etc.): `@icons-pack/react-simple-icons`. Lucide does not include brand icons.
- LinkedIn uses an inline SVG (no @icons-pack export available for all providers).

### Assets
- Project images: `src/assets/*.png/.jpeg` (imported with `next/image`).
- Static files (PDF, favicon): `public/` directory.
- Resume URL: `/resume.pdf` (set in `src/lib/site.ts` as `RESUME_URL`).

## Verification Gates

Run before every commit:
```bash
npx tsc --noEmit   # must be clean
npm run lint        # must be clean (eslint .)
npm run build       # must succeed
```

## Adding Content

### New project
1. Add image to `src/assets/`.
2. Add entry to `PROJECTS` in `src/lib/projects.ts`.
3. Add `items.<key>` to both `messages/en.json` and `messages/tr.json`.

### New section
1. Create `src/components/sections/<name>.tsx`.
2. Add `id` to `SECTION_IDS` in `src/lib/site.ts`.
3. Add translations to `messages/en.json` and `messages/tr.json`.
4. Add nav entry in `src/components/sections/header.tsx` NAV array.
5. Import + render in `src/app/[locale]/page.tsx`.

### New i18n strings
Always add to BOTH `messages/en.json` and `messages/tr.json` simultaneously.

## Environment Variables

| Key | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Yes (contact form) | EmailJS service ID |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Yes (contact form) | EmailJS template ID |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Yes (contact form) | EmailJS public key |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics 4 ID |

Copy `.env.example` to `.env.local` and fill in values. Never commit secrets.

## Dev Commands

```bash
npm run dev        # http://localhost:3000/en
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint .
npm run typecheck  # tsc --noEmit
```

## Deploy

Vercel. Set `NEXT_PUBLIC_*` vars in Vercel project settings. Build command: `npm run build`.
