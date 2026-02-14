# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 21 CRM hybrid application using standalone components (no NgModules). Early-stage project with scaffold in place.

## Commands

- `npm start` — Start dev server on port 4200
- `npm run build` — Production build (output to `dist/`)
- `npm test` — Run tests with Vitest
- `npm run watch` — Build in watch mode (development config)
- `npx ng generate component <name>` — Generate a new standalone component
- `npx ng generate service <name>` — Generate a new service

## Architecture

- **Standalone components only** — Angular 14+ standalone API, no NgModules. Components use `@Component({ standalone: true, imports: [...] })`.
- **Signals** — Root component uses Angular signals (`signal()`) for reactive state.
- **Bootstrap** — `src/main.ts` calls `bootstrapApplication(App, appConfig)` directly.
- **Routing** — Configured in `src/app/app.routes.ts` (currently empty, ready for routes). Router provided via `provideRouter(routes)` in `src/app/app.config.ts`.
- **Styling** — TailwindCSS 4 via PostCSS. Global styles in `src/styles.css`. Components have scoped `.css` files.
- **Testing** — Vitest 4 with jsdom. Test files follow `*.spec.ts` pattern alongside source files.

## Code Style

- TypeScript strict mode with `strictTemplates`, `strictInjectionParameters`, and `strictInputAccessModifiers`
- 2-space indentation, single quotes, UTF-8
- Prettier: 100 char line width, Angular parser for `.html` files
- Component files use flat naming: `app.ts`, `app.html`, `app.css`, `app.spec.ts`

## Build Budgets

- Initial bundle: warning at 500KB, error at 1MB
- Component styles: warning at 4KB, error at 8KB