import { useState } from 'react';
import { WAVE_STYLES } from '../../lib/waveUtils';

export function ControlPanel({
  waveIntensity,
  setWaveIntensity,
  numLayers,
  setNumLayers,
  height,
  setHeight,
  applyWaveStyle,
  flipWaves,
  animating,
  toggleAnimation,
  randomizeAll,
  updateLayerColor,
  updateLayerGradient,
  downloadSVG,
  downloadPNG,
  isDark,
}) {
  const [colorMode, setColorMode] = useState('gradient');
  const [activeStyle, setActiveStyle] = useState('gentle');

  const handleStyleClick = style => {
    setActiveStyle(style.id);
    applyWaveStyle(style);
  };

  return (
    <div
      className={`w-[280px] min-w-[300px] h-[615px] relative top-2 rounded-[8px] scrollbar-none flex flex-col justify-between overflow-y-auto transition-colors duration-300 ${isDark ? 'bg-[#0E141B] border border-neutral-800/80' : 'bg-white border-l border-stone-100 text-stone-800'}`}
    >
      <div className="space-y-6 px-10 pt-8">
        {/* Master Sliders Layout */}
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-[65px_1fr] items-center">
            <label
              className={`text-sm font-medium transition-colors ${isDark ? 'text-white' : 'text-black'}`}
            >
              Waves
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={waveIntensity}
              onChange={e => setWaveIntensity(parseInt(e.target.value))}
              className={`w-full accent-black h-[2px] rounded-lg appearance-none cursor-e-resize transition-colors ${isDark ? 'bg-neutral-400  accent-white' : 'bg-stone-400'}`}
            />
          </div>
          <div className="grid grid-cols-[65px_1fr] items-center">
            <label
              className={`text-sm font-medium transition-colors ${isDark ? 'text-white' : 'text-black'}`}
            >
              Layers
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={numLayers}
              onChange={e => setNumLayers(parseInt(e.target.value))}
              className={`w-full accent-black h-[2px] rounded-lg appearance-none cursor-e-resize transition-colors ${isDark ? 'bg-neutral-400  accent-white' : 'bg-stone-400'}`}
            />
          </div>
          <div className="grid grid-cols-[65px_1fr] items-center gap-2">
            <label
              className={`text-sm font-medium transition-colors ${isDark ? 'text-white' : 'text-black'}`}
            >
              Height
            </label>
            <input
              type="range"
              min="200"
              max="800"
              step="10"
              value={height}
              onChange={e => setHeight(parseInt(e.target.value))}
              className={`w-full accent-black h-[2px] rounded-lg appearance-none cursor-e-resize transition-colors ${isDark ? 'bg-neutral-400  accent-white' : 'bg-stone-400'}`}
            />
          </div>
        </div>

        {/* Wave Style Presets Grid */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {WAVE_STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => handleStyleClick(style)}
              className={`flex items-center justify-center px-2 border-2 rounded-[9px] transition-all h-8 cursor-pointer
                ${
                  activeStyle === style.id
                    ? isDark
                      ? 'border-stone-600 bg-white/20 border-none text-white'
                      : 'bg-stone-200 border-none'
                    : isDark
                      ? 'border-stone-600 text-white'
                      : 'bg-white border-stone-200 hover:bg-stone-200'
                }`}
            >
              <svg
                viewBox="0 0 40 20"
                className={`w-full h-full fill-none transition-colors ${isDark ? 'stroke-stone-300' : 'stroke-stone-700'}`}
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                {style.id === 'gentle' && (
                  <path d="M4 10 C 12 4, 18 16, 26 10 C 32 4, 36 10, 38 10" />
                )}
                {style.id === 'rolling' && <path d="M4 14 L 12 6 L 20 14 L 28 6 L 36 14" />}
                {style.id === 'choppy' && <path d="M4 12 L 10 6 L 18 14 L 24 6 L 30 14 L 36 10" />}
                {style.id === 'stacked' && (
                  <path d="M6 8 C 14 8, 20 4, 34 4 M6 14 C 14 14, 20 10, 34 10" />
                )}
                {style.id === 'flat' && <path d="M4 8 C 14 12, 26 12, 36 8" />}
              </svg>
            </button>
          ))}
        </div>

        {/* Flip & Animate Action Row */}
        <div className="flex gap-3">
          <button
            onClick={flipWaves}
            className={`flex-1 flex items-center justify-center gap-3 px-4 py-1.5 border-2 rounded-[7px] text-[15px] font-semibold transition cursor-pointer ${
              isDark
                ? 'bg-white border-none text-black hover:bg-white/90'
                : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
            }`}
          >
            Flip
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlns:svgjs="http://svgjs.com/svgjs"
              width="512"
              height="512"
              x="0"
              y="0"
              viewBox="0 0 16 16"
              xmlSpace="preserve"
              class="h-4 w-4 dark:text-white flipdown"
            >
              <g transform="matrix(0.8999999999999999,0,0,0.9,0.8000000000000007,0.7499999999999964)">
                <link type="text/css" rel="stylesheet" id="dark-mode-custom-link"></link>
                <link type="text/css" rel="stylesheet" id="dark-mode-general-link"></link>
                <style lang="en" type="text/css" id="dark-mode-custom-style"></style>
                <style lang="en" type="text/css" id="dark-mode-native-style"></style>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  d="M1 0l5 6 4.9-6z"
                  data-original="currentColor"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  d="M5.9 9l-4.9 6h10l-5.1-6zM3.1 14l2.8-3.4 3 3.4h-5.8z"
                  data-original="currentColor"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  d="M10 7h1v1h-1v-1z"
                  data-original="currentColor"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  d="M12 7h1v1h-1v-1z"
                  data-original="currentColor"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  d="M8 7h1v1h-1v-1z"
                  data-original="currentColor"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  d="M6 7h1v1h-1v-1z"
                  data-original="currentColor"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  d="M4 7h1v1h-1v-1z"
                  data-original="currentColor"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  d="M2 7h1v1h-1v-1z"
                  data-original="currentColor"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  d="M0 7h1v1h-1v-1z"
                  data-original="currentColor"
                ></path>
                <path
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  d="M15 7.5v0c0 1.3-0.7 2.6-1.9 3.6l-1.1-1.1v3h3l-1.2-1.2c1.4-1.2 2.2-2.7 2.2-4.3 0 0 0 0 0 0 0-1.9-1-3.6-2.9-4.9l-0.6 0.8c1.6 1.1 2.5 2.5 2.5 4.1z"
                  data-original="currentColor"
                ></path>
              </g>
            </svg>
          </button>
          <button
            onClick={toggleAnimation}
            className={`flex-1 flex items-center justify-center gap-3 px-4 py-1.5 border-2 rounded-[7px] text-[14px] font-semibold transition  cursor-pointer ${
              isDark
                ? 'bg-white border-none text-black hover:bg-white/90'
                : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
            }`}
          >
            Animate
            <svg
              width="18"
              height="10"
              viewBox="0 0 18 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4.97549C2.33333 1.97549 5.9 -2.22451 9.5 4.97549C13.1 12.1755 16.3333 7.97549 17.5 4.97549"
                stroke="currentColor"
              ></path>
            </svg>
          </button>
        </div>

        {/* Color Mode Option Grid */}
        <div
          className={`flex gap-4 justify-center pb-2.5 ${isDark ? 'border-neutral-800' : 'border-stone-50'}`}
        >
          <button
            onClick={() => {
              setColorMode('solid');
              updateLayerColor('#f472b6');
            }}
            className={`flex flex-col items-center py-4   rounded-[10px] w-25 transition-all cursor-pointer ${colorMode === 'solid' ? (isDark ? 'bg-[#182635]' : 'bg-[#eef2f6]') : isDark ? 'hover:bg-neutral-900/40' : 'hover:bg-stone-50'}`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-500 mb-2 border border-stone-200/40 shadow-sm" />
            <span
              className={`text-[14px] font-semibold ${colorMode === 'solid' ? (isDark ? 'text-white' : 'text-stone-900') : 'text-stone-500'}`}
            >
              Color
            </span>
          </button>

          <button
            onClick={() => {
              setColorMode('gradient');
              updateLayerGradient({
                stops: [
                  { offset: 0, color: '#f472b6' },
                  { offset: 100, color: '#93c5fd' },
                ],
              });
            }}
            className={`flex flex-col items-center py-4 rounded-[10px] w-25 transition-all cursor-pointer ${colorMode === 'gradient' ? (isDark ? 'bg-[#182635]' : 'bg-[#eef2f6]') : isDark ? 'hover:bg-neutral-900/40' : 'hover:bg-stone-50'}`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 via-purple-300 to-blue-400 mb-2 border border-stone-200/40 shadow-sm" />
            <span
              className={`text-[14px] font-semibold ${colorMode === 'gradient' ? (isDark ? 'text-white' : 'text-stone-900') : 'text-stone-500'}`}
            >
              Gradient
            </span>
          </button>
        </div>

        {/* Main Generate Action Button */}
        <button
          onClick={randomizeAll}
          className={`w-full py-3 px-3 rounded-[8px] text-sm font-medium transition-all flex items-center justify-center gap-3 shadow-md group relative bottom-3 cursor-pointer ${
            isDark
              ? 'bg-[#182635] text-white hover:bg-neutral-800 border border-neutral-700/80'
              : 'bg-black text-white hover:bg-stone-900'
          }`}
        >
          <span className="font-medium tracking-tight text-[16px]">Generate</span>
          <svg
            className="w-5 h-5 group-hover:rotate-45 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Export Section with Colorful Background Gradient */}
      <div
        className={`rounded-[8px] relative h-[150px] p-4 space-y-10 shadow-inner transition-all duration-300 bg-gradient-to-br from-cyan-200 via-blue-200 to-indigo-200 ${
          isDark ? 'opacity-90' : ''
        }`}
      >
        {/* Animated gradient overlay for extra life */}
        <div
          className={`absolute inset-0 rounded-[8px] bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse pointer-events-none`}
        ></div>

        <p className={`text-[14px] relative top-2 font-bold tracking-wide text-black!`}>Export</p>
        <div className="flex gap-3  relative z-10">
          <button
            onClick={downloadSVG}
            className={`flex-1 py-2 border-none rounded-[5px] text-[14px] font-bold shadow-lg transition-all duration-200 active:scale-95 cursor-pointer bg-white/80 backdrop-blur-sm hover:bg-white text-purple-800 border-2  hover:border-purple-400`}
          >
            SVG
          </button>
          <button
            onClick={downloadPNG}
            className={`flex-1 py-2 border-none rounded-[5px] text-[14px] font-bold shadow-lg transition-all duration-200 active:scale-95 cursor-pointer bg-white/80 backdrop-blur-sm hover:bg-white text-purple-800 border-2  hover:border-purple-400`}
          >
            PNG
          </button>
        </div>
      </div>
    </div>
  );
}
