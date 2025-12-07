import { useProjectStore } from '../../store/useProjectStore'

export default function SourcesList() {
  const { scenes, previewSceneId, addSource } = useProjectStore()
  const previewScene = scenes.find(s => s.id === previewSceneId)

  const handleAddTextSource = () => {
    if (!previewSceneId) return
    addSource(previewSceneId, {
      name: 'Text Source',
      type: 'text',
      visible: true,
      locked: false,
      x: 100,
      y: 100,
      width: 400,
      height: 100,
      rotation: 0,
      zIndex: previewScene?.sources.length || 0,
      properties: {
        type: 'text',
        text: 'Sample Text',
        fontSize: 48,
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: 'transparent',
        textAlign: 'center',
        bold: false,
        italic: false,
      },
    })
  }

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h2 className="text-sm font-semibold">Sources</h2>
        <div className="flex gap-1">
          <button
            onClick={handleAddTextSource}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
          >
            + Text
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {previewScene?.sources && previewScene.sources.length > 0 ? (
          previewScene.sources
            .sort((a, b) => b.zIndex - a.zIndex)
            .map((source) => (
              <div
                key={source.id}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded cursor-pointer"
              >
                <div className="text-sm font-medium">{source.name}</div>
                <div className="text-xs text-slate-400">{source.type}</div>
              </div>
            ))
        ) : (
          <div className="text-center text-slate-600 text-sm mt-4">
            No sources in this scene
          </div>
        )}
      </div>
    </div>
  )
}
