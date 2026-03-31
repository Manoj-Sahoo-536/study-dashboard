import { app, BrowserWindow, ipcMain, dialog, globalShortcut } from 'electron'
import path from 'node:path'

// The built directory structure
//
// ├─┬─ dist
// │ ├─ index.html
// │ ├─ assets
// │ └─ ...
// ├─┬─ dist-electron
// │ ├─ main.js
// │ └─ preload.js
//
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(__dirname, '../public')

// Disable proxy to avoid connection issues
app.commandLine.appendSwitch('no-proxy-server');
// Ignore certificate errors (for self-signed certs on internal networks)
app.commandLine.appendSwitch('ignore-certificate-errors');

let win: BrowserWindow | null

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC || '', 'icon.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // Show window only after it's ready to prevent white flash
  win.once('ready-to-show', () => {
    win?.maximize()
    win?.show()
  })

  // Only open DevTools in development
  win.webContents.on('did-finish-load', () => {
    if (VITE_DEV_SERVER_URL) {
      win?.webContents.openDevTools()
    }
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST || '', 'index.html'))
  }
}

// ─── IPC Handlers ──────────────────────────────────────────────────────────

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'PDFs', extensions: ['pdf'] }],
  })
  return canceled ? null : filePaths[0]
})

ipcMain.handle('dialog:openVideo', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Videos', extensions: ['mkv', 'avi', 'mp4', 'webm', 'mov'] }],
  })
  return canceled ? null : filePaths[0]
})

ipcMain.handle('get-app-path', () => {
  return app.getAppPath()
})

// ─── App Lifecycle ─────────────────────────────────────────────────────────

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  // Set proper Windows taskbar identity for packaged builds
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.worknest.app')
  }

  createWindow()

  // Global shortcut: hide/show the app window
  globalShortcut.register('CommandOrControl+Shift+Space', () => {
    if (win) {
      if (win.isVisible()) {
        win.hide()
      } else {
        win.show()
        win.focus()
      }
    }
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
