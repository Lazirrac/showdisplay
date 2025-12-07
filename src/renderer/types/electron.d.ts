export interface ElectronAPI {
  openDisplayWindow: () => void
  closeDisplayWindow: () => void
  showMedia: (mediaPath: string, mediaType: string) => void
  stopMedia: () => void
  onDisplayMedia: (callback: (data: { mediaPath: string; mediaType: string }) => void) => void
  onStopMedia: (callback: () => void) => void
}

declare global {
  interface Window {
    electron?: ElectronAPI
  }
}

export {}
