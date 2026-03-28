<div align="center">

# 🎓 Study Dashboard

**A distraction-free, all-in-one study workspace — built to maximize your focus.**

*Open browser tabs, PDF readers, video players, and AI assistants all inside a beautiful, floating-window workspace. Draw, annotate and think on an infinite canvas backdrop.*

[![Platform](https://img.shields.io/badge/Platform-Windows-0078D4?style=flat-square&logo=windows)](https://github.com)
[![Electron](https://img.shields.io/badge/Electron-v40-9feaf9?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen?style=flat-square)](#)

---

## ⬇️ Download

| Type | File | Size |
|------|------|------|
| 🔧 **Installer** (Recommended) | `Study Dashboard-1.0.0-Setup.exe` | ~95 MB |
| 💼 **Portable** (No install needed) | `Study Dashboard-1.0.0-Portable.exe` | ~95 MB |

> **[👉 Download Latest Release →](../../releases/latest)**

> **Note:** Windows Defender or SmartScreen may warn about an "unknown publisher" since the app is not code-signed. Click **"More info → Run anyway"** to proceed — this is safe for locally built apps.

</div>

---

## ✨ Features

### 🗂️ Multi-Panel Workspace
Open any combination of floating windows on your canvas simultaneously, each independently draggable, resizable, and snappable.

| Window Type | Description |
|---|---|
| 🌐 **Web Browser** | A full Chromium browser. Launch any website directly from the dock. Defaults to the left half of your screen. |
| 📄 **PDF Reader** | Open local PDF files natively with a built-in reader. |
| 🎬 **Video Player** | Pin a video lecture or tutorial as a floating overlay. |
| 🤖 **AI Assistant** | One-click access to ChatGPT, Claude, Gemini, Perplexity, or DeepSeek. Opens with its own distinctive purple icon. |

### 🪄 Window Management
- **Drag & Resize**: Every window is freely draggable and resizable using `react-rnd`.
- **Snap Layouts**: Hover over a window's title bar to reveal snap controls → snap Left, Right, or Maximize instantly.
- **Minimize to Dock**: Minimize any window to the bottom taskbar. Click its icon to restore.

### 🎨 Design
- **Dark Frosted Glass Dock**: A macOS-inspired floating taskbar centered at the bottom of your screen.
- **Infinite Excalidraw Canvas**: The full background is a live drawing canvas for notes, diagrams, and doodles.
- **Focus Mode**: Hides the entire dock with a smooth slide animation. A small arrow tab remains to bring it back.

---

## 🚀 Running From Source

If you prefer to run the project yourself rather than using the installer:

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- `npm` (comes with Node.js)

### Setup

```bash
# 1. Clone or download the source code
git clone <your-repo-url>
cd study-dashboard

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will launch in development mode with DevTools enabled.

### Building the Executable Yourself

```bash
npm run build:exe
```

Compiled files will be output to the `release/` directory.

> **⚠️ Build Tip:** If the build fails with an NSIS ENOENT error the first time, delete the electron-builder cache:
> `C:\Users\<YourName>\AppData\Local\electron-builder\Cache` and re-run the build.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Desktop Shell | Electron v40 |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4, Lucide Icons |
| Canvas | Excalidraw |
| State | Zustand |
| Window Manager | react-rnd |

---

## 📁 Project Structure

```
study-dashboard/
├── electron/           # Electron main process (main.ts, preload.ts)
├── src/
│   ├── components/     # UI components (Taskbar, WindowContainer, BrowserApp, etc.)
│   ├── store/          # Zustand global state (windowStore.ts)
│   └── App.tsx         # Root component
├── public/             # Static assets (icon)
├── build/              # electron-builder resources (icon.png)
└── release/            # Output directory for compiled .exe files
```

---

## 📝 License

Copyright © 2026 Study Dashboard. Released under the [MIT License](LICENSE).
