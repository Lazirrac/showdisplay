import { useProjectStore } from './store/useProjectStore'
import SceneList from './components/scenes/SceneList'
import PreviewPanel from './components/preview/PreviewPanel'
import ProgramPanel from './components/preview/ProgramPanel'
import SourcesList from './components/sources/SourcesList'
import AudioMixer from './components/mixer/AudioMixer'
import TransitionControls from './components/preview/TransitionControls'

export default function App() {
  const { scenes, currentSceneId, previewSceneId } = useProjectStore()

  return (
    <div className="h-screen flex flex-col overflow-hidden p-2 gap-2 bg-slate-950">
      {/* Top Section: Preview and Program */}
      <div className="flex gap-2 h-[50%]">
        {/* Preview */}
        <div className="flex-1">
          <PreviewPanel />
        </div>

        {/* Program */}
        <div className="flex-1">
          <ProgramPanel />
        </div>
      </div>

      {/* Bottom Section: Scenes, Sources, Mixer */}
      <div className="flex gap-2 h-[50%]">
        {/* Scenes */}
        <div className="w-64 flex flex-col">
          <SceneList />
        </div>

        {/* Sources */}
        <div className="flex-1 flex flex-col">
          <SourcesList />
        </div>

        {/* Audio Mixer */}
        <div className="w-80 flex flex-col">
          <AudioMixer />
        </div>
      </div>

      {/* Transition Controls - Fixed Bottom */}
      <div className="h-20 shrink-0">
        <TransitionControls />
      </div>
    </div>
  )
}
