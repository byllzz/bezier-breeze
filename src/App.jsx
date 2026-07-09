import { Header } from './components/layout/Header';
import { WavePreview } from './components/preview/WavePreview';
import { ControlPanel } from './components/controls/ControlPanel';
import { useWaveGenerator } from './hooks/useWaveGenerator';

function App() {
  const wave = useWaveGenerator();

  return (
    <div className="h-screen flex flex-col bg-stone-50 text-stone-800 overflow-hidden">
      <Header />
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 p-4 flex items-center justify-center">
          <WavePreview svgCode={wave.svgCode} />
        </div>
        <ControlPanel {...wave} />
      </div>
    </div>
  );
}

export default App;
