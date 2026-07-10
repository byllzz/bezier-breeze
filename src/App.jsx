import { WavePreview } from './components/preview/WavePreview';
import { ControlPanel } from './components/controls/ControlPanel';
import { DetailsPanel } from './components/details/DetailsPanel';
import { useWaveGenerator } from './hooks/useWaveGenerator';
import { Header } from './components/layout/Header';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const wave = useWaveGenerator();
  const [isDark, setIsDark] = useLocalStorage('bb:isDark', false);

  return (
    <div
      className={`h-screen w-screen flex overflow-hidden font-outfit items-center justify-center p-6 relative transition-colors duration-300 ${isDark ? 'bg-black text-stone-200' : 'bg-[#F1F1F1] text-stone-800'}`}
    >
      <Header isDark={isDark} setIsDark={setIsDark} />

      {/*  DetailsPanel | Wave Canvas | ControlPanel */}
      <div className="w-full max-w-[1440px] flex items-center gap-4 mt-7">
        {/* Left Details Panel */}
        <DetailsPanel
          isDark={isDark}
          waveIntensity={wave.waveIntensity}
          numLayers={wave.numLayers}
          height={wave.height}
          width={wave.width}
          animating={wave.animating}
          layers={wave.layers}
          history={wave.history}
          svgCode={wave.svgCode}
        />

        {/* Centre Canvas Panel */}
        <div
          className={`flex-1 flex flex-col justify-between rounded-[8px] shadow-xs relative h-[600px] overflow-hidden p-10 transition-colors duration-300 ${isDark ? 'bg-[#0E141B]' : 'bg-white'}`}
        >
          <div className="flex justify-between items-start w-full z-10 relative right-2 bottom-5">
            <h1
              className={`text-[30px] font-semibold tracking-tight transition-colors ${isDark ? 'text-white' : 'text-stone-900'}`}
            >
              Generate SVG Waves
            </h1>
          </div>

          {/* Wave preview  */}
          <div
            className="absolute inset-x-0 bottom-0 overflow-hidden leading-[0]"
            style={{
              height: `${wave.height}px`,
              transition: 'height 0.2s ease-out',
            }}
          >
            <WavePreview svgCode={wave.svgCode} height={wave.height} />
          </div>
        </div>

        {/* Right Sidebar Control Panel */}
        <ControlPanel {...wave} isDark={isDark} resetAll={wave.resetAll} />
      </div>
    </div>
  );
}

export default App;
