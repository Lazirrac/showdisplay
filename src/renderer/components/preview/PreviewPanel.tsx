import { useProjectStore } from '../../store/useProjectStore'
import SourceRenderer from './SourceRenderer'

export default function PreviewPanel() {
  const { scenes, previewSceneId, addSource } = useProjectStore()
  const previewScene = scenes.find(s => s.id === previewSceneId)

  // Scale to fit in preview (assuming 1920x1080 canvas scaled to fit)
  const canvasWidth = 1920
  const canvasHeight = 1080
  const containerAspect = 16 / 9

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h2 className="text-sm font-semibold">Preview</h2>
        <span className="text-xs text-slate-400">{previewScene?.name || 'No scene selected'}</span>
      </div>

      <div
        className="flex-1 bg-black flex items-center justify-center relative overflow-hidden"
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        }}
        onDrop={async (e) => {
          e.preventDefault()
          if (!previewScene) return

          try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'))

            if (data.type === 'MEDIA_FILE') {
              const file = data.file

              // Calculate path relative to canvas
              const rect = e.currentTarget.getBoundingClientRect()
              // Assume centered canvas inside container
              // For simplicity, just center it or use simple relative coords for now
              // Ideally we'd map screen coords to canvas internal 1920x1080 coords

              const properties: any = {}
              if (file.type === 'image') {
                properties.type = 'image'
                properties.src = `file://${file.path.replace(/\\/g, '/')}`
              } else if (file.type === 'video') {
                properties.type = 'video'
                properties.src = `file://${file.path.replace(/\\/g, '/')}`
                properties.loop = false
                properties.volume = 100
                properties.muted = false
              } else if (file.type === 'audio') {
                properties.type = 'audio'
                properties.src = `file://${file.path.replace(/\\/g, '/')}`
                properties.loop = false
                properties.volume = 100
              }

              // Add to Zustand store for immediate UI update
              addSource(previewScene.id, {
                name: file.name,
                type: file.type,
                visible: true,
                locked: false,
                x: 100,
                y: 100,
                width: 400,
                height: 300,
                rotation: 0,
                zIndex: previewScene.sources.length,
                opacity: 1,
                volume: 100,
                isMuted: false,
                startMs: 0,
                endMs: 0,
                properties
              })

              // TODO: Save to database in background (scene IDs need to be mapped to numeric DB IDs)
              // if (window.electron) {
              //   window.electron.sceneSourcesCreate(...)
              // }
            } else if (data.type === 'TEXT_SOURCE') {
              addSource(previewScene.id, {
                name: 'Text Source',
                type: 'text',
                visible: true,
                locked: false,
                x: 100,
                y: 100,
                width: 400,
                height: 100,
                rotation: 0,
                zIndex: previewScene.sources.length,
                opacity: 1,
                volume: 100,
                isMuted: false,
                startMs: 0,
                endMs: 0,
                properties: {
                  type: 'text',
                  text: 'New Text',
                  fontSize: 48,
                  fontFamily: 'Arial',
                  color: '#ffffff',
                  backgroundColor: '#000000',
                  backgroundOpacity: 0,
                  textAlign: 'center',
                  bold: false,
                  italic: false,
                  underline: false,
                }
              })
            } else if (data.type === 'TIMER_SOURCE') {
              addSource(previewScene.id, {
                name: 'Timer',
                type: 'timer',
                visible: true,
                locked: false,
                x: 100,
                y: 100,
                width: 400,
                height: 100,
                rotation: 0,
                zIndex: previewScene.sources.length,
                opacity: 1,
                volume: 100,
                isMuted: false,
                startMs: 0,
                endMs: 0,
                properties: {
                  type: 'timer',
                  mode: 'countdown',
                  duration: 300,
                  running: false,
                  elapsed: 0,
                  fontSize: 64,
                  fontFamily: 'Arial',
                  color: '#ffffff',
                  backgroundColor: '#000000',
                  backgroundOpacity: 0,
                  format: 'MM:SS',
                }
              })
            }
            // Refresh scene to show new source (assuming app refreshes on store update or event)
            // Since we don't have automatic store sync yet, we might need to manually trigger refresh
            // For now, let's assume the user might switch scenes to refresh or we add a hook
          } catch (err) {
            console.error('Drop error', err)
          }
        }}
      >
        {previewScene && previewScene.sources.length > 0 ? (
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
              {previewScene.sources
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((source) => (
                  <SourceRenderer
                    key={source.id}
                    source={source}
                    scale={1}
                    isPreview={true}
                    onUpdate={(updates) => {
                      const { updateSource } = useProjectStore.getState()
                      updateSource(previewScene.id, source.id, updates)
                    }}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="text-slate-600 text-sm">No sources in scene</div>
        )}
      </div>
    </div>
  )
}
