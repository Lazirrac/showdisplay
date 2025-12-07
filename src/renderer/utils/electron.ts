import type { Scene } from '../types'

declare global {
  interface Window {
    electron?: {
      openOutputWindow: () => void
      closeOutputWindow: () => void
      toggleOutputFullscreen: () => void
      updateProgramFeed: (scene: Scene) => void
      getDisplays: () => void
      onDisplaysList: (callback: (displays: any[]) => void) => void
      onOutputWindowClosed: (callback: () => void) => void
    }
  }
}

const isElectron = () => {
  return !!(window && (window as any).process && (window as any).process.type)
}

if (isElectron()) {
  const { ipcRenderer } = (window as any).require('electron')

  window.electron = {
    openOutputWindow: () => ipcRenderer.send('open-output-window'),
    closeOutputWindow: () => ipcRenderer.send('close-output-window'),
    toggleOutputFullscreen: () => ipcRenderer.send('toggle-output-fullscreen'),
    updateProgramFeed: (scene: Scene) => ipcRenderer.send('update-program-feed', scene),
    getDisplays: () => ipcRenderer.send('get-displays'),
    onDisplaysList: (callback) => ipcRenderer.on('displays-list', (_event: any, data: any) => callback(data)),
    onOutputWindowClosed: (callback) => ipcRenderer.on('output-window-closed', () => callback()),
  }
}

export {}
