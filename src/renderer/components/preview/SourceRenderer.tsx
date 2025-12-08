import { useEffect, useRef, useState } from 'react'
import { Rnd } from 'react-rnd'
import type { Source, TextSourceProperties, TimerSourceProperties, ImageSourceProperties, VideoSourceProperties } from '../../types'

interface SourceRendererProps {
  source: Source
  scale?: number
  onUpdate?: (updates: Partial<Source>) => void
  isPreview?: boolean
}

export default function SourceRenderer({ source, scale = 1, onUpdate, isPreview = false }: SourceRendererProps) {
  if (!source.visible) return null

  const content = (() => {
    switch (source.type) {
      case 'text':
        return <TextSourceRenderer source={source} properties={source.properties as TextSourceProperties} />
      case 'timer':
        return <TimerSourceRenderer source={source} properties={source.properties as TimerSourceProperties} />
      case 'image':
        return <ImageSourceRenderer source={source} properties={source.properties as ImageSourceProperties} />
      case 'video':
        return <VideoSourceRenderer source={source} properties={source.properties as VideoSourceProperties} />
      default:
        return null
    }
  })()

  if (!isPreview || !onUpdate) {
    // Static rendering for Program/Output
    const style: React.CSSProperties = {
      position: 'absolute',
      left: source.x * scale,
      top: source.y * scale,
      width: source.width * scale,
      height: source.height * scale,
      transform: `rotate(${source.rotation}deg)`,
      zIndex: source.zIndex,
    }
    return <div style={style}>{content}</div>
  }

  // Interactive rendering for Preview
  return (
    <Rnd
      size={{ width: source.width, height: source.height }}
      position={{ x: source.x, y: source.y }}
      onDragStop={(e, d) => {
        onUpdate({ x: d.x, y: d.y })
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          x: position.x,
          y: position.y,
        })
      }}
      bounds="parent"
      style={{ zIndex: source.zIndex }}
      enableResizing={!source.locked}
      disableDragging={source.locked}
    >
      <div style={{ width: '100%', height: '100%', transform: `rotate(${source.rotation}deg)` }}>
        {content}
      </div>
    </Rnd>
  )
}

function TextSourceRenderer({ properties }: { source: Source; properties: TextSourceProperties }) {
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
  }

  const textStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    fontSize: properties.fontSize,
    fontFamily: properties.fontFamily,
    color: properties.color,
    backgroundColor: hexToRgba(properties.backgroundColor, properties.backgroundOpacity),
    textAlign: properties.textAlign,
    fontWeight: properties.bold ? 'bold' : 'normal',
    fontStyle: properties.italic ? 'italic' : 'normal',
    textDecoration: properties.underline ? 'underline' : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: properties.textAlign === 'center' ? 'center' : properties.textAlign === 'right' ? 'flex-end' : 'flex-start',
    padding: '8px',
    wordWrap: 'break-word',
    overflow: 'hidden',
  }

  return (
    <div style={textStyle}>
      {properties.text}
    </div>
  )
}

function TimerSourceRenderer({ properties }: { source: Source; properties: TimerSourceProperties }) {
  const [time, setTime] = useState(properties.elapsed)

  useEffect(() => {
    if (properties.running) {
      const interval = setInterval(() => {
        setTime(prev => {
          if (properties.mode === 'countdown') {
            const newTime = prev + 1
            return newTime >= properties.duration ? properties.duration : newTime
          } else {
            return prev + 1
          }
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [properties.running, properties.mode, properties.duration])

  // Sync with properties.elapsed when it changes
  useEffect(() => {
    setTime(properties.elapsed)
  }, [properties.elapsed])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    if (properties.format === 'HH:MM:SS') {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    } else if (properties.format === 'MM:SS') {
      const totalMinutes = Math.floor(seconds / 60)
      return `${String(totalMinutes).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    } else {
      return String(seconds).padStart(2, '0')
    }
  }

  const displayTime = properties.mode === 'clock'
    ? new Date().toLocaleTimeString()
    : properties.mode === 'countdown'
      ? formatTime(Math.max(0, properties.duration - time))
      : formatTime(time)

  const timerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    fontSize: properties.fontSize,
    fontFamily: properties.fontFamily,
    color: properties.color,
    backgroundColor: `rgba(${parseInt(properties.backgroundColor.slice(1, 3), 16)}, ${parseInt(properties.backgroundColor.slice(3, 5), 16)}, ${parseInt(properties.backgroundColor.slice(5, 7), 16)}, ${properties.backgroundOpacity / 100})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontVariantNumeric: 'tabular-nums',
  }

  return (
    <div style={timerStyle}>
      {displayTime}
    </div>
  )
}

function ImageSourceRenderer({ properties }: { source: Source; properties: ImageSourceProperties }) {
  if (!properties.src) return null

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundImage: `url(${properties.src})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }

  return <div style={imgStyle} />
}

function VideoSourceRenderer({ properties }: { source: Source; properties: VideoSourceProperties }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  if (!properties.src) return null

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = properties.volume / 100
      videoRef.current.muted = properties.muted
    }
  }, [properties.volume, properties.muted])

  const videoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  }

  return (
    <video
      ref={videoRef}
      src={properties.src}
      loop={properties.loop}
      autoPlay
      style={videoStyle}
    />
  )
}
