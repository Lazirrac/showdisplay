interface MediaItem {
  id: string
  path: string
  name: string
  type: 'image' | 'video'
  size: number
}

interface PreviewDisplayProps {
  mediaItem: MediaItem | null
  windowOpen: boolean
  onToggleWindow: () => void
}

export default function PreviewDisplay({
  mediaItem,
  windowOpen,
  onToggleWindow,
}: PreviewDisplayProps) {
  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg border border-gray-700">
      {/* Header with Window Control */}
      <div className="px-4 py-2 border-b border-gray-700 bg-gray-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
          <h3 className="text-sm font-semibold text-white">Preview</h3>
        </div>

        {/* Window Toggle Button */}
        <button
          onClick={onToggleWindow}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            windowOpen
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span>{windowOpen ? 'Close Window' : 'Open Window'}</span>
        </button>
      </div>

      {/* Preview Content Area */}
      <div className="flex-1 flex items-center justify-center bg-black/50 m-2 rounded-md overflow-hidden">
        {mediaItem ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            {mediaItem.type === 'image' ? (
              <img
                src={mediaItem.path}
                alt={mediaItem.name}
                className="max-w-full max-h-full object-contain rounded shadow-2xl"
              />
            ) : (
              <div className="text-center">
                <svg
                  className="mx-auto h-20 w-20 text-purple-500/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-3 text-white text-sm font-medium">{mediaItem.name}</p>
                <p className="mt-1 text-gray-400 text-xs">Video File - Ready for Preview</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <p className="mt-4 text-sm">No Preview</p>
            <p className="text-xs text-gray-600 mt-1">Select a file and click "→ Preview"</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {mediaItem && (
        <div className="px-3 py-2 border-t border-gray-700 bg-gray-800/50 flex items-center justify-between">
          <p className="text-xs text-gray-400 truncate flex-1">
            <span className="font-semibold text-white">{mediaItem.name}</span>
          </p>
          {windowOpen && (
            <span className="ml-2 px-2 py-0.5 bg-yellow-600 text-white text-xs font-bold rounded">
              WINDOW OPEN
            </span>
          )}
        </div>
      )}
    </div>
  )
}
