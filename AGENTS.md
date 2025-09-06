# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with `components/` (UI, PascalCase, `.tsx`), `hooks/` (state/util, `.ts`), `types/` (shared types), `i18n/` (translations), `utils/` (helpers), `assets/`, and global styles in `src/index.css`.
- Entry: `index.html` -> `src/main.tsx` -> `src/App.tsx`.
- Aliases: Import from `@/` (see `vite.config.ts` and `tsconfig.app.json`). Barrel exports in `src/components/index.ts`.
- UI/Theme: HeroUI via `HeroUIProvider` in `main.tsx`; TailwindCSS v4 configured in `src/index.css` with `@plugin '../hero.ts'` and custom dark variant.

## App Summary
- Purpose: Personal portfolio site for Teoman Kirma (EN/TR).
- Features: Responsive navbar with menu toggle, theme switcher (light/dark/system), language switcher (English/Turkish), hero section with avatar and typewriter intro, in‑page section anchors.
- State: Centralized via Zustand (`useAppStore`) with `language` and `isMenuOpen`; devtools name `app-store`.
- i18n: Translations defined in `src/i18n/index.ts` typed by `src/types`. Keys include `name`, `menuItems`, `welcome`, `typewriter`, `location`, `hireMe`.
- Utilities: `toSectionHref(label)` in `src/utils` slugifies labels and transliterates Turkish characters for anchor links.

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

## Tech Stack
- React 19, Vite 7, TypeScript 5.8 (strict), TailwindCSS 4, HeroUI 2.
- Additional libs: Zustand 5 (state), `@heroui/use-theme` (theme), `react-simple-typewriter` (typewriter), Framer Motion (available for animations).

## Notes & Conventions
- Sections and anchors: use `toSectionHref` to generate stable IDs from menu labels (handles Turkish diacritics).
- Assets: import via `@/assets/...` for bundling; example `me.png` used in `Home`.
- Dist output: built files output to `dist/` via Vite.
