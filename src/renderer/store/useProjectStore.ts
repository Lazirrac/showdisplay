import { create } from 'zustand'
import type { ProjectState, Scene, Source, AudioChannel, Transition } from '../types'

interface ProjectStore extends ProjectState {
  // Scene actions
  addScene: (name: string) => void
  removeScene: (id: string) => void
  renameScene: (id: string, name: string) => void
  duplicateScene: (id: string) => void
  setCurrentScene: (id: string) => void
  setPreviewScene: (id: string) => void

  // Source actions
  addSource: (sceneId: string, source: Omit<Source, 'id'>) => void
  removeSource: (sceneId: string, sourceId: string) => void
  updateSource: (sceneId: string, sourceId: string, updates: Partial<Source>) => void
  moveSource: (sceneId: string, sourceId: string, zIndex: number) => void

  // Transition actions
  setTransition: (transition: Transition) => void
  performTransition: () => void

  // Audio mixer actions
  updateAudioChannel: (channelId: string, updates: Partial<AudioChannel>) => void
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  scenes: [{
    id: 'default-scene',
    name: 'Scene 1',
    sources: []
  }],
  currentSceneId: 'default-scene',
  previewSceneId: 'default-scene',
  transition: { type: 'fade', duration: 300 },
  audioChannels: [],

  // Scene actions
  addScene: (name) => {
    const newScene: Scene = {
      id: `scene-${Date.now()}`,
      name,
      sources: [],
    }
    set((state) => ({
      scenes: [...state.scenes, newScene],
    }))
  },

  removeScene: (id) => {
    set((state) => {
      const filtered = state.scenes.filter((s) => s.id !== id)
      return {
        scenes: filtered,
        currentSceneId: state.currentSceneId === id ? filtered[0]?.id : state.currentSceneId,
        previewSceneId: state.previewSceneId === id ? filtered[0]?.id : state.previewSceneId,
      }
    })
  },

  renameScene: (id, name) => {
    set((state) => ({
      scenes: state.scenes.map((s) => (s.id === id ? { ...s, name } : s)),
    }))
  },

  duplicateScene: (id) => {
    const scene = get().scenes.find((s) => s.id === id)
    if (!scene) return

    const newScene: Scene = {
      ...scene,
      id: `scene-${Date.now()}`,
      name: `${scene.name} (Copy)`,
      sources: scene.sources.map((src) => ({
        ...src,
        id: `source-${Date.now()}-${Math.random()}`,
      })),
    }

    set((state) => ({
      scenes: [...state.scenes, newScene],
    }))
  },

  setCurrentScene: (id) => {
    set({ currentSceneId: id })
  },

  setPreviewScene: (id) => {
    set({ previewSceneId: id })
  },

  // Source actions
  addSource: (sceneId, source) => {
    const newSource: Source = {
      ...source,
      id: `source-${Date.now()}-${Math.random()}`,
    }

    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? { ...scene, sources: [...scene.sources, newSource] }
          : scene
      ),
    }))
  },

  removeSource: (sceneId, sourceId) => {
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? { ...scene, sources: scene.sources.filter((s) => s.id !== sourceId) }
          : scene
      ),
    }))
  },

  updateSource: (sceneId, sourceId, updates) => {
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? {
              ...scene,
              sources: scene.sources.map((s) =>
                s.id === sourceId ? { ...s, ...updates } : s
              ),
            }
          : scene
      ),
    }))
  },

  moveSource: (sceneId, sourceId, zIndex) => {
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === sceneId
          ? {
              ...scene,
              sources: scene.sources.map((s) =>
                s.id === sourceId ? { ...s, zIndex } : s
              ),
            }
          : scene
      ),
    }))
  },

  // Transition actions
  setTransition: (transition) => {
    set({ transition })
  },

  performTransition: () => {
    const { previewSceneId } = get()
    if (previewSceneId) {
      set({ currentSceneId: previewSceneId })

      // Send to output window
      const scene = get().scenes.find(s => s.id === previewSceneId)
      if (scene && window.electron) {
        window.electron.updateProgramFeed(scene)
      }
    }
  },

  // Audio mixer actions
  updateAudioChannel: (channelId, updates) => {
    set((state) => ({
      audioChannels: state.audioChannels.map((ch) =>
        ch.id === channelId ? { ...ch, ...updates } : ch
      ),
    }))
  },
}))
