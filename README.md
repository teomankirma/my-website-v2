# Teoman Kirma - Portfolio

Personal portfolio for Teoman Kirma. Built with Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, shadcn/ui, GSAP, next-intl (EN + TR), and Geist fonts. Dark theme by default with light mode toggle.

## Quick Start

1. **Clone** the repository:
   ```bash
   git clone https://github.com/teomankirma/my-website-v2.git
   cd my-website-v2
   ```
2. **Node version** - use Node v22 (`nvm use` if you have `.nvmrc`).
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Environment variables** - copy `.env.example` to `.env.local` and fill in the keys:
   ```bash
   cp .env.example .env.local
   ```
5. **Start the dev server**:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000/en` (or `/tr` for Turkish).

## Environment Variables

All public config uses `NEXT_PUBLIC_` prefixed vars so Next.js exposes them to the client bundle.

| Key | Description |
| --- | --- |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS service identifier for the contact form. |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS template used when sending contact form submissions. |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Public API key from EmailJS. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional Google Analytics 4 measurement ID. Leave unset for local/dev. |

`.env.local` is git-ignored. The contact form gracefully shows a toast warning if EmailJS vars are missing.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server with HMR at `http://localhost:3000`. |
| `npm run build` | Build optimized production output to `.next/`. |
| `npm run start` | Serve the production build locally. |
| `npm run lint` | Run ESLint across the repo (`eslint .`). |
| `npm run typecheck` | Run TypeScript type check (`tsc --noEmit`). |

## Project Structure

```
├── messages/
│   ├── en.json           # English translations (all human-readable strings)
│   └── tr.json           # Turkish translations
├── public/
│   ├── resume.pdf        # Resume file served at /resume.pdf
│   └── favicon.png       # Favicon
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root passthrough layout (no html tag)
│   │   └── [locale]/
│   │       ├── layout.tsx          # Locale layout: html lang, Geist fonts, Providers, Toaster
│   │       ├── page.tsx            # Full page (all 6 sections assembled)
│   │       └── opengraph-image.tsx # Dynamic OG image (1200x630, edge runtime)
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives (button, card, dialog, etc.)
│   │   ├── common/                 # Shared components:
│   │   │   ├── reveal.tsx          # GSAP scroll-reveal primitive (respects prefers-reduced-motion)
│   │   │   ├── skills-marquee.tsx  # Looping GSAP marquee (pause on hover)
│   │   │   ├── section.tsx         # Section wrapper with max-width + scroll-mt
│   │   │   ├── section-header.tsx  # Section heading
│   │   │   ├── theme-switcher.tsx  # Light/dark/system dropdown (next-themes)
│   │   │   ├── language-switcher.tsx  # EN/TR dropdown (next-intl routing)
│   │   │   └── download-resume-button.tsx  # Resume download CTA
│   │   ├── sections/               # Page sections:
│   │   │   ├── header.tsx          # Sticky header + mobile Sheet + scroll-border
│   │   │   ├── hero.tsx            # Hero with SplitText name animation
│   │   │   ├── about.tsx           # About prose + facts + stats
│   │   │   ├── resume.tsx          # Education + experience cards + skills marquee
│   │   │   ├── portfolio.tsx       # Pinned horizontal pan (desktop) + Dialog detail
│   │   │   ├── contact.tsx         # EmailJS contact form + social links
│   │   │   └── footer.tsx          # Copyright footer
│   │   └── providers.tsx           # next-themes ThemeProvider
│   ├── i18n/
│   │   ├── routing.ts              # defineRouting (locales: ['en', 'tr'])
│   │   ├── request.ts              # getRequestConfig for next-intl
│   │   └── navigation.ts          # createNavigation (Link, useRouter, etc.)
│   ├── lib/
│   │   ├── gsap.ts                 # GSAP + plugins registration (ScrollTrigger, SplitText, useGSAP)
│   │   ├── site.ts                 # Locale-neutral constants (EMAIL, SKILLS, SOCIAL_LINKS, AGE, etc.)
│   │   ├── projects.ts             # PROJECTS array with images and metadata
│   │   └── utils.ts                # cn() helper (shadcn)
│   ├── schemas/
│   │   └── contact.ts              # Zod v4 contact form schema with localized messages
│   ├── styles/
│   │   └── globals.css             # Tailwind v4 import + CSS tokens (dark default, emerald accent)
│   └── proxy.ts                    # Next.js 16 middleware (next-intl, locale routing)
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5.8 (strict) |
| Styling | Tailwind CSS v4, shadcn/ui, Geist fonts |
| Animation | GSAP 3.13 + @gsap/react (ScrollTrigger, SplitText) |
| i18n | next-intl (`/en`, `/tr` routing via `src/proxy.ts`) |
| Theming | next-themes (dark default, light, system) |
| Toasts | sonner |
| Forms | react-hook-form + zod v4 |
| Email | @emailjs/browser |
| Icons | lucide-react, @icons-pack/react-simple-icons |
| Date | luxon |
| Deploy | Vercel |

## Routing

The site uses next-intl locale routing. URLs are:
- `/en` - English version
- `/tr` - Turkish version
- `/` - redirects to `/en` (default locale)

Middleware is configured in `src/proxy.ts` (Next.js 16 convention).

## Animations

- **Hero**: GSAP SplitText chars reveal on load
- **Sections**: `<Reveal>` component uses ScrollTrigger (fade/slide variants)
- **Skills marquee**: continuous GSAP loop, pauses on hover
- **Portfolio**: pinned horizontal pan on desktop (reduced-motion users get native scroll-snap)
- All animations are gated behind `prefers-reduced-motion: no-preference` via `gsap.matchMedia`

## EmailJS Setup

1. Create a service, template, and public key at [emailjs.com](https://www.emailjs.com/).
2. Add keys to `.env.local` as `NEXT_PUBLIC_EMAILJS_*`.
3. Ensure your template uses `name`, `email`, and `message` field variables.

## Deployment

Deploy to [Vercel](https://vercel.com/):
1. Push to GitHub and import into Vercel.
2. Set `NEXT_PUBLIC_EMAILJS_*` environment variables in Vercel project settings.
3. Build command: `npm run build`. Output directory: `.next`.

## Contributing

- Follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- Run `npm run lint` and `npm run typecheck` before committing.
- All human-readable strings live in `messages/en.json` and `messages/tr.json` - update both when adding content.
- Keep all animations in `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` wrappers.
