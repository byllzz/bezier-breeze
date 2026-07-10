import { useState } from 'react';

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function StatRow({ label, value, isDark }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className={`text-xs font-medium ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
        {label}
      </span>
      <span
        className={`text-xs font-semibold tabular-nums ${isDark ? 'text-stone-200' : 'text-stone-800'}`}
      >
        {value}
      </span>
    </div>
  );
}

export function DetailsPanel({
  isDark,
  waveIntensity,
  numLayers,
  height,
  width,
  animating,
  layers,
  history,
  svgCode,
}) {
  const [tab, setTab] = useState('stats'); // 'stats' | 'layers' | 'history'

  const svgBytes = new Blob([svgCode]).size;
  const kbSize = (svgBytes / 1024).toFixed(1);

  // Dominant color from first layer
  const topLayer = layers[0];
  const dominantColor = topLayer?.gradient
    ? topLayer.gradient.stops[0].color
    : (topLayer?.color ?? '#f472b6');

  // waveIntensity > 100 ramps frequency
  const estimateCrests = () => {
    if (waveIntensity <= 100) return Math.max(1, Math.round(1.4 * (waveIntensity / 100) * 3));
    const freqExtra = 1 + ((waveIntensity - 100) / 200) * 14;
    return Math.round(1.4 * freqExtra * 2);
  };

  const tabs = ['stats', 'layers', 'history'];

  return (
    <div
      className={`w-[220px] min-w-[220px] h-[600px]  rounded-[8px] flex flex-col overflow-hidden transition-colors duration-300 ${
        isDark
          ? 'bg-[#0E141B] border border-neutral-800/80'
          : 'bg-white border border-stone-100 text-stone-800'
      }`}
    >
      {/* Header */}
      <div
        className={`px-5 pt-5 pb-3 border-b ${isDark ? 'border-neutral-800' : 'border-stone-100'}`}
      >
        <p
          className={`text-[11px] uppercase tracking-widest font-semibold mb-1 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
        >
          Wave Details
        </p>
        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${animating ? 'bg-emerald-400 animate-pulse' : isDark ? 'bg-neutral-600' : 'bg-stone-300'}`}
          />
          <span
            className={`text-[11px] font-medium ${isDark ? 'text-stone-400' : 'text-stone-500'}`}
          >
            {animating ? 'Animating' : 'Static'}
          </span>
          {/* Dominant color swatch */}
          <div
            className="ml-auto w-4 h-4 rounded-sm border border-stone-300/30 shadow-sm"
            style={{ backgroundColor: dominantColor }}
          />
        </div>
      </div>

      {/* Tab bar */}
      <div className={`flex border-b ${isDark ? 'border-neutral-800' : 'border-stone-100'}`}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-[11px] font-semibold capitalize transition-colors cursor-pointer ${
              tab === t
                ? isDark
                  ? 'text-white border-b-2 border-blue-400'
                  : 'text-stone-900 border-b-2 border-stone-800'
                : isDark
                  ? 'text-stone-500 hover:text-stone-300'
                  : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        {tab === 'stats' && (
          <div className="px-5 py-3 space-y-0">
            <div
              className={`text-[10px] uppercase tracking-widest font-semibold mb-2 ${isDark ? 'text-stone-600' : 'text-stone-300'}`}
            >
              Canvas
            </div>
            <StatRow label="Output Res" value="3840 × 2160" isDark={isDark} />
            <StatRow label="Preview W" value={`${width}px`} isDark={isDark} />
            <StatRow label="Wave H" value={`${height}px`} isDark={isDark} />
            <StatRow label="SVG Size" value={`~${kbSize} KB`} isDark={isDark} />

            <div
              className={`text-[10px] uppercase tracking-widest font-semibold mt-4 mb-2 ${isDark ? 'text-stone-600' : 'text-stone-300'}`}
            >
              Waves
            </div>
            <StatRow label="Layers" value={numLayers} isDark={isDark} />
            <StatRow label="Intensity" value={`${waveIntensity}/300`} isDark={isDark} />
            <StatRow label="Est. Crests" value={`~${estimateCrests()}`} isDark={isDark} />
            <StatRow label="Flipped" value={layers[0]?.flipped ? 'Yes' : 'No'} isDark={isDark} />
            <StatRow
              label="Color Mode"
              value={layers[0]?.gradient ? 'Gradient' : 'Solid'}
              isDark={isDark}
            />

            <div
              className={`text-[10px] uppercase tracking-widest font-semibold mt-4 mb-2 ${isDark ? 'text-stone-600' : 'text-stone-300'}`}
            >
              Animation
            </div>
            <StatRow label="Status" value={animating ? '▶ Live' : '◼ Paused'} isDark={isDark} />
            <StatRow label="Bezier Steps" value="400 / layer" isDark={isDark} />
            <StatRow label="Quality" value="4K Ready" isDark={isDark} />
          </div>
        )}

        {tab === 'layers' && (
          <div className="px-4 py-3 space-y-2">
            {layers.map((l, i) => {
              const colorDisplay = l.gradient
                ? `${l.gradient.stops[0].color} → ${l.gradient.stops[1].color}`
                : l.color;
              const isGrad = !!l.gradient;

              return (
                <div
                  key={l.id}
                  className={`rounded-[8px] p-3 ${isDark ? 'bg-[#182635]' : 'bg-stone-50 border border-stone-100'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-semibold ${isDark ? 'text-white' : 'text-stone-800'}`}
                    >
                      Layer {i + 1}
                    </span>
                    {/* Color preview */}
                    <div
                      className="w-5 h-5 rounded-[4px] border border-stone-300/20"
                      style={{
                        background: isGrad
                          ? `linear-gradient(to right, ${l.gradient.stops[0].color}, ${l.gradient.stops[1].color})`
                          : l.color,
                      }}
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex justify-between">
                      <span
                        className={`text-[10px] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
                      >
                        Amp
                      </span>
                      <span
                        className={`text-[10px] tabular-nums ${isDark ? 'text-stone-300' : 'text-stone-700'}`}
                      >
                        {l.baseAmplitude.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`text-[10px] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
                      >
                        Freq
                      </span>
                      <span
                        className={`text-[10px] tabular-nums ${isDark ? 'text-stone-300' : 'text-stone-700'}`}
                      >
                        {l.baseFrequency.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`text-[10px] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
                      >
                        Offset Y
                      </span>
                      <span
                        className={`text-[10px] tabular-nums ${isDark ? 'text-stone-300' : 'text-stone-700'}`}
                      >
                        {(l.offsetY * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`text-[10px] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
                      >
                        Opacity
                      </span>
                      <span
                        className={`text-[10px] tabular-nums ${isDark ? 'text-stone-300' : 'text-stone-700'}`}
                      >
                        {l.opacity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className={`text-[10px] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
                      >
                        Flipped
                      </span>
                      <span
                        className={`text-[10px] tabular-nums ${isDark ? 'text-stone-300' : 'text-stone-700'}`}
                      >
                        {l.flipped ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between items-start pt-1">
                      <span
                        className={`text-[10px] ${isDark ? 'text-stone-500' : 'text-stone-400'}`}
                      >
                        Fill
                      </span>
                      <span
                        className={`text-[10px] tabular-nums text-right ml-2 break-all ${isDark ? 'text-stone-300' : 'text-stone-700'}`}
                        style={{ maxWidth: 100 }}
                      >
                        {isGrad ? 'gradient' : l.color}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'history' && (
          <div className="px-4 py-3">
            {history.length === 0 && (
              <p className={`text-[11px] ${isDark ? 'text-stone-600' : 'text-stone-400'}`}>
                No actions yet.
              </p>
            )}
            <div className="space-y-1">
              {history.map((h, i) => (
                <div
                  key={h.id}
                  className={`flex items-start gap-2 py-1.5 ${i < history.length - 1 ? (isDark ? 'border-b border-neutral-800/50' : 'border-b border-stone-50') : ''}`}
                >
                  <div
                    className={`mt-1 w-1 h-1 rounded-full shrink-0 ${i === 0 ? 'bg-blue-400' : isDark ? 'bg-neutral-600' : 'bg-stone-300'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[11px] font-medium leading-tight ${isDark ? 'text-stone-300' : 'text-stone-700'}`}
                    >
                      {h.action}
                    </p>
                    {h.color && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: h.color }} />
                        <span
                          className={`text-[10px] ${isDark ? 'text-stone-600' : 'text-stone-400'}`}
                        >
                          {h.color}
                        </span>
                      </div>
                    )}
                    {h.style && (
                      <span
                        className={`text-[10px] ${isDark ? 'text-stone-600' : 'text-stone-400'}`}
                      >
                        {h.style}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] shrink-0 ${isDark ? 'text-stone-600' : 'text-stone-400'}`}
                  >
                    {timeAgo(h.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`px-5 py-3 border-t ${isDark ? 'border-neutral-800' : 'border-stone-100'}`}>
        <p className={`text-[10px] ${isDark ? 'text-stone-600' : 'text-stone-400'}`}>
          BézierBreeze · 4K SVG Engine
        </p>
        <p className={`text-[10px] mt-0.5 ${isDark ? 'text-stone-700' : 'text-stone-300'}`}>
          {history.length} action{history.length !== 1 ? 's' : ''} recorded
        </p>
      </div>
    </div>
  );
}
