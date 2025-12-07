import { useRef } from 'react'

interface MediaItem {
  id: string
  path: string
  name: string
  type: 'image' | 'video'
  size: number
}

interface MediaLibraryProps {
  mediaItems: MediaItem[]
  selectedItem: MediaItem | null
  onSelectItem: (item: MediaItem) => void
  onAddFiles: (files: FileList) => void
  onRemoveItem: (id: string) => void
  onSendToPreview: (item: MediaItem) => void
  onSendToLive: (item: MediaItem) => void
}

export default function MediaLibrary({
  mediaItems,
  selectedItem,
  onSelectItem,
  onAddFiles,
  onRemoveItem,
  onSendToPreview,
  onSendToLive,
}: MediaLibraryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onAddFiles(files)
    }
  }

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg border border-gray-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-3">Media Library</h2>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + Add Files
          </button>
          <button
            onClick={() => selectedItem && onRemoveItem(selectedItem.id)}
            disabled={!selectedItem}
            className="px-3 py-2 bg-red-600/80 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Remove
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Media List */}
      <div className="flex-1 overflow-y-auto p-3">
        {mediaItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <svg
              className="mx-auto h-16 w-16 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-3 text-sm">No media files</p>
            <p className="text-xs text-gray-600 mt-1">Click "Add Files" to start</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {mediaItems.map((item) => (
              <li
                key={item.id}
                className={`group relative bg-gray-700/50 rounded-lg border-2 transition-all ${
                  selectedItem?.id === item.id
                    ? 'border-blue-500 bg-gray-700'
                    : 'border-transparent hover:border-gray-600'
                }`}
              >
                <div
                  onClick={() => onSelectItem(item)}
                  className="p-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {item.type === 'image' ? (
                        <div className="h-10 w-10 rounded bg-blue-600/20 flex items-center justify-center">
                          <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded bg-purple-600/20 flex items-center justify-center">
                          <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {item.type.toUpperCase()} • {formatFileSize(item.size)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Show on hover or selection */}
                {selectedItem?.id === item.id && (
                  <div className="px-3 pb-3 flex gap-2">
                    <button
                      onClick={() => onSendToPreview(item)}
                      className="flex-1 px-2 py-1.5 bg-yellow-600/80 hover:bg-yellow-600 text-white rounded text-xs font-medium transition-colors"
                    >
                      → Preview
                    </button>
                    <button
                      onClick={() => onSendToLive(item)}
                      className="flex-1 px-2 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors"
                    >
                      → Live
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-700 bg-gray-800/50">
        <p className="text-xs text-gray-400">
          Total: <span className="font-semibold text-gray-300">{mediaItems.length}</span> file
          {mediaItems.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
