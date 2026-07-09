import { useState } from 'react';
import { WavePreview } from './components/preview/WavePreview';
import { ControlPanel } from './components/controls/ControlPanel';
import { useWaveGenerator } from './hooks/useWaveGenerator';
import { Header } from './components/layout/Header';

function App() {
  const wave = useWaveGenerator();
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      className={`h-screen w-screen flex overflow-hidden font-outfit items-center justify-center p-6 relative transition-colors duration-300 ${isDark ? 'bg-black text-stone-200' : 'bg-[#F1F1F1] text-stone-800'}`}
    >
      {/* Absolute top header with state toggle */}
      <Header isDark={isDark} setIsDark={setIsDark} />

      <div className="w-full max-w-[1110px] flex items-center gap-6 mt-7">
        {/* Left Canvas Panel (Fully fills width, switches background contextually) */}
        <div
          className={`flex-1 flex flex-col justify-between rounded-[8px] shadow-xs relative h-[600px] overflow-hidden p-10 transition-colors duration-300 ${isDark ? 'bg-[#0E141B] border border-neutral-800/80' : 'bg-white'}`}
        >
          <div className="flex justify-between items-start w-full z-10 relative right-2 bottom-5">
            <h1
              className={`text-[30px]  font-semibold tracking-tight transition-colors ${isDark ? 'text-white' : 'text-stone-900'}`}
            >
              Generate SVG Waves
            </h1>
          </div>

          {/* Wave Container: Retains responsive scaling container with absolute anchor lock */}
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]"
            style={{ height: `${wave.height}px`, transition: 'height 0.1s ease-out' }}
          >
            <WavePreview svgCode={wave.svgCode} height={wave.height} />
          </div>
        </div>

        {/* Right Sidebar Control Panel */}
        <ControlPanel {...wave} isDark={isDark} />
      </div>
    </div>
  );
}

export default App;
