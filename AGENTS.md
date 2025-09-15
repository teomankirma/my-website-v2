# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with `components/` (UI, PascalCase, `.tsx`), `hooks/` (state/util, `.ts`), `types/` (shared types), `i18n/` (translations), `schemas/` (Zod validation schemas), `utils/` (helpers), `assets/`, and global styles in `src/index.css`.
- Entry: `index.html` -> `src/main.tsx` -> `src/App.tsx`.
- Aliases: Import from `@/` (see `vite.config.ts` and `tsconfig.app.json`). Barrel exports in `src/components/index.ts` and `src/components/common/index.ts`.
- UI/Theme: HeroUI via `HeroUIProvider` in `main.tsx`; TailwindCSS v4 configured in `src/index.css` with `@plugin '../hero.ts'` and custom dark variant.
- Components present: `Header`, `Home`, `KnowMeMore`, `Resume`, `Portfolio`, `Testimonial`, `ContactMe`, `Footer`.
- Common components: `SectionHeader`, `ThemeSwitcher`, `LanguageSwitcher`, `DownloadResumeButton`, `SkillLogo`, `PageSection`, `PortfolioCard`.
- Animations: `src/components/common/Animations.tsx` provides reusable Motion primitives and variants:
  - `Stagger` (container with staggered children), `Item` (child reveal), `Reveal` (single-element reveal), `Hover` (lift/scale for interactive elements).
  - Variants available: `fadeInUp`, `fadeIn`, `slideInLeft`, `slideInRight`, `zoomIn`.
  

## App Summary
- Purpose: Personal portfolio site for Teoman Kirma (EN/TR).
- Features: Responsive navbar with menu toggle, theme switcher (light/dark/system), language switcher (English/Turkish), hero section with avatar and typewriter intro, in‑page section anchors.
- Animations: Sections use Motion scroll‑reveal (Stagger/Item/Reveal). Interactive elements use `Hover` for subtle lift/scale. Testimonial has an initial `zoomIn` reveal only (no per‑slide animation).
- State: Centralized via Zustand (`useAppStore`) with `language`, `isMenuOpen`, and `email`; devtools name `app-store`.
- i18n: Translations defined in `src/i18n/index.ts` typed by `src/types`. Keys are grouped by page/section for consistency:
  - Root: `name`, `menuItems`
  - `home`: `welcome`, `typewriter[]`, `location`, `hireMe`
  - `about`: `knowMeMore`, `whoAmIA`, `whoAmIB`, `aboutMe`, `myExperiences`
  - `profile`: `nameLabel`, `emailLabel`, `ageLabel`, `age`, `fromLabel`, `from`, `downloadResume`
  - `stats`: `experienceYear`, `experienceText`, `projectsNumber`, `projectsLabel`
  - `resume`: `eduTitle`, `expTitle`, `schoolName`, `degree`, `gpaLabel`, `expRole`, `expDates`, `expLocation`
  - `portfolio`: `subtitle`, `cardLabels` (`projectInfo`, `projectDetails`, `link`, `technologies`, `industry`, `date`), `items[]`
  - `testimonial`: `items[]`
  - `footer`: `footerCopyright`, `copyrightLabel`
  - `contact`: UI texts (`title`, `followMe`, `sendMeANote`, `yourNameLabel`, `messageLabel`, `messagePlaceholder`, `sendMessageButton`, `toast.*`) and `contactValidation` messages
  - Shared i18n: `email`, `eduYears`, `companyName`, `gpa`, tech labels, and `socialLinks` (`x`, `github`, `linkedin`).
  - Contact UI texts under `contact`: `title`, `followMe`, `sendMeANote`, `yourNameLabel`, `messageLabel`, `messagePlaceholder`, `sendMessageButton`, and `toast` (`notConfiguredTitle`, `notConfiguredDescription`, `successTitle`, `successDescription`, `failedTitle`, `failedDescription`).
  - Shared i18n now includes `socialLinks` (`x`, `github`, `linkedin`).
