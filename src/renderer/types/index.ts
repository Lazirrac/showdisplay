// Core types for ShowDisplay

export type SourceType = 'video' | 'image' | 'text' | 'timer' | 'window-capture' | 'audio'

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

  // New props
  opacity: number
  volume: number
  isMuted: boolean
  startMs: number
  endMs: number

  // Source-specific properties
  properties: VideoSourceProperties | ImageSourceProperties | TextSourceProperties | TimerSourceProperties | AudioSourceProperties | WindowCaptureProperties
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
  backgroundOpacity: number
  textAlign: 'left' | 'center' | 'right'
  bold: boolean
  italic: boolean
  underline: boolean
}

export interface TimerSourceProperties {
  type: 'timer'
  mode: 'countdown' | 'countup' | 'clock'
  duration: number // seconds for countdown
  running: boolean
  elapsed: number // seconds elapsed
  fontSize: number
  fontFamily: string
  color: string
  backgroundColor: string
  backgroundOpacity: number
  format: 'HH:MM:SS' | 'MM:SS' | 'SS'
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
