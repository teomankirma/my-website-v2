# Teoman Kirma — Portfolio

Personal portfolio for Teoman Kirma built with React, Vite, HeroUI, and TailwindCSS. The site is fully localized (English/Turkish), supports light/dark/system themes, and includes reusable motion primitives for subtle animations.

## Quick Start for Forks
1. **Fork** this repository and clone your fork:
   ```bash
   git clone https://github.com/<your-user>/my-website-v2.git
   cd my-website-v2
   ```
2. **Node version** – the project targets Node `v22` (see `.nvmrc`). If you use `nvm` run `nvm use` before installing dependencies.
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Environment variables** – copy `.env.example` to `.env.local` and fill in the keys that apply to your deployment (see [Environment](#environment)). Vite automatically loads `*.env.local`.
5. **Start the dev server**:
   ```bash
   npm run dev
   ```
6. Open the app at the URL that Vite prints (typically <http://localhost:5173>).

## Environment
All configuration lives in `VITE_` prefixed vars so they are available to the client bundle.

| Key | Description |
| --- | --- |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service identifier for the contact form. |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template used when sending contact form submissions. |
| `VITE_EMAILJS_PUBLIC_KEY` | Public API key from EmailJS. |
| `VITE_GA_MEASUREMENT_ID` | Optional Google Analytics 4 measurement ID. Leave unset for local/dev builds. |

`.env.local` is ignored by Git. Add the keys you need before running the form or analytics features locally.

## Available Scripts
- `npm run dev` – start Vite with hot module replacement.
- `npm run build` – type-check via `tsc -b` then build production assets to `dist/`.
- `npm run preview` – serve the production build locally.
- `npm run lint` – run ESLint across the repo.

## Project Structure
```
├── src/
│   ├── components/           # Page sections (Header, Home, KnowMeMore, etc.)
│   ├── components/common/    # Shared UI primitives (SectionHeader, ThemeSwitcher, animations…)
│   ├── hooks/                # Zustand store + meta hooks
│   ├── i18n/                 # English/Turkish translations
│   ├── schemas/              # Zod validation schemas (e.g., contact form)
│   ├── types/                # Shared TypeScript enums/interfaces
│   ├── utils/                # Helpers such as `toSectionHref` and Google Analytics bootstrap
│   └── index.css             # TailwindCSS v4 entry point + theme tokens
├── hero.ts                   # HeroUI Tailwind plugin configuration
├── AGENTS.md                 # Additional contributor guidelines (keep updated!)
└── ...
```

Import paths use the `@/` alias (configured via `vite.config.ts` and `tsconfig.app.json`). When adding new components, update the barrel exports in `src/components/index.ts` or `src/components/common/index.ts` as needed.

## Key Concepts
- **State** – `src/hooks/useAppStore.ts` houses a Zustand store for menu state, active language, and email. Devtools are enabled under the name `app-store`.
- **Localization** – All copy lives in `src/i18n/index.ts` and is typed via enums in `src/types`. Update both English and Turkish entries when adding content.
- **Page metadata** – `usePageMeta` syncs `<title>`, `<html lang>`, and the meta description when the active language changes.
- **Theming** – `ThemeSwitcher` uses `@heroui/use-theme`. On first load, it checks `prefers-color-scheme` and applies the user’s OS theme unless a preference is already stored.
- **Animations** – Motion primitives live in `src/components/common/Animations.tsx`, while the variants are in `animationVariants.ts`. Use `Stagger`, `Item`, `Reveal`, and `Hover` for consistent reveal/interaction effects.
- **Section anchors** – `toSectionHref` transliterates Turkish characters and slugifies menu labels to keep navigation links stable across languages.
- **Forms** – The contact form is powered by `react-hook-form`, `zod`, and HeroUI components. Textareas disable autosize by default to avoid hidden measurement nodes.

## Styling & UI
- TailwindCSS v4 is configured in `src/index.css` with the HeroUI plugin declared via `@plugin '../hero.ts'`.
- The custom dark variant is exposed as `dark` and applied through the `HeroUIProvider` + `ThemeSwitcher`.
- Global typography is defined with CSS vars—no external font fetch.

## EmailJS Setup
1. Create a service, template, and public key in [EmailJS](https://www.emailjs.com/).
2. Add the IDs and key to `.env.local`.
3. Update the template to expect `name`, `email`, and `message` fields (see `src/components/ContactMe.tsx`).
4. Form validation messages are localized via `src/i18n/index.ts` and `src/schemas/index.ts`.

## Analytics
If you provide `VITE_GA_MEASUREMENT_ID`, `src/utils/googleAnalytics.ts` injects the GA script once Vite mounts the app. The script logs a warning in development if the ID is missing, so leaving it blank is safe for local runs.

## Quality Checks
- Run `npm run lint` before pushing changes.
- There is no default test suite. If you add tests, prefer Vitest + React Testing Library and colocate files as `*.test.ts(x)`.
- Ensure `npm run build` succeeds for production deployments.

## Deployment
- Build assets with `npm run build`; output lands in `dist/`.
- You can preview the production bundle locally via `npm run preview`.
- Static hosts (Netlify, Vercel, GitHub Pages) can serve the `dist/` directory without additional configuration.

## Contributing Tips
- Follow Conventional Commit messages (`feat: …`, `fix: …`).
- Keep sections reusable—when adding new animated blocks, rely on the primitives in `src/components/common` instead of inventing per-component motion logic.
- Update both `README.md` and `AGENTS.md` if you change top-level structure, environment requirements, or shared conventions.

Happy hacking! If you encounter inconsistencies, start with `AGENTS.md` for the authoritative project conventions.
