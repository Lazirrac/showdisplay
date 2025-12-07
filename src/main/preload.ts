import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  openDisplayWindow: () => ipcRenderer.send('open-display-window'),
  closeDisplayWindow: () => ipcRenderer.send('close-display-window'),
  showMedia: (mediaPath: string, mediaType: string) =>
    ipcRenderer.send('show-media', mediaPath, mediaType),
  stopMedia: () => ipcRenderer.send('stop-media'),
  onDisplayMedia: (callback: (data: { mediaPath: string; mediaType: string }) => void) =>
    ipcRenderer.on('display-media', (_event, data) => callback(data)),
  onStopMedia: (callback: () => void) =>
    ipcRenderer.on('stop-media', () => callback()),
})
