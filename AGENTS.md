# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with `components/` (UI, PascalCase, `.tsx`), `hooks/` (state/util, `.ts`), `types/` (shared types), `assets/`, and global styles in `src/index.css`.
- Entry: `index.html` -> `src/main.tsx` -> `src/App.tsx`.
- Aliases: Import from `@/` (see `vite.config.ts` and `tsconfig.app.json`).
- UI/Theme: HeroUI via `HeroUIProvider` in `main.tsx`; TailwindCSS configured in `src/index.css` with `@plugin '../hero.ts'`.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server with HMR.
- `npm run build`: Type-check (`tsc -b`) then build for production with Vite.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint across the repo.
- Node: Use the version in `.nvmrc` (e.g., `nvm use`).

## Coding Style & Naming Conventions
- Language: TypeScript (strict) + React 19 + Vite.
- Linting: ESLint (`eslint.config.js`) with `@eslint/js`, `typescript-eslint`, React Hooks, and Refresh plugins. Fix violations before committing.
- Components: PascalCase file and export names (e.g., `Header.tsx`). Hooks in `hooks/` use `useX` camelCase (e.g., `useAppStore`).
- Imports: Prefer `@/path` alias over relative deep paths.
- Styling: TailwindCSS utilities; keep component styles co-located.

## Testing Guidelines
- No test framework is configured. If adding tests, prefer Vitest + React Testing Library. Place unit tests beside code as `*.test.ts(x)` and aim for meaningful coverage on hooks and components.

## Commit & Pull Request Guidelines
- Commits: Follow Conventional Commits (e.g., `feat: add ThemeSwitcher`, `fix: address navbar overflow`). Keep changes focused.
- PRs: Provide a concise description, screenshots for UI changes, steps to verify locally, and link related issues. Ensure `npm run lint` and `npm run build` pass.

## Security & Configuration Tips
- Do not hardcode secrets (e.g., external API keys). The Font Awesome kit in `index.html` should remain client-safe.
- When adding new files, ensure Tailwind `@source` globs in `src/index.css` cover them.
- Persist state carefully: the Zustand store uses devtools under the name `app-store`.
