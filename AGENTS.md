# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with `components/` (UI, PascalCase, `.tsx`), `hooks/` (state/util, `.ts`), `types/` (shared types), `i18n/` (translations), `schemas/` (Zod validation schemas), `utils/` (helpers), `assets/`, and global styles in `src/index.css`.
- Entry: `index.html` -> `src/main.tsx` -> `src/App.tsx`.
- Aliases: Import from `@/` (see `vite.config.ts` and `tsconfig.app.json`). Barrel exports in `src/components/index.ts` and `src/components/common/index.ts`.
- UI/Theme: HeroUI via `HeroUIProvider` in `main.tsx`; TailwindCSS v4 configured in `src/index.css` with `@plugin '../hero.ts'` and custom dark variant.
- Components present: `Header`, `Home`, `KnowMeMore`, `Resume`, `Portfolio`. Common components: `SectionHeader`, `ThemeSwitcher`, `LanguageSwitcher`, `DownloadResumeButton`, `SkillLogo`, `PageSection` (unified section wrapper).
  

## App Summary
- Purpose: Personal portfolio site for Teoman Kirma (EN/TR).
- Features: Responsive navbar with menu toggle, theme switcher (light/dark/system), language switcher (English/Turkish), hero section with avatar and typewriter intro, in‑page section anchors.
- State: Centralized via Zustand (`useAppStore`) with `language`, `isMenuOpen`, and `email`; devtools name `app-store`.
- i18n: Translations defined in `src/i18n/index.ts` typed by `src/types`. Main keys include:
  - Basics: `name`, `menuItems`, `welcome`, `typewriter`, `location`, `hireMe`
  - About: `knowMeMore`, `whoAmIA`, `whoAmIB`, `aboutMe`, `myExperiences`
  - Profile: `nameLabel`, `emailLabel`, `ageLabel`, `age`, `fromLabel`, `from`, `downloadResume`
  - Stats: `experienceYear`, `experienceText`, `projectsNumber`, `projectsLabel`
  - Resume: `eduTitle`, `expTitle`, `schoolName`, `degree`, `gpaLabel`, `expRole`, `expDates`, `expLocation`
  - Shared i18n: `email`, `eduYears`, `companyName`, `gpa`, `react`, `typescript`, `tailwind`, `nextjs`, `zustand`, `tanstack`
  - Contact: `contactValidation` (form validation messages: `name_required`, `name_min`, `name_max`, `email_required`, `email_invalid`, `email_max`, `message_required`, `message_min`, `message_max`)
  - Contact UI texts under `contact`: `title`, `followMe`, `sendMeANote`, `yourNameLabel`, `messageLabel`, `messagePlaceholder`, `sendMessageButton`, and `toast` (`notConfiguredTitle`, `notConfiguredDescription`, `successTitle`, `successDescription`, `failedTitle`, `failedDescription`).
  - Shared i18n now includes `socialLinks` (`x`, `github`, `linkedin`).
- Utilities: `toSectionHref(label)` in `src/utils` slugifies labels and transliterates Turkish characters for anchor links.
  - Section IDs use `toSectionHref(menuItems[i]).slice(1)` to keep anchors consistent with navbar labels (e.g., in `KnowMeMore`, `Resume`).
  - Use `PageSection` to standardize section wrappers (id + spacing), passing the `menuIndex` and optional `header`.
  - Validation Schemas: Contact form schema in `src/schemas/index.ts` via Zod; localized with `i18n`.

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

## Maintenance
- Keep this AGENTS.md up to date when making significant changes (adding/removing/renaming top-level folders, modifying anchors/section IDs, adding store state keys, or introducing/removing i18n keys/components).
- After major UI or structure changes, verify Tailwind `@source` globs in `src/index.css` still cover new files and that barrel exports remain in sync.
