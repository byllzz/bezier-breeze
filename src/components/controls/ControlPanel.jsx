import { useState } from 'react';
import {
  Shuffle,
  FlipVertical,
  Play,
  Pause,
  Download,
  Copy,
  PaintBucket,
  Palette,
} from 'lucide-react';
import { Button } from '../ui/Button';

const shapeOptions = ['sine', 'square', 'triangle', 'sawtooth', 'random'];

export function ControlPanel({
  numWaves,
  setNumWaves,
  activeLayerIdx,
  setActiveLayerIdx,
  height,
  setHeight,
  layers,
  updateActiveLayer,
  flipActiveLayer,
  animating,
  toggleAnimation,
  randomizeAll,
  copySVG,
  downloadSVG,
  downloadPNG,
}) {
  const activeLayer = layers[activeLayerIdx];
  const [colorMode, setColorMode] = useState('solid'); // 'solid' or 'gradient'
  const [gradColors, setGradColors] = useState({ start: '#6366f1', end: '#a78bfa' });

  const handleColorChange = color => {
    if (colorMode === 'solid') {
      updateActiveLayer({ color, gradient: null });
    } else {
      updateActiveLayer({
        gradient: {
          stops: [
            { offset: 0, color: gradColors.start },
            { offset: 100, color: gradColors.end },
          ],
        },
      });
    }
  };

  const handleGradientStartChange = c => {
    setGradColors(prev => ({ ...prev, start: c }));
    updateActiveLayer({
      gradient: {
        stops: [
          { offset: 0, color: c },
          { offset: 100, color: gradColors.end },
        ],
      },
    });
  };

  const handleGradientEndChange = c => {
    setGradColors(prev => ({ ...prev, end: c }));
    updateActiveLayer({
      gradient: {
        stops: [
          { offset: 0, color: gradColors.start },
          { offset: 100, color: c },
        ],
      },
    });
  };

  return (
    <div className="w-[300px] min-w-[300px] h-full overflow-y-auto border-l border-stone-200 bg-white p-4 space-y-5">
      {/* Sliders */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-stone-500">Waves ({numWaves})</label>
          <input
            type="range"
            min="1"
            max="5"
            value={numWaves}
            onChange={e => setNumWaves(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-stone-500">
            Layer ({activeLayerIdx + 1}/{numWaves})
          </label>
          <input
            type="range"
            min="0"
            max={numWaves - 1}
            value={activeLayerIdx}
            onChange={e => setActiveLayerIdx(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-stone-500">Height ({height}px)</label>
          <input
            type="range"
            min="200"
            max="800"
            step="10"
            value={height}
            onChange={e => setHeight(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {/* Shape buttons */}
      <div>
        <p className="text-xs font-medium text-stone-500 mb-2">Shape</p>
        <div className="grid grid-cols-5 gap-1.5">
          {shapeOptions.map(shape => (
            <button
              key={shape}
              onClick={() => updateActiveLayer({ shape })}
              className={`py-1.5 text-xs rounded-lg border transition capitalize cursor-pointer
                ${activeLayer.shape === shape ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>

      {/* Flip & Animate */}
      <div className="flex gap-2">
        <button
          onClick={flipActiveLayer}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-medium hover:bg-stone-50 transition w-full justify-center"
        >
          <FlipVertical className="w-4 h-4" /> Flip
        </button>
        <button
          onClick={toggleAnimation}
          className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-medium transition w-full justify-center
            ${animating ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'}`}
        >
          {animating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {animating ? 'Pause' : 'Animate'}
        </button>
      </div>

      {/* Color / Gradient toggle */}
      <div>
        <p className="text-xs font-medium text-stone-500 mb-2">Fill</p>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setColorMode('solid')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition w-full justify-center
              ${colorMode === 'solid' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-stone-600 border-stone-200'}`}
          >
            <PaintBucket className="w-4 h-4" /> Solid
          </button>
          <button
            onClick={() => setColorMode('gradient')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition w-full justify-center
              ${colorMode === 'gradient' ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-stone-600 border-stone-200'}`}
          >
            <Palette className="w-4 h-4" /> Gradient
          </button>
        </div>

        {colorMode === 'solid' ? (
          <input
            type="color"
            value={activeLayer.color}
            onChange={e => handleColorChange(e.target.value)}
            className="w-full h-10 rounded-lg border border-stone-200 cursor-pointer"
          />
        ) : (
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={gradColors.start}
              onChange={e => handleGradientStartChange(e.target.value)}
              className="w-1/2 h-10 rounded-lg border border-stone-200 cursor-pointer"
            />
            <span className="text-xs">to</span>
            <input
              type="color"
              value={gradColors.end}
              onChange={e => handleGradientEndChange(e.target.value)}
              className="w-1/2 h-10 rounded-lg border border-stone-200 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Generate */}
      <button
        onClick={randomizeAll}
        className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition flex items-center justify-center gap-2"
      >
        <Shuffle className="w-4 h-4" /> Generate
      </button>

      {/* Export */}
      <div className="border-t pt-4 space-y-2">
        <p className="text-xs font-medium text-stone-500">Export</p>
        <div className="flex gap-2">
          <Button onClick={downloadSVG} variant="outline" size="sm" className="flex-1">
            SVG
          </Button>
          <Button onClick={downloadPNG} variant="outline" size="sm" className="flex-1">
            PNG
          </Button>
          <Button onClick={copySVG} variant="outline" size="sm">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
