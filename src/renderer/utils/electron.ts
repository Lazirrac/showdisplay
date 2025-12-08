import type { Scene } from '../types'

export interface MediaFile {
  id: number
  name: string
  type: 'image' | 'video' | 'audio'
  path: string
  file_hash: string
  size: number
  duration?: number
  width?: number
  height?: number
  thumbnail_path?: string
  created_at: number
  updated_at: number
  last_seen_at?: number
  ext?: string
  tags?: string
}

export interface SceneData {
  id: number
  name: string
  created_at: number
  updated_at: number
  sources?: any[]
}

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

      // Media methods
      mediaAddFiles: () => Promise<{ success: boolean; files: MediaFile[] }>
      mediaList: (type?: 'image' | 'video' | 'audio') => Promise<{ success: boolean; files: MediaFile[] }>
      mediaGet: (id: number) => Promise<{ success: boolean; file: MediaFile }>
      mediaDelete: (id: number) => Promise<{ success: boolean }>

      // Scene methods
      scenesCreate: (name: string) => Promise<{ success: boolean; sceneId: number }>
      scenesList: () => Promise<{ success: boolean; scenes: SceneData[] }>
      scenesGet: (id: number) => Promise<{ success: boolean; scene: SceneData }>
      scenesUpdate: (id: number, name: string) => Promise<{ success: boolean }>
      scenesDelete: (id: number) => Promise<{ success: boolean }>

      // Scene sources methods
      sceneSourcesCreate: (sceneId: number, sourceData: any) => Promise<{ success: boolean; sourceId: number }>
      sceneSourcesUpdate: (id: number, sourceData: any) => Promise<{ success: boolean }>
      sceneSourcesDelete: (id: number) => Promise<{ success: boolean }>
      sceneSourcesList: (sceneId: number) => Promise<{ success: boolean; sources: any[] }>
    }
  }
}

const isElectron = () => {
  return !!(window && (window as any).process && (window as any).process.type)
}

export { }

if (isElectron()) {
  const { ipcRenderer } = (window as any).require('electron')

  window.electron = {
    openOutputWindow: () => ipcRenderer.send('open-output-window'),
    closeOutputWindow: () => ipcRenderer.send('close-output-window'),
    toggleOutputFullscreen: () => ipcRenderer.send('toggle-output-fullscreen'),
    updateProgramFeed: (scene: Scene) => ipcRenderer.send('update-program-feed', scene),
    getDisplays: () => ipcRenderer.send('get-displays'),
    onDisplaysList: (callback) => {
      ipcRenderer.removeAllListeners('displays-list')
      ipcRenderer.on('displays-list', (_event: any, data: any) => callback(data))
    },
    onOutputWindowClosed: (callback) => ipcRenderer.on('output-window-closed', () => callback()),

    // Media methods
    mediaAddFiles: () => ipcRenderer.invoke('media:add-files'),
    mediaList: (type) => ipcRenderer.invoke('media:list', type),
    mediaGet: (id) => ipcRenderer.invoke('media:get', id),
    mediaDelete: (id) => ipcRenderer.invoke('media:delete', id),

    // Scene methods
    scenesCreate: (name) => ipcRenderer.invoke('scenes:create', name),
    scenesList: () => ipcRenderer.invoke('scenes:list'),
    scenesGet: (id) => ipcRenderer.invoke('scenes:get', id),
    scenesUpdate: (id, name) => ipcRenderer.invoke('scenes:update', id, name),
    scenesDelete: (id) => ipcRenderer.invoke('scenes:delete', id),

    // Scene sources methods
    sceneSourcesCreate: (sceneId, sourceData) => ipcRenderer.invoke('scene-sources:create', sceneId, sourceData),
    sceneSourcesUpdate: (id, sourceData) => ipcRenderer.invoke('scene-sources:update', id, sourceData),
    sceneSourcesDelete: (id) => ipcRenderer.invoke('scene-sources:delete', id),
    sceneSourcesList: (sceneId) => ipcRenderer.invoke('scene-sources:list', sceneId),
  }
}
