# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm run tauri dev` — Run app in development mode with hot reload
- `npm run tauri build` — Build production `.app` and `.dmg` bundles
- `npm run build` — Build frontend only (TypeScript check + Vite bundle)
- `npx tsc --noEmit` — Type-check without emitting

## Architecture

DemirMD is a Tauri v2 desktop markdown editor with a React 19 frontend.

**Rust backend** (`src-tauri/`): Tauri app entry point, native menu system (File/Edit), event bridge, and Tauri commands. Menus emit `"menu-event"` to the frontend via `app_handle.emit()`. Uses `MenuBuilder`/`SubmenuBuilder`/`MenuItemBuilder` APIs. Uses `.build().run()` pattern (not `.run()`) to handle `RunEvent::Opened` for file associations.

**Tauri commands** — `get_opened_file` (returns file path from "Open With" launch), `quit_app` (hides windows then `process::exit(0)` to avoid WebKit crash).

**React frontend** (`src/`): Single-page app with hook-based state management (no external store). Data flows down via props from `App.tsx`, which owns all top-level state through custom hooks.

**State hooks** — `useMarkdownDocument` (content, filePath, isDirty), `useTheme` (localStorage-persisted), `useViewMode` (localStorage-persisted, editor/split/preview), `useFileOperations` (Tauri dialog + fs plugins), `useKeyboardShortcuts` (Cmd+N/O/S/Shift+S/1/2/3), `usePreviewSearch` (CSS Custom Highlight API), `useDebounce` (200ms preview delay).

**Event flow** — Native menu → Tauri emits `"menu-event"` → App listens via `@tauri-apps/api/event` → dispatches to `fileOps` → state updates → components re-render.

**Split pane** — `allotment` library. CSS import must be done in JS/TSX (`import "allotment/dist/style.css"`), not via CSS `@import` (Tailwind v4 + Vite limitation).

## File Associations & Open With

Registered in `tauri.conf.json` under `bundle.fileAssociations` for `.md`, `.markdown`, `.mdx`. On macOS, "Open With" sends an Apple Event → Tauri fires `RunEvent::Opened { urls }` → Rust stores path in `OpenedFile` state and emits `"open-file"` event. Frontend checks `get_opened_file` on mount (priority over auto-save recovery) and listens for `"open-file"` at runtime.

## Graceful Quit

Standard `.quit()` replaced with custom quit menu item to avoid WebKit SIGSEGV crash (WKWebView use-after-free during teardown). Both ⌘Q and window close button route through frontend → unsaved changes check → `invoke("quit_app")` → Rust hides all windows (stops WebKit rendering) → `process::exit(0)`.

## Styling

- Tailwind CSS v4 with `@tailwindcss/vite` plugin — uses `@import "tailwindcss"` syntax
- Dark mode: `@custom-variant dark (&:where(.dark, .dark *))` — toggled via `classList` on root element
- `@tailwindcss/typography` for prose preview styling
- Syntax highlighting: GitHub theme (light), Catppuccin Mocha (dark) — custom CSS in `index.css`
- Editor themes: Custom light theme + `@codemirror/theme-one-dark`
- Preview search: CSS Custom Highlight API (`::highlight()`) — avoids DOM mutation, styles in `index.css`

## Tauri Capabilities

Permissions in `src-tauri/capabilities/default.json`. FS scope limited to `$HOME`, `$DESKTOP`, `$DOCUMENT`, `$DOWNLOAD`. Dialog permissions include open, save, ask, message.

## Key Conventions

- No comments in code
- No try-catch in business code
- BDD `given_when_then` naming for tests (lowercase Java-style method names)
- No Claude Code signature in commit messages
