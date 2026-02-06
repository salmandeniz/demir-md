# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm run tauri dev` — Run app in development mode with hot reload
- `npm run tauri build` — Build production `.app` and `.dmg` bundles
- `npm run build` — Build frontend only (TypeScript check + Vite bundle)
- `npx tsc --noEmit` — Type-check without emitting

## Architecture

DemirMD is a Tauri v2 desktop markdown editor with a React 19 frontend.

**Rust backend** (`src-tauri/`): Tauri app entry point, native menu system (File/Edit), and event bridge. Menus emit `"menu-event"` to the frontend via `app_handle.emit()`. Uses `MenuBuilder`/`SubmenuBuilder`/`MenuItemBuilder` APIs.

**React frontend** (`src/`): Single-page app with hook-based state management (no external store). Data flows down via props from `App.tsx`, which owns all top-level state through custom hooks.

**State hooks** — `useMarkdownDocument` (content, filePath, isDirty), `useTheme` (localStorage-persisted), `useFileOperations` (Tauri dialog + fs plugins), `useKeyboardShortcuts` (Cmd+N/O/S/Shift+S), `useDebounce` (200ms preview delay).

**Event flow** — Native menu → Tauri emits `"menu-event"` → App listens via `@tauri-apps/api/event` → dispatches to `fileOps` → state updates → components re-render.

**Split pane** — `allotment` library. CSS import must be done in JS/TSX (`import "allotment/dist/style.css"`), not via CSS `@import` (Tailwind v4 + Vite limitation).

## Styling

- Tailwind CSS v4 with `@tailwindcss/vite` plugin — uses `@import "tailwindcss"` syntax
- Dark mode: `@custom-variant dark (&:where(.dark, .dark *))` — toggled via `classList` on root element
- `@tailwindcss/typography` for prose preview styling
- Syntax highlighting: GitHub theme (light), Catppuccin Mocha (dark) — custom CSS in `index.css`
- Editor themes: Custom light theme + `@codemirror/theme-one-dark`

## Tauri Capabilities

Permissions in `src-tauri/capabilities/default.json`. FS scope limited to `$HOME`, `$DESKTOP`, `$DOCUMENT`, `$DOWNLOAD`. Dialog permissions include open, save, ask, message.

## Key Conventions

- No comments in code
- No try-catch in business code
- BDD `given_when_then` naming for tests (lowercase Java-style method names)
- No Claude Code signature in commit messages
