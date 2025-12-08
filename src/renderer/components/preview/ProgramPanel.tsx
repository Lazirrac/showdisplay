import { useEffect } from 'react'
import { useProjectStore } from '../../store/useProjectStore'
import SourceRenderer from './SourceRenderer'

export default function ProgramPanel() {
  const { scenes, currentSceneId } = useProjectStore()
  const currentScene = scenes.find(s => s.id === currentSceneId)

  const containerAspect = 16 / 9

  // Send updates to output window whenever current scene changes
  useEffect(() => {
    if (currentScene && window.electron) {
      window.electron.updateProgramFeed(currentScene)
    }
  }, [currentScene])

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          Program (Live)
        </h2>
        <span className="text-xs text-slate-400">{currentScene?.name || 'No scene'}</span>
      </div>

      <div className="flex-1 bg-black flex items-center justify-center relative border-2 border-red-900/50 overflow-hidden">
        {currentScene && currentScene.sources.length > 0 ? (
          <div
            className="relative bg-slate-900"
            style={{
              width: '100%',
              paddingBottom: `${(100 / containerAspect)}%`,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: 'scale(1)',
                transformOrigin: 'top left',
              }}
            >
              {currentScene.sources
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((source) => (
                  <SourceRenderer
                    key={source.id}
                    source={source}
                    scale={1}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="text-slate-600 text-sm">No active scene</div>
        )}
      </div>
    </div>
  )
}
