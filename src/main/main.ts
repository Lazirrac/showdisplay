import { app, BrowserWindow, screen } from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'

let mainWindow: BrowserWindow | null = null
let displayWindow: BrowserWindow | null = null

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'ShowDisplay - Control Panel',
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
    if (displayWindow) {
      displayWindow.close()
    }
  })
}

function createDisplayWindow() {
  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find((display) => display.bounds.x !== 0 || display.bounds.y !== 0)

  displayWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: 'ShowDisplay - Presentation',
    backgroundColor: '#000000',
  })

  // Move to second display if available
  if (externalDisplay) {
    displayWindow.setBounds(externalDisplay.bounds)
  }

  if (isDev) {
    displayWindow.loadURL('http://localhost:5173/display.html')
  } else {
    displayWindow.loadFile(path.join(__dirname, '../renderer/display.html'))
  }

  displayWindow.on('closed', () => {
    displayWindow = null
  })

  return displayWindow
}

app.whenReady().then(() => {
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers for display window
import { ipcMain } from 'electron'

ipcMain.on('open-display-window', () => {
  if (!displayWindow) {
    createDisplayWindow()
  } else {
    displayWindow.focus()
  }
})

ipcMain.on('close-display-window', () => {
  if (displayWindow) {
    displayWindow.close()
    displayWindow = null
  }
})

ipcMain.on('show-media', (_event, mediaPath: string, mediaType: string) => {
  if (displayWindow) {
    displayWindow.webContents.send('display-media', { mediaPath, mediaType })
  }
})

ipcMain.on('stop-media', () => {
  if (displayWindow) {
    displayWindow.webContents.send('stop-media')
  }
})
