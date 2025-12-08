import { useProjectStore } from '../../store/useProjectStore'

export default function SceneList() {
  const { scenes, currentSceneId, previewSceneId, setPreviewScene, addScene } = useProjectStore()

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h2 className="text-sm font-semibold">Scenes</h2>
        <button
          onClick={() => addScene(`Scene ${scenes.length + 1}`)}
          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
        >
          + Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            onClick={() => setPreviewScene(scene.id)}
            className={`
              p-2 rounded cursor-pointer transition-colors
              ${previewSceneId === scene.id ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'}
              ${currentSceneId === scene.id ? 'border-2 border-green-500' : 'border border-transparent'}
            `}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{scene.name}</span>
              {currentSceneId === scene.id && (
                <span className="text-xs bg-green-600 px-2 py-0.5 rounded">LIVE</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
