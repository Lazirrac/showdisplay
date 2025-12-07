import { useProjectStore } from '../../store/useProjectStore'

export default function AudioMixer() {
  const { audioChannels } = useProjectStore()

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h2 className="text-sm font-semibold">Audio Mixer</h2>
      </div>

      <div className="flex-1 p-2">
        {audioChannels.length > 0 ? (
          <div className="flex gap-2">
            {audioChannels.map((channel) => (
              <div key={channel.id} className="flex flex-col items-center gap-2 bg-slate-800 p-2 rounded">
                <span className="text-xs">{channel.name}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={channel.volume}
                  orient="vertical"
                  className="h-32"
                />
                <button className="text-xs px-2 py-1 bg-slate-700 rounded">
                  {channel.muted ? 'Unmute' : 'Mute'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-600 text-sm mt-4">
            No audio sources
          </div>
        )}
      </div>
    </div>
  )
}
