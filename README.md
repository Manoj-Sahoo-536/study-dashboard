<div align="center">

# WorkNest

**A distraction-free, all-in-one desktop study workspace — built to maximize focus and eliminate context switching.**

*Browser tabs, PDF reader, video player, and AI assistants — all inside a beautiful floating-window workspace with an infinite drawing canvas backdrop.*

[![Platform](https://img.shields.io/badge/Platform-Windows-0078D4?style=flat-square&logo=windows)](https://github.com)
[![Electron](https://img.shields.io/badge/Electron-v40-9feaf9?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen?style=flat-square)](#)

---

## Download

| Type | File |
|------|------|
| **Installer** (Recommended) | [`WorkNest-1.0.0-Setup.exe`](https://github.com/Manoj-Sahoo-536/work-nest/releases/download/v1.0.0/WorkNest-1.0.0-Setup.exe) |
| **Portable** (No install needed) | [`WorkNest-1.0.0-Portable.exe`](https://github.com/Manoj-Sahoo-536/work-nest/releases/download/v1.0.0/WorkNest-1.0.0-Portable.exe) |

> **[Download Latest Release →](https://github.com/Manoj-Sahoo-536/work-nest/releases/latest)**

> **Note:** Windows Defender or SmartScreen may warn about an "unknown publisher" since the app is not code-signed. Click **"More info → Run anyway"** to proceed.

</div>

---

## The Problem

Modern students and self-learners face a fragmented study environment:

- **Constant context switching** between browser tabs, PDF viewers, video players, and note-taking apps breaks concentration and kills deep work.
- **Alt-tabbing** between a lecture video, a reference PDF, a web search, and an AI assistant creates cognitive overhead that slows learning.
- **Browser-based tools** don't allow true multi-pane layouts — you can't pin a video in the corner while reading a PDF and browsing docs simultaneously.
- **AI assistants are siloed** — switching between ChatGPT, Claude, Gemini, and Perplexity requires opening new browser windows, losing the current context.
- **No persistent canvas** — there's no unified space to sketch diagrams, jot notes, and keep study materials side-by-side in one view.

The result: students spend more time *managing their environment* than actually *studying*.

---

## The Solution

**WorkNest** is a cross-tool desktop workspace that consolidates everything a student needs into a single, distraction-free Electron application. Instead of tabs, it uses a **floating window system** — every tool (browser, PDF, video, AI) opens as an independently draggable, resizable panel over a persistent **Excalidraw infinite canvas**.

The entire workflow stays in one place. No alt-tabbing. No browser clutter. Just focus.

---

## Features

### Multi-Panel Workspace

Open any combination of tool panels simultaneously. Each panel is fully independent — drag it, resize it, snap it, or minimize it.

| Panel | Description |
|---|---|
| **Web Browser** | Full Chromium browser with address bar, back/forward/reload. Supports any website including authenticated sessions. Defaults to the left half of the screen. |
| **PDF Reader** | Open local PDF files natively. The reader renders via Chromium's built-in PDF engine — no third-party dependency. |
| **Video Player** | Pin a lecture video or tutorial as a floating overlay. Supports MP4, MKV, AVI, WebM, and MOV formats. |
| **AI Assistant** | One-click access to ChatGPT, Claude, Gemini, Perplexity, and DeepSeek — each in its own panel with a dedicated purple icon. |

### Smart Window Management

- **Freely draggable and resizable** — powered by `react-rnd` with bounds-constrained movement so panels can't escape the screen.
- **Snap Layouts** — hover the title bar to open a visual snap grid. Snap any window to: left half, right half, left 2/3, right 1/3, left 1/3, right 2/3, three equal columns, or any of the four screen quadrants.
- **Z-index stacking** — clicking any window brings it to the front. The window manager uses a ref-counted interaction lock to prevent click-through during drag and resize operations.
- **Minimize to Dock** — minimized windows appear as icon chips in the taskbar with a glowing indicator dot. Click to restore instantly.
- **macOS-style traffic lights** — close (red), minimize (yellow), and snap (green placeholder) buttons in each window header.

### Excalidraw Background Canvas

The entire application background is a live [Excalidraw](https://excalidraw.com) drawing canvas. Draw diagrams, sketch flowcharts, jot quick notes, or mind-map concepts — all without leaving the app. The welcome screen is suppressed via injected CSS for a clean, uninterrupted canvas surface.

### Focus Mode

A single click hides the entire taskbar with a smooth slide-down animation. A minimal arrow tab peeks from the bottom of the screen to bring it back. Ideal for full-immersion reading or watching. Focus mode preference is persisted across sessions via `localStorage`.

### Floating Dark Taskbar

A macOS-inspired frosted-glass dock centered at the bottom of the screen. Features:
- Tool buttons for Browser, PDF, Video, and AI with glowing hover effects
- Minimized window chips with type-colored indicator dots
- Animated divider between minimized windows and tools
- Tooltip labels on every button
- Global keyboard shortcut (`Ctrl+Shift+Space`) to show/hide the entire app window

### Session Persistence

Window state (position, size, z-index, minimized status) is managed via **Zustand** with selective persistence — only user preferences like Focus Mode are saved to `localStorage`. Open windows intentionally reset on restart to avoid stale file paths and broken webview states.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Desktop Shell | Electron v40 | Native OS integration, file dialogs, webview tag |
| Frontend | React 19 + TypeScript | Component-based UI with full type safety |
| Build Tool | Vite 7 | Lightning-fast HMR in dev, optimized production bundles |
| Styling | Tailwind CSS v4 | Utility-first styling with custom glass-morphism effects |
| State Management | Zustand v5 | Minimal, performant global state with persistence middleware |
| Window Manager | react-rnd | Draggable + resizable window containers |
| Canvas | Excalidraw | Infinite collaborative drawing canvas |
| Icons | Lucide React | Consistent, accessible icon set |
| Packager | electron-builder | NSIS installer + portable `.exe` for Windows |

---

## Architecture

```
work-nest/
├── electron/
│   ├── main.ts              # Electron main process — BrowserWindow, IPC handlers, global shortcuts
│   ├── preload.ts           # Context bridge — exposes safe APIs to renderer (file dialog, app path)
│   └── webview-preload.ts   # Injected into PDF webviews for sandboxed rendering
├── src/
│   ├── components/
│   │   ├── App.tsx              # Root layout — window orchestration and mode control
│   │   ├── Taskbar.tsx          # Floating dock with tool buttons and minimized window chips
│   │   ├── WindowContainer.tsx  # Generic draggable/resizable window shell with snap controls
│   │   ├── SnapControls.tsx     # Visual snap layout picker (portal-rendered)
│   │   ├── BrowserApp.tsx       # Chromium webview panel with navigation bar
│   │   ├── PDFApp.tsx           # PDF viewer via webview with preload injection
│   │   ├── VideoApp.tsx         # Local video file player
│   │   └── ExcalidrawBackground.tsx  # Full-screen Excalidraw canvas backdrop
│   ├── store/
│   │   └── windowStore.ts       # Zustand store — window CRUD, z-index, minimize, focus mode
│   └── types/
│       └── electron.d.ts        # TypeScript declarations for the Electron context bridge API
├── public/                  # App icon assets
└── release/                 # Output directory for compiled Windows executables
```

**Key design decisions:**
- **Context isolation is ON** — the renderer never has direct Node.js access. All native operations go through a typed IPC bridge (`swiftShuttleAPI`).
- **Webview tag over `<iframe>`** — Electron's `<webview>` tag provides true process isolation, allowing full Chromium sessions with cookies, auth, and extensions inside each panel.
- **Ref-counted interaction lock** — during drag/resize, a shared counter (`windowInteractingCount`) disables pointer events on all webviews to prevent the underlying webview from hijacking mouse events.
- **Selective Zustand persistence** — only non-path-dependent state (focus mode) is serialized to avoid hydration errors from stale file paths on app restart.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (included with Node.js)

### Development

```bash
git clone https://github.com/Manoj-Sahoo-536/work-nest.git
cd work-nest
npm install
npm run dev
```

The app launches in development mode with DevTools enabled. The Vite dev server and Electron process start concurrently.

### Production Build

```bash
npm run build:exe
```

Output is placed in the `release/` directory as both an NSIS installer and a portable `.exe`.

> **Build Tip:** If the build fails with an NSIS ENOENT error on first run, delete the electron-builder cache at `C:\Users\<YourName>\AppData\Local\electron-builder\Cache` and re-run.

---

## Future Scope

The following features are planned or proposed to significantly increase the value and user-base of this project:

### Near-Term Enhancements

| Feature | Description |
|---|---|
| **Note Panel** | A dedicated rich-text or Markdown note-taking panel that auto-saves to disk, alongside the Excalidraw canvas. |
| **Workspace Presets / Layouts** | Save and restore named layouts (e.g., "Exam Prep", "Coding Session") that remember which panels are open and their positions. |
| **Tab Groups inside Browser Panel** | Multiple browser tabs within a single browser panel — reducing the need to spawn multiple browser windows. |
| **PDF Annotation** | Highlight, underline, and comment on PDFs directly inside the PDF panel, with export to annotated PDF. |
| **Video Timestamp Bookmarks** | Bookmark specific timestamps in a lecture video, with labeled notes per bookmark. |

### High-Value Additions (CV-grade features)

| Feature | Description |
|---|---|
| **Pomodoro / Study Timer** | Built-in focus timer with session tracking, break alerts, and daily study statistics persisted to disk. |
| **Session History & Analytics** | Track which URLs were visited, PDFs opened, and videos watched per session. Visualize study time with charts. |
| **Cloud Sync (optional)** | Sync workspace layouts and notes to a personal cloud bucket (e.g., Supabase or Firebase) for cross-device access. |
| **AI Sidebar with Context** | A built-in AI chat sidebar (using OpenAI/Claude API) that can receive the currently selected PDF text or page title as context — eliminating the need to copy-paste. |
| **Collaborative Study Rooms** | Real-time shared Excalidraw sessions where multiple students can draw and annotate together via WebSocket. |
| **Distraction Blocker** | A blocklist-based site filter on the browser panel that blocks non-study domains during a study session. |
| **Spaced Repetition Flashcards** | Create flashcards from selected PDF text or browser content, stored locally and surfaced via an SM-2 spaced repetition algorithm. |
| **macOS & Linux Support** | Extend electron-builder configuration and test IPC paths for cross-platform distribution. |
| **Auto-Update** | Integrate `electron-updater` with a GitHub Releases channel for seamless OTA updates. |

---

## Is This Relevant for Your CV?

**Yes — and it's a strong entry.** Here's why:

### What makes this CV-worthy

- **Full-stack desktop engineering** — you built a complete native desktop application from scratch using Electron, React 19, TypeScript, Vite, Tailwind CSS, and Zustand. This demonstrates breadth across the stack.
- **Non-trivial Electron architecture** — you correctly implemented context isolation, IPC bridges, webview sandboxing, preload scripts, and process-level security settings. Many developers get these wrong.
- **Custom window management system** — building a z-index-aware, drag/resize/snap multi-window manager from scratch (not a library) shows systems thinking and UI engineering depth.
- **Real problem solved** — the app addresses a genuine pain point and is packaged as a distributable `.exe` — not a toy project. It has a GitHub release, installer, and portable build.
- **Production-quality UX** — focus mode animations, macOS traffic lights, glowing dock indicators, portal-rendered snap menus, and interaction locks during drag are the kind of polished details that signal professional-grade work.
- **Sound architecture decisions** — selective persistence, ref-counted interaction locks, and typed IPC bridges show you understand failure modes, not just happy paths.

### How to present it on your CV

```
WorkNest                                                     [GitHub Link]
Desktop productivity app for distraction-free studying
• Built a multi-panel floating-window workspace with Electron, React 19, and TypeScript
• Implemented a custom window manager with drag, resize, z-index stacking, snap layouts,
  and minimize-to-dock — handling pointer event isolation across embedded webviews
• Embedded Excalidraw as a live infinite canvas backdrop with CSS injection via webview IPC
• Packaged as a signed-ready Windows installer + portable .exe using electron-builder
• Stack: Electron 40 · React 19 · TypeScript · Vite · Tailwind CSS v4 · Zustand
```

### Recommended next steps to maximize impact

1. **Add a Pomodoro timer** — a concrete, measurable feature users love and employers recognize instantly.
2. **Record a 60-second demo video** and link it in the README — visual demos outperform screenshots for desktop apps.
3. **Deploy a landing page** (even a simple GitHub Pages site) so you have a shareable public URL.
4. **Accumulate GitHub stars** — share in study/productivity communities (r/productivity, r/learnprogramming, dev.to).
5. **Write a blog post** on dev.to or Hashnode about the Electron webview interaction lock pattern — it demonstrates deep understanding and builds your public presence.

---

## License

Copyright © 2026 WorkNest. Released under the [MIT License](LICENSE).
