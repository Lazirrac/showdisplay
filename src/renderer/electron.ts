// Electron API wrapper for renderer process
interface Display {
  id: number
  name: string
  bounds: { x: number; y: number; width: number; height: number }
  isPrimary: boolean
}

declare global {
  interface Window {
    electron?: {
      openPreviewWindow: () => void
      closePreviewWindow: () => void
      showPreviewMedia: (mediaPath: string, mediaType: string) => void
      openLiveWindow: () => void
      closeLiveWindow: () => void
      showLiveMedia: (mediaPath: string, mediaType: string) => void
      onPreviewWindowClosed: (callback: () => void) => void
      onLiveWindowClosed: (callback: () => void) => void
      onDisplayMedia: (callback: (data: { mediaPath: string; mediaType: string }) => void) => void
      onStopMedia: (callback: () => void) => void
    }
  }
}

// Check if running in Electron
const isElectron = () => {
  return !!(window && window.process && (window.process as any).type)
}

// Initialize electron API if in Electron environment
if (isElectron()) {
  const { ipcRenderer } = window.require('electron')

  window.electron = {
    openPreviewWindow: () => ipcRenderer.send('open-preview-window'),
    closePreviewWindow: () => ipcRenderer.send('close-preview-window'),
    showPreviewMedia: (mediaPath: string, mediaType: string) =>
      ipcRenderer.send('show-preview-media', mediaPath, mediaType),
    openLiveWindow: () => ipcRenderer.send('open-live-window'),
    closeLiveWindow: () => ipcRenderer.send('close-live-window'),
    showLiveMedia: (mediaPath: string, mediaType: string) =>
      ipcRenderer.send('show-live-media', mediaPath, mediaType),
    onPreviewWindowClosed: (callback: () => void) =>
      ipcRenderer.on('preview-window-closed', () => callback()),
    onLiveWindowClosed: (callback: () => void) =>
      ipcRenderer.on('live-window-closed', () => callback()),
    onDisplayMedia: (callback: (data: { mediaPath: string; mediaType: string }) => void) =>
      ipcRenderer.on('display-media', (_event: any, data: any) => callback(data)),
    onStopMedia: (callback: () => void) =>
      ipcRenderer.on('stop-media', () => callback()),
  }
}

export {}
