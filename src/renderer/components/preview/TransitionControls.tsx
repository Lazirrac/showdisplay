import { useProjectStore } from '../../store/useProjectStore'

export default function TransitionControls() {
  const { transition, performTransition, setTransition } = useProjectStore()

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
        onClick={performTransition}
        className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded font-bold text-lg transition-colors"
      >
        GO LIVE
      </button>
    </div>
  )
}
