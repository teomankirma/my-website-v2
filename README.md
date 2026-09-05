# Teoman Kirma — Portfolio

A bilingual portfolio with a scroll-driven MacBook story, vivid project pages, and a portrait reveal. Built with Next.js 16, React 19, TypeScript, GSAP, Three.js / React Three Fiber, next-intl, and Geist.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open `/en` or `/tr` on http://localhost:3000. The root redirects to the preferred supported locale. Configure the three EmailJS public identifiers to enable the contact form; its template variables are `name`, `email`, and `message`. Without configuration, visitors can still use the direct email link. `NEXT_PUBLIC_SITE_URL` optionally overrides the canonical origin (default `https://teomankirma.com`). Never commit `.env.local`.

## Design and motion

The homepage moves from cobalt to violet and coral, then into cream project stories, a lavender biography, deep-violet experience, and a blue contact section. All nine projects and the résumé remain available without playing through the opening.

Scrolling drives the laptop; there is no autoplay or hijacked scroll. Chapter buttons and a skip link provide shortcuts. **Reduce motion** persists across visits, and the operating system's reduced-motion preference takes priority. Static posters replace WebGL when motion is reduced or rendering fails. Content remains readable without JavaScript.

The custom model follows Apple's published 14-inch MacBook Pro chassis dimensions, 3024:1964 display ratio, 78-key ANSI keyboard layout, and current notch design. Smaller details are visual approximations, not CAD measurements. The macOS-inspired interface is a canvas illustration with real project screenshots, not an embedded operating system. See [design references](docs/redesign/PLAN.md) and [asset credits](public/experience/CREDITS.md).

## Source map

- `src/app/[locale]/`: localized homepage, metadata, social preview.
- `src/components/experience/`: scroll story, custom Three.js model, screen texture, global motion preference.
- `src/components/sections/`: header, all projects, biography, résumé, contact, footer.
- `src/lib/macbook.ts`: physical dimensions, keyboard layout, Apple vector.
- `src/lib/scroll-story.ts`: scroll poses and screen timeline.
- `src/lib/projects.ts`: project records; original screenshots in `src/assets/`.
- `messages/en.json` and `messages/tr.json`: localized copy; update together.
- `src/styles/globals.css`: the single vivid palette and page layout; hero styles are colocated.
- `src/proxy.ts`: next-intl locale routing.
- `public/experience/`: compressed screen images and static fallback posters.

There is no separate prototype route, theme switcher, or unused component library.

## Verification

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm audit
npm run start -- --port 3001
```

Contract tests cover hardware proportions, the ANSI keyboard, scroll poses, and contact validation. Browser verification covers both locales, desktop/mobile layouts, keyboard navigation, reduced motion, WebGL fallback, and form feedback. See [verification notes](docs/redesign/VERIFICATION.md).

## Review and deployment

Feature work stays on `redesign/dark-technical`. Open a pull request into `main`; **do not merge without the owner's explicit approval**. Vercel builds with `npm run build`. Add the EmailJS public identifiers and optional site origin in project settings.
