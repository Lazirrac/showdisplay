// Core types for ShowDisplay

export type SourceType = 'video' | 'image' | 'text' | 'window-capture' | 'audio'

export interface Source {
  id: string
  name: string
  type: SourceType
  visible: boolean
  locked: boolean

  // Position and size
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number

  // Source-specific properties
  properties: VideoSourceProperties | ImageSourceProperties | TextSourceProperties | AudioSourceProperties | WindowCaptureProperties
}

export interface VideoSourceProperties {
  type: 'video'
  src: string
  loop: boolean
  volume: number
  muted: boolean
}

export interface ImageSourceProperties {
  type: 'image'
  src: string
}

export interface TextSourceProperties {
  type: 'text'
  text: string
  fontSize: number
  fontFamily: string
  color: string
  backgroundColor: string
  textAlign: 'left' | 'center' | 'right'
  bold: boolean
  italic: boolean
}

export interface AudioSourceProperties {
  type: 'audio'
  src: string
  loop: boolean
  volume: number
}

export interface WindowCaptureProperties {
  type: 'window-capture'
  windowTitle: string
}

export interface Scene {
  id: string
  name: string
  sources: Source[]
}

export type TransitionType = 'cut' | 'fade' | 'slide'

export interface Transition {
  type: TransitionType
  duration: number // milliseconds
}

export interface AudioChannel {
  id: string
  name: string
  volume: number
  muted: boolean
  sourceId?: string
}

export interface ProjectState {
  scenes: Scene[]
  currentSceneId: string | null
  previewSceneId: string | null
  transition: Transition
  audioChannels: AudioChannel[]
}
