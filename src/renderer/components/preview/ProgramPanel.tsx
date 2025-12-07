import { useProjectStore } from '../../store/useProjectStore'

export default function ProgramPanel() {
  const { scenes, currentSceneId } = useProjectStore()
  const currentScene = scenes.find(s => s.id === currentSceneId)

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          Program (Live)
        </h2>
        <span className="text-xs text-slate-400">{currentScene?.name || 'No scene'}</span>
      </div>

      <div className="flex-1 bg-black flex items-center justify-center relative border-2 border-red-900/50">
        {currentScene && currentScene.sources.length > 0 ? (
          <div className="text-slate-500 text-sm">Live Output</div>
        ) : (
          <div className="text-slate-600 text-sm">No active scene</div>
        )}
      </div>
    </div>
  )
}
