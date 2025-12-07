interface MediaItem {
  id: string
  path: string
  name: string
  type: 'image' | 'video'
  size: number
}

interface PreviewPanelProps {
  selectedItem: MediaItem | null
}

export default function PreviewPanel({ selectedItem }: PreviewPanelProps) {
  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  if (!selectedItem) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          <div className="text-center text-gray-400">
            <svg
              className="mx-auto h-16 w-16 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <p className="mt-4 text-lg">No preview available</p>
            <p className="mt-1 text-sm">Select a media file to preview</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 p-4">
        {selectedItem.type === 'image' ? (
          <img
            src={selectedItem.path}
            alt={selectedItem.name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
        ) : (
          <div className="text-center">
            <svg
              className="mx-auto h-24 w-24 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mt-4 text-white text-lg">Video File</p>
            <p className="mt-2 text-gray-400 text-sm">Click "Show on Display" to play</p>
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="p-4 bg-white border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">File Information</h3>
        <dl className="space-y-1">
          <div className="flex justify-between text-sm">
            <dt className="text-gray-600">Name:</dt>
            <dd className="text-gray-900 font-medium truncate ml-2">{selectedItem.name}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-gray-600">Type:</dt>
            <dd className="text-gray-900 font-medium">{selectedItem.type.toUpperCase()}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-gray-600">Size:</dt>
            <dd className="text-gray-900 font-medium">{formatFileSize(selectedItem.size)}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-gray-600">Path:</dt>
            <dd className="text-gray-900 font-mono text-xs truncate ml-2" title={selectedItem.path}>
              {selectedItem.path}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
