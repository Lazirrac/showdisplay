import { useState, useEffect } from 'react'
import MediaLibrary from './components/MediaLibrary'
import PreviewDisplay from './components/PreviewDisplay'
import LiveDisplay from './components/LiveDisplay'

interface MediaItem {
  id: string
  path: string
  name: string
  type: 'image' | 'video'
  size: number
}

interface Display {
  id: number
  name: string
  bounds: { x: number; y: number; width: number; height: number }
  isPrimary: boolean
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [liveItem, setLiveItem] = useState<MediaItem | null>(null)
  const [availableDisplays, setAvailableDisplays] = useState<Display[]>([
    { id: 0, name: 'Primary Display', bounds: { x: 0, y: 0, width: 1920, height: 1080 }, isPrimary: true }
  ])
  const [previewDisplayId, setPreviewDisplayId] = useState<number | null>(null)
  const [liveDisplayId, setLiveDisplayId] = useState<number | null>(null)

  const [previewWindowOpen, setPreviewWindowOpen] = useState(false)
  const [liveWindowOpen, setLiveWindowOpen] = useState(false)

  // Setup window close listeners
  useEffect(() => {
    if (window.electron) {
      window.electron.onPreviewWindowClosed(() => {
        setPreviewWindowOpen(false)
      })
      window.electron.onLiveWindowClosed(() => {
        setLiveWindowOpen(false)
      })
    }

    // Skip loading screen
    setTimeout(() => {
      setLoadingProgress(100)
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }, 500)
  }, [])

  const handleAddFiles = (files: FileList) => {
    const newItems: MediaItem[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      path: file.path || URL.createObjectURL(file),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'video',
      size: file.size,
    }))
    setMediaItems([...mediaItems, ...newItems])
  }

  const handleRemoveItem = (id: string) => {
    setMediaItems(mediaItems.filter((item) => item.id !== id))
    if (selectedItem?.id === id) setSelectedItem(null)
    if (previewItem?.id === id) setPreviewItem(null)
    if (liveItem?.id === id) setLiveItem(null)
  }

  const handleSendToPreview = (item: MediaItem) => {
    setPreviewItem(item)
    if (window.electron) {
      if (!previewWindowOpen) {
        window.electron.openPreviewWindow()
        setPreviewWindowOpen(true)
      }
      setTimeout(() => {
        window.electron?.showPreviewMedia(item.path, item.type)
      }, 300)
    }
  }

  const handleSendToLive = (item: MediaItem) => {
    setLiveItem(item)
    if (window.electron) {
      if (!liveWindowOpen) {
        window.electron.openLiveWindow()
        setLiveWindowOpen(true)
      }
      setTimeout(() => {
        window.electron?.showLiveMedia(item.path, item.type)
      }, 300)
    }
  }

  const handleTogglePreviewWindow = () => {
    if (window.electron) {
      if (previewWindowOpen) {
        window.electron.closePreviewWindow()
        setPreviewWindowOpen(false)
      } else {
        window.electron.openPreviewWindow()
        setPreviewWindowOpen(true)
        if (previewItem) {
          setTimeout(() => {
            window.electron?.showPreviewMedia(previewItem.path, previewItem.type)
          }, 300)
        }
      }
    }
  }

  const handleToggleLiveWindow = () => {
    if (window.electron) {
      if (liveWindowOpen) {
        window.electron.closeLiveWindow()
        setLiveWindowOpen(false)
      } else {
        window.electron.openLiveWindow()
        setLiveWindowOpen(true)
        if (liveItem) {
          setTimeout(() => {
            window.electron?.showLiveMedia(liveItem.path, liveItem.type)
          }, 300)
        }
      }
    }
  }

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">ShowDisplay Pro</h1>
            <p className="text-gray-400">Multi-Screen Presentation System</p>
          </div>

          {/* Loading Animation */}
          <div className="mb-6">
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <p className="text-white font-medium">
              {loadingProgress < 30 && "Initializing Electron..."}
              {loadingProgress >= 30 && loadingProgress < 80 && "Detecting displays..."}
              {loadingProgress >= 80 && "Almost ready..."}
            </p>
            <p className="text-gray-500 text-sm">{loadingProgress}%</p>
          </div>

          {/* Spinner */}
          <div className="mt-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-900 p-2 gap-2">
      {/* Left Panel - Media Library */}
      <div className="w-1/3 flex flex-col">
        <MediaLibrary
          mediaItems={mediaItems}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
          onAddFiles={handleAddFiles}
          onRemoveItem={handleRemoveItem}
          onSendToPreview={handleSendToPreview}
          onSendToLive={handleSendToLive}
        />
      </div>

      {/* Right Panels - Preview & Live */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Preview Panel - Top */}
        <div className="flex-1">
          <PreviewDisplay
            mediaItem={previewItem}
            windowOpen={previewWindowOpen}
            onToggleWindow={handleTogglePreviewWindow}
          />
        </div>

        {/* Live Panel - Bottom */}
        <div className="flex-1">
          <LiveDisplay
            mediaItem={liveItem}
            windowOpen={liveWindowOpen}
            onToggleWindow={handleToggleLiveWindow}
          />
        </div>
      </div>
    </div>
  )
}

export default App
