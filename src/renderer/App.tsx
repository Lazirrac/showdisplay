import { useState, useEffect } from 'react'
import MediaManager from './components/MediaManager'
import PreviewPanel from './components/PreviewPanel'
import ControlPanel from './components/ControlPanel'

interface MediaItem {
  id: string
  path: string
  name: string
  type: 'image' | 'video'
  size: number
}

function App() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [isDisplayOpen, setIsDisplayOpen] = useState(false)

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
    if (selectedItem?.id === id) {
      setSelectedItem(null)
    }
  }

  const handleMoveItem = (id: string, direction: 'up' | 'down') => {
    const index = mediaItems.findIndex((item) => item.id === id)
    if (index === -1) return

    const newItems = [...mediaItems]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newItems.length) return

    ;[newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]]
    setMediaItems(newItems)
  }

  const handleShowOnDisplay = () => {
    if (selectedItem && window.electron) {
      window.electron.showMedia(selectedItem.path, selectedItem.type)
      if (!isDisplayOpen) {
        window.electron.openDisplayWindow()
        setIsDisplayOpen(true)
      }
    }
  }

  const handleOpenDisplay = () => {
    if (window.electron) {
      window.electron.openDisplayWindow()
      setIsDisplayOpen(true)
    }
  }

  const handleCloseDisplay = () => {
    if (window.electron) {
      window.electron.closeDisplayWindow()
      setIsDisplayOpen(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">ShowDisplay</h1>
        <p className="text-sm text-gray-500">Control Panel - Multimedia Presentation System</p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Media Manager */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          <MediaManager
            mediaItems={mediaItems}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onAddFiles={handleAddFiles}
            onRemoveItem={handleRemoveItem}
            onMoveItem={handleMoveItem}
            onClearAll={() => setMediaItems([])}
          />
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2 flex flex-col">
          <PreviewPanel selectedItem={selectedItem} />
        </div>
      </div>

      {/* Control Panel */}
      <ControlPanel
        onShowOnDisplay={handleShowOnDisplay}
        onOpenDisplay={handleOpenDisplay}
        onCloseDisplay={handleCloseDisplay}
        isDisplayOpen={isDisplayOpen}
        hasSelection={!!selectedItem}
      />
    </div>
  )
}

export default App
