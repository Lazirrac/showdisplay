import { useState, useEffect } from 'react'
import { useProjectStore } from '../../store/useProjectStore'

interface Display {
  id: number
  name: string
  bounds: { x: number; y: number; width: number; height: number }
  isPrimary: boolean
}

export default function TransitionControls() {
  const { transition, performTransition, setTransition, scenes, currentSceneId } = useProjectStore()
  const [isLive, setIsLive] = useState(false)
  const [showDisplaySelector, setShowDisplaySelector] = useState(false)
  const [displays, setDisplays] = useState<Display[]>([])
  const [selectedDisplay, setSelectedDisplay] = useState<Display | null>(null)

  useEffect(() => {
    // Setup listener for display list
    if (window.electron) {
      const handleDisplayList = (displayList: Display[]) => {
        setDisplays(displayList)
        if (displayList.length > 0 && !selectedDisplay) {
          setSelectedDisplay(displayList[0])
        }
        // Show selector after displays are loaded
        setShowDisplaySelector(true)
      }

      window.electron.onDisplaysList(handleDisplayList)
    }
  }, [selectedDisplay])

  const handleGoLiveClick = () => {
    if (!isLive) {
      // Request updated display list when clicking GO LIVE
      if (window.electron) {
        window.electron.getDisplays()
      }
    } else {
      // Close output window
      if (window.electron) {
        window.electron.closeOutputWindow()
      }
      setIsLive(false)
    }
  }

  const handleDisplaySelect = (display: Display) => {
    setSelectedDisplay(display)
    setShowDisplaySelector(false)

    // First perform transition to update the program feed
    performTransition()

    // Get the current scene to send to output
    const currentScene = scenes.find(s => s.id === currentSceneId)

    // Wait a bit for the transition to complete, then open output window
    setTimeout(() => {
      if (window.electron) {
        window.electron.openOutputWindow()

        // Wait for window to be ready, then send the scene and go fullscreen
        setTimeout(() => {
          if (window.electron && currentScene) {
            // Send the current scene to the output window
            window.electron.updateProgramFeed(currentScene)

            // Then go fullscreen
            setTimeout(() => {
              if (window.electron) {
                window.electron.toggleOutputFullscreen()
              }
            }, 200)
          }
        }, 500)
      }
      setIsLive(true)
    }, 100)
  }

  return (
    <div className="panel h-full flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-slate-400">Transition:</label>
        <select
          value={transition.type}
          onChange={(e) => setTransition({ ...transition, type: e.target.value as any })}
          className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-sm"
        >
          <option value="cut">Cut</option>
          <option value="fade">Fade</option>
          <option value="slide">Slide</option>
        </select>

        <label className="text-sm text-slate-400">Duration:</label>
        <input
          type="number"
          value={transition.duration}
          onChange={(e) => setTransition({ ...transition, duration: Number(e.target.value) })}
          className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-sm w-20"
        />
        <span className="text-xs text-slate-500">ms</span>
      </div>

      <button
        onClick={handleGoLiveClick}
        className={`px-8 py-3 rounded font-bold text-lg transition-colors ${
          isLive
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isLive ? 'STOP LIVE' : 'GO LIVE'}
      </button>

      {/* Display Selector Modal */}
      {showDisplaySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Select Output Display</h3>
            <div className="space-y-2">
              {displays.map((display) => (
                <button
                  key={display.id}
                  onClick={() => handleDisplaySelect(display)}
                  className={`w-full p-3 rounded text-left transition-colors ${
                    selectedDisplay?.id === display.id
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <div className="font-medium">{display.name}</div>
                  <div className="text-xs text-slate-400">
                    {display.bounds.width} x {display.bounds.height}
                    {display.isPrimary && ' (Primary)'}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowDisplaySelector(false)}
              className="w-full mt-4 px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
