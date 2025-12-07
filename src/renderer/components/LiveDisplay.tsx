interface MediaItem {
  id: string
  path: string
  name: string
  type: 'image' | 'video'
  size: number
}

interface LiveDisplayProps {
  mediaItem: MediaItem | null
  windowOpen: boolean
  onToggleWindow: () => void
}

export default function LiveDisplay({
  mediaItem,
  windowOpen,
  onToggleWindow,
}: LiveDisplayProps) {
  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg border border-red-700/50">
      {/* Header with Window Control */}
      <div className="px-4 py-2 border-b border-red-700/50 bg-red-900/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>LIVE</span>
            <span className="text-xs text-red-400 font-normal">ON AIR</span>
          </h3>
        </div>

        {/* Window Toggle Button */}
        <button
          onClick={onToggleWindow}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            windowOpen
              ? 'bg-red-700 hover:bg-red-800 text-white'
              : 'bg-red-700/80 hover:bg-red-700 text-white'
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

      {/* Live Content Area */}
      <div className="flex-1 flex items-center justify-center bg-black/70 m-2 rounded-md overflow-hidden border border-red-900/30">
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
                <div className="relative">
                  <svg
                    className="mx-auto h-20 w-20 text-red-500/50"
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
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <p className="mt-3 text-white text-sm font-medium">{mediaItem.name}</p>
                <p className="mt-1 text-gray-400 text-xs">Video Playing Live</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <div className="relative inline-block">
              <svg
                className="h-16 w-16 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <div className="absolute top-0 right-0 h-2 w-2 bg-gray-600 rounded-full"></div>
            </div>
            <p className="mt-4 text-sm">No Live Content</p>
            <p className="text-xs text-gray-600 mt-1">Select a file and click "→ Live"</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      {mediaItem && (
        <div className="px-3 py-2 border-t border-red-700/50 bg-red-900/10">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 truncate flex-1">
              <span className="font-semibold text-white">{mediaItem.name}</span>
            </p>
            {windowOpen && (
              <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">
                BROADCASTING
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
