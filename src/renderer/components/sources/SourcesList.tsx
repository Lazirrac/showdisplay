import { useState } from 'react'
import { useProjectStore } from '../../store/useProjectStore'
import type { Source } from '../../types'
import SourcePropertiesPanel from './SourcePropertiesPanel'
import MediaLibrary from '../library/MediaLibrary'

export default function SourcesList() {
  const { scenes, previewSceneId } = useProjectStore()
  const previewScene = scenes.find(s => s.id === previewSceneId)
  const [selectedSource, setSelectedSource] = useState<Source | null>(null)
  const [activeTab, setActiveTab] = useState<'layers' | 'library'>('layers')

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header flex flex-col gap-2">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-sm font-semibold">Sources/Layers</h2>
          <div className="flex bg-slate-800 rounded p-1 gap-1">
            <button
              onClick={() => setActiveTab('layers')}
              className={`px-2 py-0.5 rounded text-xs ${activeTab === 'layers' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Layers
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`px-2 py-0.5 rounded text-xs ${activeTab === 'library' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Library
            </button>
          </div>
        </div>

        {
          activeTab === 'layers' && (
            <div className="flex gap-1 justify-end w-full">
              {/* Buttons removed, use library drag and drop */}
              <span className="text-xs text-slate-500 italic">Drag items from Library to add</span>
            </div>
          )
        }
      </div >

      <div className="flex-1 overflow-y-auto p-1 bg-slate-900 border-t border-slate-800">
        {activeTab === 'library' ? (
          <MediaLibrary />
        ) : (
          <div className="space-y-1">
            {previewScene?.sources && previewScene.sources.length > 0 ? (
              previewScene.sources
                .sort((a, b) => b.zIndex - a.zIndex)
                .map((source) => (
                  <div
                    key={source.id}
                    onClick={() => setSelectedSource(source)}
                    className={`p-2 rounded cursor-pointer transition-colors ${selectedSource?.id === source.id
                      ? 'bg-blue-600'
                      : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                  >
                    <div className="text-sm font-medium">{source.name}</div>
                    <div className="text-xs text-slate-400">{source.type}</div>
                  </div>
                ))
            ) : (
              <div className="text-center text-slate-600 text-sm mt-4">
                No layers in this scene
              </div>
            )}
          </div>
        )}
      </div>

      {
        activeTab === 'layers' && selectedSource && (
          <SourcePropertiesPanel
            source={selectedSource}
            sceneId={previewSceneId!}
            onClose={() => setSelectedSource(null)}
          />
        )
      }
    </div >
  )
}
