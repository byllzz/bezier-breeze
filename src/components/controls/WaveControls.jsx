// import { Plus, Trash2, Shuffle } from 'lucide-react';
import { Button } from '../ui/Button';

export function WaveControls({
  width,
  setWidth,
  height,
  setHeight,
  background,
  setBackground,
  layers,
  updateLayer,
  addLayer,
  removeLayer,
  randomize,
  copySVG,
  downloadSVG,
}) {
  return (
    <div className="w-72 flex-shrink-0 space-y-4 overflow-y-auto p-4 bg-white border-r border-stone-200">
      <h2 className="text-sm font-semibold text-stone-800">Canvas</h2>
      <div className="space-y-2">
        <label className="text-xs text-stone-500">Width</label>
        <input
          type="number"
          value={width}
          onChange={e => setWidth(Number(e.target.value))}
          className="w-full border border-stone-200 rounded-md px-2 py-1 text-sm"
        />
        <label className="text-xs text-stone-500">Height</label>
        <input
          type="number"
          value={height}
          onChange={e => setHeight(Number(e.target.value))}
          className="w-full border border-stone-200 rounded-md px-2 py-1 text-sm"
        />
        <label className="text-xs text-stone-500">Background</label>
        <input
          type="color"
          value={background}
          onChange={e => setBackground(e.target.value)}
          className="w-full h-8 rounded-md cursor-pointer border border-stone-200"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={randomize} variant="outline" size="sm" className="flex-1">
          {/* <Shuffle className="w-3.5 h-3.5" />  */} Suffle Randomize
        </Button>
      </div>

      <h2 className="text-sm font-semibold text-stone-800 flex items-center justify-between">
        Layers
        <button
          onClick={addLayer}
          className="w-6 h-6 rounded hover:bg-stone-100 flex items-center justify-center"
        >
          {/* <Plus className="w-4 h-4 text-stone-500" /> */} Plus
        </button>
      </h2>

      <div className="space-y-3">
        {layers.map((layer, i) => (
          <div
            key={layer.id}
            className="p-3 rounded-lg border border-stone-200 space-y-2 bg-stone-50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-600">Layer {layers.length - i}</span>
              <button
                onClick={() => removeLayer(layer.id)}
                className="text-stone-400 hover:text-red-500"
              >
                {/* <Trash2 className="w-3.5 h-3.5" /> Trash */}
              </button>
            </div>
            <label className="text-[10px] text-stone-400">Color</label>
            <input
              type="color"
              value={layer.color}
              onChange={e => updateLayer(layer.id, { color: e.target.value })}
              className="w-full h-7 rounded-md cursor-pointer border border-stone-200"
            />
            <label className="text-[10px] text-stone-400">
              Opacity: {layer.opacity.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={layer.opacity}
              onChange={e => updateLayer(layer.id, { opacity: parseFloat(e.target.value) })}
              className="w-full"
            />
            <label className="text-[10px] text-stone-400">Amplitude: {layer.amplitude}</label>
            <input
              type="range"
              min="10"
              max="200"
              value={layer.amplitude}
              onChange={e => updateLayer(layer.id, { amplitude: Number(e.target.value) })}
              className="w-full"
            />
            <label className="text-[10px] text-stone-400">
              Frequency: {layer.frequency.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={layer.frequency}
              onChange={e => updateLayer(layer.id, { frequency: parseFloat(e.target.value) })}
              className="w-full"
            />
            <label className="text-[10px] text-stone-400">Phase: {layer.phase.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max={Math.PI * 2}
              step="0.1"
              value={layer.phase}
              onChange={e => updateLayer(layer.id, { phase: parseFloat(e.target.value) })}
              className="w-full"
            />
            <label className="text-[10px] text-stone-400">
              Offset Y: {layer.offsetY.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={layer.offsetY}
              onChange={e => updateLayer(layer.id, { offsetY: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-stone-200">
        <Button onClick={copySVG} variant="outline" size="sm" className="flex-1">
          Copy SVG
        </Button>
        <Button onClick={downloadSVG} size="sm" className="flex-1">
          Download
        </Button>
      </div>
    </div>
  );
}