- Utilities: `toSectionHref(label)` in `src/utils` slugifies labels and transliterates Turkish characters for anchor links.
  - Section IDs use `toSectionHref(menuItems[i]).slice(1)` to keep anchors consistent with navbar labels (e.g., in `KnowMeMore`, `Resume`).
  - Use `PageSection` to standardize section wrappers (id + spacing), passing the `menuIndex` and optional `header`.
  - Validation Schemas: Contact form schema in `src/schemas/index.ts` via Zod; localized with `i18n`.
  - Link styling: email links use a sliding underline on hover/focus; social icons lift/scale subtly on hover.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server with HMR.
- `npm run build`: Type-check (`tsc -b`) then build for production with Vite.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint across the repo.
- Node: Use the version in `.nvmrc` (currently `v22`, e.g., `nvm use`).

## Coding Style & Naming Conventions
- Language: TypeScript (strict) + React 19 + Vite.
- Linting: ESLint (`eslint.config.js`) with `@eslint/js`, `typescript-eslint`, React Hooks, and Refresh plugins. Fix violations before committing.
- Components: PascalCase file and export names (e.g., `Header.tsx`). Hooks in `hooks/` use `useX` camelCase (e.g., `useAppStore`).
- Imports: Prefer `@/path` alias over relative deep paths.
- Styling: TailwindCSS utilities; keep component styles co-located.
- Theming: `@heroui/use-theme` powers theme switching UI; Tailwind v4 + HeroUI plugin in `hero.ts`.
- Motion usage: prefer `Stagger` + `Item` for lists/grids; `Reveal` for single blocks; `Hover` for buttons, links, and cards. Keep animations subtle and performant (`viewport={{ once: true, amount: 0.2 }}`).

## Testing Guidelines
- No test framework is configured. If adding tests, prefer Vitest + React Testing Library. Place unit tests beside code as `*.test.ts(x)` and aim for meaningful coverage on hooks and components.

## Commit & Pull Request Guidelines
- Commits: Follow Conventional Commits (e.g., `feat: add ThemeSwitcher`, `fix: address navbar overflow`). Keep changes focused.
- PRs: Provide a concise description, screenshots for UI changes, steps to verify locally, and link related issues. Ensure `npm run lint` and `npm run build` pass.

## Security & Configuration Tips
- Do not hardcode secrets (e.g., external API keys). The Font Awesome kit in `index.html` is client-only and safe to expose.
- When adding new files, ensure Tailwind `@source` globs in `src/index.css` cover them.
- Persist state carefully: the Zustand store uses devtools under the name `app-store`.
 - EmailJS: configure keys via Vite env vars `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` (place them in `.env.local`). See `.env.example` for placeholders.

## Tech Stack
- React 19, Vite 7, TypeScript 5.8 (strict), TailwindCSS 4, HeroUI 2.
- Additional libs: Zustand 5 (state), `@heroui/use-theme` (theme), Luxon (date math), `react-simple-typewriter` (typewriter), Framer Motion (available for animations).

## Notes & Conventions
- Sections and anchors: use `toSectionHref` to generate stable IDs from menu labels (handles Turkish diacritics).
- Assets: import via `@/assets/...` for bundling; example `me.png` used in `Home`.
- Dist output: built files output to `dist/` via Vite.
- Header brand: site name in `Header` is clickable; clicking scrolls smoothly to top.
- Testimonial: arrow buttons are inset on mobile; slide container uses side padding to avoid touching the card.

## Maintenance
- Keep this AGENTS.md up to date when making significant changes (adding/removing/renaming top-level folders, modifying anchors/section IDs, adding store state keys, or introducing/removing i18n keys/components).
- After major UI or structure changes, verify Tailwind `@source` globs in `src/index.css` still cover new files and that barrel exports remain in sync.
 - When adding animations to new components, prefer the existing primitives in `common/Animations.tsx` and re-export from `common/index.ts` if new patterns are introduced.
