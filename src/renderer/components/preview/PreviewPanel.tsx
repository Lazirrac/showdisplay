import { useProjectStore } from '../../store/useProjectStore'

export default function PreviewPanel() {
  const { scenes, previewSceneId } = useProjectStore()
  const previewScene = scenes.find(s => s.id === previewSceneId)

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h2 className="text-sm font-semibold">Preview</h2>
        <span className="text-xs text-slate-400">{previewScene?.name || 'No scene selected'}</span>
      </div>

      <div className="flex-1 bg-black flex items-center justify-center relative">
        {previewScene && previewScene.sources.length > 0 ? (
          <div className="text-slate-500 text-sm">Canvas Preview (Work in Progress)</div>
        ) : (
          <div className="text-slate-600 text-sm">No sources in scene</div>
        )}
      </div>
    </div>
  )
}
