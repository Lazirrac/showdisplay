interface ControlPanelProps {
  onShowOnDisplay: () => void
  onOpenDisplay: () => void
  onCloseDisplay: () => void
  isDisplayOpen: boolean
  hasSelection: boolean
}

export default function ControlPanel({
  onShowOnDisplay,
  onOpenDisplay,
  onCloseDisplay,
  isDisplayOpen,
  hasSelection,
}: ControlPanelProps) {
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={onShowOnDisplay}
            disabled={!hasSelection}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Show on Display
          </button>

          <button
            onClick={onOpenDisplay}
            disabled={isDisplayOpen}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Open Display Window
          </button>

          <button
            onClick={onCloseDisplay}
            disabled={!isDisplayOpen}
            className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Close Display Window
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              isDisplayOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
            }`}
          />
          <span className="text-sm text-gray-600">
            {isDisplayOpen ? 'Display Window Active' : 'Display Window Closed'}
          </span>
        </div>
      </div>
    </div>
  )
}
