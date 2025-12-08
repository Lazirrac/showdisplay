const { app, BrowserWindow, screen, ipcMain, powerSaveBlocker, dialog } = require('electron')
const path = require('path')
const fs = require('fs').promises
const DatabaseService = require('./database')

let controlWindow = null
let outputWindow = null
let powerSaveBlockerId = null
let db = null

function createControlWindow() {
  const isDev = !app.isPackaged

  controlWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    title: 'ShowDisplay - Control Panel',
    backgroundColor: '#0f172a',
  })

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`

  controlWindow.loadURL(startUrl)

  if (isDev) {
    controlWindow.webContents.openDevTools()
  }

  controlWindow.on('closed', () => {
    controlWindow = null
    if (outputWindow) outputWindow.close()
    app.quit()
  })
}

function createOutputWindow() {
  if (outputWindow) {
    outputWindow.focus()
    return outputWindow
  }

  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find((display) => display.bounds.x !== 0 || display.bounds.y !== 0) || displays[0]

  outputWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    x: externalDisplay.bounds.x,
    y: externalDisplay.bounds.y,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    title: 'ShowDisplay - Output',
    backgroundColor: '#000000',
    frame: false,
    fullscreen: false,
  })

  const isDev = !app.isPackaged
  const outputUrl = isDev
    ? `file://${path.join(__dirname, 'output.html')}`
    : `file://${path.join(__dirname, '../dist/output.html')}`

  outputWindow.loadURL(outputUrl)

  outputWindow.on('closed', () => {
    outputWindow = null
    if (controlWindow) {
      controlWindow.webContents.send('output-window-closed')
    }
  })

  return outputWindow
}

app.whenReady().then(() => {
  // Initialize database
  db = new DatabaseService()

  createControlWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createControlWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close()
    app.quit()
  }
})

app.on('before-quit', () => {
  if (db) db.close()
})

// IPC Handlers

ipcMain.on('open-output-window', () => {
  createOutputWindow()
})

ipcMain.on('close-output-window', () => {
  if (outputWindow) {
    // Stop power save blocker when closing output window
    if (powerSaveBlockerId !== null) {
      powerSaveBlocker.stop(powerSaveBlockerId)
      console.log('Power save blocker stopped on window close')
      powerSaveBlockerId = null
    }
    outputWindow.close()
  }
})

ipcMain.on('toggle-output-fullscreen', () => {
  if (outputWindow) {
    const willBeFullscreen = !outputWindow.isFullScreen()
    outputWindow.setFullScreen(willBeFullscreen)

    // Prevent display from sleeping when in fullscreen
    if (willBeFullscreen) {
      if (powerSaveBlockerId === null) {
        powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep')
        console.log('Power save blocker started:', powerSaveBlockerId)
      }
    } else {
      if (powerSaveBlockerId !== null) {
        powerSaveBlocker.stop(powerSaveBlockerId)
        console.log('Power save blocker stopped')
        powerSaveBlockerId = null
      }
    }
  }
})

ipcMain.on('update-program-feed', (_event, sceneData) => {
  if (outputWindow && outputWindow.webContents) {
    outputWindow.webContents.send('render-scene', sceneData)
  }
})

ipcMain.on('get-displays', (event) => {
  const displays = screen.getAllDisplays()
  const primaryId = screen.getPrimaryDisplay().id

  const displayData = displays.map((display, index) => ({
    id: display.id,
    name: display.id === primaryId ? 'Primary Display' : `Display ${index + 1}`,
    bounds: display.bounds,
    isPrimary: display.id === primaryId,
  }))

  event.reply('displays-list', displayData)
})

// Media Management IPC Handlers

ipcMain.handle('media:add-files', async () => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Media Files', extensions: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'webm', 'mp3', 'wav'] },
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] },
        { name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'webm'] },
        { name: 'Audio', extensions: ['mp3', 'wav'] },
      ]
    })

    if (result.canceled) {
      return { success: false, files: [] }
    }

    const addedFiles = []

    for (const filePath of result.filePaths) {
      try {
        const fileBuffer = await fs.readFile(filePath)
        const stats = await fs.stat(filePath)
        const fileHash = db.calculateFileHash(fileBuffer)
        const fileName = path.basename(filePath)
        const ext = path.extname(filePath).toLowerCase()

        // Determine media type
        let mediaType
        if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
          mediaType = 'image'
        } else if (['.mp4', '.mov', '.avi', '.webm'].includes(ext)) {
          mediaType = 'video'
        } else if (['.mp3', '.wav'].includes(ext)) {
          mediaType = 'audio'
        } else {
          continue
        }

        const mediaId = db.addMediaFile({
          name: fileName,
          type: mediaType,
          path: filePath,
          file_hash: fileHash,
          size: stats.size,
          ext: ext,
          tags: '[]'
        })

        addedFiles.push({
          id: mediaId,
          name: fileName,
          type: mediaType,
          path: filePath,
          size: stats.size,
        })
      } catch (error) {
        console.error(`Error adding file ${filePath}:`, error)
      }
    }

    return { success: true, files: addedFiles }
  } catch (error) {
    console.error('Error in media:add-files:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('media:list', async (_event, type = null) => {
  try {
    const files = db.getMediaFiles(type)
    return { success: true, files }
  } catch (error) {
    console.error('Error in media:list:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('media:get', async (_event, id) => {
  try {
    const file = db.getMediaFileById(id)
    return { success: true, file }
  } catch (error) {
    console.error('Error in media:get:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('media:delete', async (_event, id) => {
  try {
    db.deleteMediaFile(id)
    return { success: true }
  } catch (error) {
    console.error('Error in media:delete:', error)
    return { success: false, error: error.message }
  }
})

// Scene Management IPC Handlers

ipcMain.handle('scenes:create', async (_event, name) => {
  try {
    const sceneId = db.createScene(name)
    return { success: true, sceneId }
  } catch (error) {
    console.error('Error in scenes:create:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('scenes:list', async () => {
  try {
    const scenes = db.getScenes()
    return { success: true, scenes }
  } catch (error) {
    console.error('Error in scenes:list:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('scenes:get', async (_event, id) => {
  try {
    const scene = db.getSceneById(id)
    return { success: true, scene }
  } catch (error) {
    console.error('Error in scenes:get:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('scenes:update', async (_event, id, name) => {
  try {
    db.updateScene(id, name)
    return { success: true }
  } catch (error) {
    console.error('Error in scenes:update:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('scenes:delete', async (_event, id) => {
  try {
    db.deleteScene(id)
    return { success: true }
  } catch (error) {
    console.error('Error in scenes:delete:', error)
    return { success: false, error: error.message }
  }
})

// Scene Sources IPC Handlers

ipcMain.handle('scene-sources:create', async (_event, sceneId, sourceData) => {
  try {
    const sourceId = db.createSceneSource(sceneId, sourceData)
    return { success: true, sourceId }
  } catch (error) {
    console.error('Error in scene-sources:create:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('scene-sources:update', async (_event, id, sourceData) => {
  try {
    db.updateSceneSource(id, sourceData)
    return { success: true }
  } catch (error) {
    console.error('Error in scene-sources:update:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('scene-sources:delete', async (_event, id) => {
  try {
    db.deleteSceneSource(id)
    return { success: true }
  } catch (error) {
    console.error('Error in scene-sources:delete:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('scene-sources:list', async (_event, sceneId) => {
  try {
    const sources = db.getSceneSources(sceneId)
    return { success: true, sources }
  } catch (error) {
    console.error('Error in scene-sources:list:', error)
    return { success: false, error: error.message }
  }
})
