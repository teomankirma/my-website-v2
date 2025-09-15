# Teoman Kirma — Portfolio (React + Vite)

Personal portfolio website with English/Turkish content, responsive navigation, themed UI, and lightweight animations built on Motion and HeroUI.

## Features
- Responsive navbar with menu toggle
- Theme switcher (light/dark/system) and language switcher (EN/TR)
- Hero with avatar and typewriter intro
- Sections: Know Me More, Resume, Portfolio, Testimonials, Contact
- Smooth, reusable scroll‑reveal animations using Motion
- Subtle hover animations on buttons, links, and cards
- Clickable site name in header scrolls to top
- EmailJS contact form with localized validation

## Tech Stack
- React 19, Vite 7, TypeScript 5.8
- HeroUI 2, TailwindCSS 4
- Motion 12 (Framer Motion runtime), Luxon, Zustand 5, Zod

## Getting Started
- Node: use `.nvmrc` (e.g., `nvm use`)
- Install: `npm i`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`

## Environment Variables (EmailJS)
Create `.env.local` with the following keys:

```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

## Animations
Reusable primitives live in `src/components/common/Animations.tsx` and are re‑exported from `src/components/common/index.ts`.

- `Stagger`: container with staggered children.
- `Item`: child reveal (default variant `fadeInUp`).
- `Reveal`: single-element scroll reveal, `variant` prop supports `fadeInUp`, `fadeIn`, `slideInLeft`, `slideInRight`, `zoomIn`.
- `Hover`: lift/scale interactions for buttons, links, and cards.

Applied across sections:
- Section headers use `Stagger`/`Item`.
- Home, KnowMeMore, Resume, Portfolio, Contact use `Stagger`/`Item`/`Reveal`.
- Testimonial uses a one‑time `Reveal` on entry (no per-slide animation).

Interactive touches:
- Header links (desktop + mobile) and header name use `Hover`.
- Language/Theme switchers: animated hover on the button while keeping icons centered.
- Email links: animated underline on hover/focus.
- Portfolio cards: `Hover` for lift/scale; modal for details.

## Project Structure
- `src/components/` — page sections
- `src/components/common/` — shared UI, animations, and wrappers
- `src/hooks/` — Zustand store and meta hooks
- `src/i18n/` — translations
- `src/schemas/` — Zod schemas
- `src/utils/` — helpers (`toSectionHref` for stable anchors)

## Notes
- Tailwind v4 configured in `src/index.css` with HeroUI plugin; ensure `@source` globs cover new files.
- Use `@/` alias for imports.
- Keep animations subtle; reuse the primitives when adding new UI.
