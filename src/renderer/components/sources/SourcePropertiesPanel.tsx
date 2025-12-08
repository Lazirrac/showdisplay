import { useProjectStore } from '../../store/useProjectStore'
import type { Source, TextSourceProperties, TimerSourceProperties } from '../../types'

interface SourcePropertiesPanelProps {
  source: Source
  sceneId: string
  onClose: () => void
}

export default function SourcePropertiesPanel({ source, sceneId, onClose }: SourcePropertiesPanelProps) {
  const { updateSource } = useProjectStore()

  const handleUpdate = (updates: Partial<Source>) => {
    updateSource(sceneId, source.id, updates)
  }

  const handlePropertyUpdate = (propertyUpdates: any) => {
    handleUpdate({
      properties: { ...source.properties, ...propertyUpdates }
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-4 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Source Properties</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Common properties */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Name</label>
            <input
              type="text"
              value={source.name}
              onChange={(e) => handleUpdate({ name: e.target.value })}
              className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
            />
          </div>
        </div>

        {/* Type-specific properties */}
        {source.type === 'text' && (
          <TextProperties
            properties={source.properties as TextSourceProperties}
            onUpdate={handlePropertyUpdate}
          />
        )}

        {source.type === 'timer' && (
          <TimerProperties
            properties={source.properties as TimerSourceProperties}
            onUpdate={handlePropertyUpdate}
          />
        )}
      </div>
    </div>
  )
}

// Text Properties Component
function TextProperties({ properties, onUpdate }: {
  properties: TextSourceProperties
  onUpdate: (updates: Partial<TextSourceProperties>) => void
}) {
  const systemFonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 
    'Georgia', 'Verdana', 'Impact', 'Comic Sans MS',
    'Trebuchet MS', 'Arial Black', 'Palatino'
  ]

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-600 pb-1">Text Settings</h4>
      
      <div>
        <label className="block text-xs text-slate-400 mb-1">Text</label>
        <textarea
          value={properties.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="w-full px-2 py-1 bg-slate-700 rounded text-sm h-20 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Font Family</label>
          <select
            value={properties.fontFamily}
            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
            className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
          >
            {systemFonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Font Size</label>
          <input
            type="number"
            value={properties.fontSize}
            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
            className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
            min="8"
            max="200"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Text Color</label>
          <input
            type="color"
            value={properties.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-full h-8 bg-slate-700 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Alignment</label>
          <select
            value={properties.textAlign}
            onChange={(e) => onUpdate({ textAlign: e.target.value as 'left' | 'center' | 'right' })}
            className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Background Color</label>
        <input
          type="color"
          value={properties.backgroundColor}
          onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
          className="w-full h-8 bg-slate-700 rounded cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Background Opacity: {properties.backgroundOpacity}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={properties.backgroundOpacity}
          onChange={(e) => onUpdate({ backgroundOpacity: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={properties.bold}
            onChange={(e) => onUpdate({ bold: e.target.checked })}
            className="rounded"
          />
          Bold
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={properties.italic}
            onChange={(e) => onUpdate({ italic: e.target.checked })}
            className="rounded"
          />
          Italic
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={properties.underline}
            onChange={(e) => onUpdate({ underline: e.target.checked })}
            className="rounded"
          />
          Underline
        </label>
      </div>
    </div>
  )
}

// Timer Properties Component
function TimerProperties({ properties, onUpdate }: {
  properties: TimerSourceProperties
  onUpdate: (updates: Partial<TimerSourceProperties>) => void
}) {
  const systemFonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New',
    'Georgia', 'Verdana', 'Impact', 'Comic Sans MS',
    'Trebuchet MS', 'Arial Black', 'Palatino'
  ]

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60

    if (properties.format === 'HH:MM:SS') {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    } else if (properties.format === 'MM:SS') {
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    } else {
      return String(s).padStart(2, '0')
    }
  }

  const toggleTimer = () => {
    onUpdate({ running: !properties.running })
  }

  const resetTimer = () => {
    onUpdate({ elapsed: 0, running: false })
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-slate-300 border-b border-slate-600 pb-1">Timer Settings</h4>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Mode</label>
        <select
          value={properties.mode}
          onChange={(e) => onUpdate({ mode: e.target.value as 'countdown' | 'countup' | 'clock' })}
          className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
        >
          <option value="countdown">Countdown</option>
          <option value="countup">Count Up</option>
          <option value="clock">Clock</option>
        </select>
      </div>

      {properties.mode === 'countdown' && (
        <div>
          <label className="block text-xs text-slate-400 mb-1">Duration (seconds)</label>
          <input
            type="number"
            value={properties.duration}
            onChange={(e) => onUpdate({ duration: parseInt(e.target.value) })}
            className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
            min="1"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Font Family</label>
          <select
            value={properties.fontFamily}
            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
            className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
          >
            {systemFonts.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Font Size</label>
          <input
            type="number"
            value={properties.fontSize}
            onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
            className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
            min="8"
            max="200"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Format</label>
        <select
          value={properties.format}
          onChange={(e) => onUpdate({ format: e.target.value as 'HH:MM:SS' | 'MM:SS' | 'SS' })}
          className="w-full px-2 py-1 bg-slate-700 rounded text-sm"
        >
          <option value="HH:MM:SS">HH:MM:SS</option>
          <option value="MM:SS">MM:SS</option>
          <option value="SS">SS</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Text Color</label>
          <input
            type="color"
            value={properties.color}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-full h-8 bg-slate-700 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Background Color</label>
          <input
            type="color"
            value={properties.backgroundColor}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="w-full h-8 bg-slate-700 rounded cursor-pointer"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-slate-400 mb-1">Background Opacity: {properties.backgroundOpacity}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={properties.backgroundOpacity}
          onChange={(e) => onUpdate({ backgroundOpacity: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={toggleTimer}
          className={`flex-1 px-3 py-2 rounded text-sm font-semibold ${
            properties.running
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {properties.running ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="flex-1 px-3 py-2 bg-slate-600 hover:bg-slate-700 rounded text-sm font-semibold"
        >
          Reset
        </button>
      </div>

      <div className="p-3 bg-slate-900 rounded text-center">
        <div className="text-xs text-slate-400 mb-1">Preview</div>
        <div
          style={{
            fontFamily: properties.fontFamily,
            fontSize: properties.fontSize / 2,
            color: properties.color,
          }}
          className="font-mono"
        >
          {properties.mode === 'clock'
            ? new Date().toLocaleTimeString()
            : properties.mode === 'countdown'
            ? formatTime(Math.max(0, properties.duration - properties.elapsed))
            : formatTime(properties.elapsed)
          }
        </div>
      </div>
    </div>
  )
}
