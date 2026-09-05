# Repository Guidelines

## Project

Teoman Kirma's bilingual portfolio: Next.js 16 App Router, React 19, strict TypeScript, Tailwind v4, GSAP, Three.js / React Three Fiber, next-intl, Geist, sonner, react-hook-form, Zod, EmailJS.

**Branch:** All feature work happens on `redesign/dark-technical`. Do NOT merge to `main` without explicit user approval.

## Structure

- `src/app/layout.tsx`: root HTML, fonts, global styles.
- `src/app/[locale]/`: localized homepage, locale provider/metadata, OG image.
- `src/components/experience/`: hero scroll story, motion provider, laptop geometry/scene, screen canvas.
- `src/components/sections/`: Header, Portfolio, About, Resume, Contact, Footer.
- `src/components/common/`: HTML language synchronization and toast host.
- `src/lib/`: site/project constants, GSAP registration, MacBook dimensions, story poses.
- `src/assets/`: source project screenshots and portrait.
- `public/experience/`: compressed screen images and fallback posters; credits alongside.
- `messages/en.json`, `messages/tr.json`: localized strings.
- `src/schemas/contact.ts`: localized Zod schema.
- `src/styles/globals.css`: single vivid palette and responsive page styling.
- `src/proxy.ts`: next-intl middleware. Do not rename to middleware.ts.
- `tests/`: meaningful design and validation contracts.

## Conventions

- Locale-prefixed pages; `setRequestLocale(locale)` in server pages, `useTranslations()` in client components. Update both translation files together.
- Locale-neutral URLs, technology names, physical ANSI key legends and model measurements belong in `src/lib/`.
- Server components by default. Hooks, event handlers and browser APIs require `'use client'`.
- Import GSAP from `@/lib/gsap`; keep animation setup inside scoped `useGSAP` with cleanup. Gate all timelines/tweens with `gsap.matchMedia('(prefers-reduced-motion: no-preference)', ...)` and the global manual preference.
- WebGL is decorative and optional. Keep real content outside the canvas, demand rendering, responsive camera framing and static posters.
- No theme toggle: use the shared vivid palette. No shadcn/ui layer or cn utility remains. Functional icons use lucide-react; brand links use text, Apple hardware uses the credited vector.
- Forms use react-hook-form, zodResolver, and `makeContactSchema`; Zod v4 `{error: message}`. Preserve EmailJS `name`, `email`, `message` variables. Mock requests during QA; do not send test emails without authorization.
- Project images use next/image; resume stays `/resume.pdf`.
- Add projects to `src/lib/projects.ts`, their assets to `src/assets/`, and featured descriptions to both `work.projects` namespaces. Featured story projects also need both `story.projects` entries and compressed screen assets.

## Verification gates

Before every commit, all must pass:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Verify visual changes in both locales on desktop and mobile, including reduced-motion behavior. Keep reference sources and browser checks in `docs/redesign/` current.

## Environment and deployment

Copy `.env.example` to `.env.local`; never commit secrets. EmailJS needs `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`. Optional `NEXT_PUBLIC_SITE_URL` controls canonical URLs.

`npm run dev` starts port 3000; `npm run start` serves the production build. Vercel uses `npm run build`. PR review is required before merging to main.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
