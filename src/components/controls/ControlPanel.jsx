import { useState, useRef, useEffect } from 'react';
import { WAVE_STYLES } from '../../lib/waveUtils';
import { Slider } from './Slider';
import { StyleButton } from './StyleButton';
import { ColorPickerPopover } from './ColorPickerPopover';
import { GradientPickerPopover } from './GradientPickerPopover';
import { DownloadDropdown } from './DownloadDropdown';

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
  resetAll,
  isDark,
}) {
  const [colorMode, setColorMode] = useState('gradient');
  const [activeStyle, setActiveStyle] = useState('gentle');

  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [gradientPopoverOpen, setGradientPopoverOpen] = useState(false);
  const [svgDownloadOpen, setSvgDownloadOpen] = useState(false);
  const [pngDownloadOpen, setPngDownloadOpen] = useState(false);

  const colorRef = useRef(null);
  const gradientRef = useRef(null);
  const svgRef = useRef(null);
  const pngRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (colorRef.current && !colorRef.current.contains(event.target)) setColorPopoverOpen(false);
      if (gradientRef.current && !gradientRef.current.contains(event.target))
        setGradientPopoverOpen(false);
      if (svgRef.current && !svgRef.current.contains(event.target)) setSvgDownloadOpen(false);
      if (pngRef.current && !pngRef.current.contains(event.target)) setPngDownloadOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStyleClick = style => {
    setActiveStyle(style.id);
    applyWaveStyle(style);
  };

  const getBackgroundColor = () => (isDark ? '#0E141B' : '#ffffff');

  return (
    <div
      className={`w-[280px] min-w-[300px] h-[615px] relative top-2 rounded-[8px] scrollbar-none flex overflow-hidden flex-col justify-between transition-colors duration-300 ${isDark ? 'bg-[#0E141B]' : 'bg-white border-l border-stone-100 text-stone-800'}`}
    >
      <div className="space-y-6 px-10 pt-8">
        {/* Master Sliders */}
        <div className="space-y-4 pt-4">
          {/* Waves slider: 0–300  */}
          <Slider
            label="Waves"
            min="0"
            max="300"
            value={waveIntensity}
            onChange={setWaveIntensity}
            isDark={isDark}
          />
          <Slider
            label="Layers"
            min="1"
            max="5"
            value={numLayers}
            onChange={setNumLayers}
            isDark={isDark}
          />
          <Slider
            label="Height"
            min="200"
            max="800"
            step="10"
            value={height}
            onChange={setHeight}
            isDark={isDark}
            hasGap={true}
          />
        </div>

        {/* Wave Style Presets */}
        <div className="grid grid-cols-5 gap-2 pt-2">
          {WAVE_STYLES.map(style => (
            <StyleButton
              key={style.id}
              style={style}
              activeStyle={activeStyle}
              handleStyleClick={handleStyleClick}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Flip & Animate */}
        <div className="flex gap-3">
          <button
            onClick={flipWaves}
            className={`flex-1 flex items-center justify-center gap-3 px-4 py-1.5 border-2 rounded-[7px] text-[15px] font-semibold transition cursor-pointer group ${
              isDark
                ? 'bg-[#182635] border-none text-white'
                : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
            }`}
          >
            Flip
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="512"
              height="512"
              viewBox="0 0 16 16"
              className="h-4 w-4"
            >
              <g transform="matrix(0.8999999999999999,0,0,0.9,0.8000000000000007,0.7499999999999964)">
                <path fill="currentColor" d="M1 0l5 6 4.9-6z" />
                <path fill="currentColor" d="M5.9 9l-4.9 6h10l-5.1-6zM3.1 14l2.8-3.4 3 3.4h-5.8z" />
                <path fill="currentColor" d="M10 7h1v1h-1v-1z" />
                <path fill="currentColor" d="M12 7h1v1h-1v-1z" />
                <path fill="currentColor" d="M8 7h1v1h-1v-1z" />
                <path fill="currentColor" d="M6 7h1v1h-1v-1z" />
                <path fill="currentColor" d="M4 7h1v1h-1v-1z" />
                <path fill="currentColor" d="M2 7h1v1h-1v-1z" />
                <path fill="currentColor" d="M0 7h1v1h-1v-1z" />
                <path
                  fill="currentColor"
                  d="M15 7.5v0c0 1.3-0.7 2.6-1.9 3.6l-1.1-1.1v3h3l-1.2-1.2c1.4-1.2 2.2-2.7 2.2-4.3 0 0 0 0 0 0 0-1.9-1-3.6-2.9-4.9l-0.6 0.8c1.6 1.1 2.5 2.5 2.5 4.1z"
                />
              </g>
            </svg>
          </button>

          <button
            onClick={toggleAnimation}
            className={`flex-1 flex items-center justify-center gap-3 px-4 py-1.5 border-2 rounded-[7px] text-[14px] font-semibold transition cursor-pointer ${
              isDark
                ? 'bg-[#182635] border-none text-white'
                : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
            }`}
          >
            {animating ? 'Pause' : 'Animate'}
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
              />
            </svg>
          </button>
        </div>

        {/* Color Mode */}
        <div className={`flex gap-4 justify-center pb-2.5`}>
          <ColorPickerPopover
            colorRef={colorRef}
            colorMode={colorMode}
            colorPopoverOpen={colorPopoverOpen}
            setColorPopoverOpen={setColorPopoverOpen}
            setGradientPopoverOpen={setGradientPopoverOpen}
            updateLayerColor={updateLayerColor}
            setColorMode={setColorMode}
            isDark={isDark}
          />
          <GradientPickerPopover
            gradientRef={gradientRef}
            colorMode={colorMode}
            gradientPopoverOpen={gradientPopoverOpen}
            setGradientPopoverOpen={setGradientPopoverOpen}
            setColorPopoverOpen={setColorPopoverOpen}
            updateLayerGradient={updateLayerGradient}
            setColorMode={setColorMode}
            isDark={isDark}
          />
        </div>

        {/* Generate Button */}
        <div className="relative bottom-3 space-y-2">
          <button
            onClick={randomizeAll}
            className={`w-full py-3 px-3 rounded-[8px] text-sm font-medium transition-all flex items-center justify-center gap-3 shadow-md group cursor-pointer ${
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
          <button
            onClick={resetAll}
            className={`w-full py-1.5 text-[11px] font-medium rounded-[6px] transition-colors cursor-pointer ${
              isDark ? 'text-stone-600 hover:text-stone-400' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            ↺ Reset to defaults &amp; clear saved state
          </button>
        </div>
      </div>

      {/* Export Section */}
      <div
        className={`rounded-[8px] relative h-[150px] p-4 space-y-4 shadow-inner transition-all duration-300 bg-gradient-to-br from-cyan-200 via-blue-200 to-indigo-200`}
      >
        <div
          className={`absolute inset-0 rounded-[8px] bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse pointer-events-none`}
        />
        <p className={`text-[14px]  font-medium tracking-wide text-black!`}>Download/Export</p>
        <div className="grid grid-cols-2 gap-3 relative z-10 px-1">
          <DownloadDropdown
            dropdownRef={svgRef}
            label="SVG"
            isOpen={svgDownloadOpen}
            setIsOpen={setSvgDownloadOpen}
            setOtherOpen={setPngDownloadOpen}
            onDownload={withBg => downloadSVG(withBg ? getBackgroundColor() : null)}
          />
          <DownloadDropdown
            dropdownRef={pngRef}
            label="PNG 4K"
            isOpen={pngDownloadOpen}
            setIsOpen={setPngDownloadOpen}
            setOtherOpen={setSvgDownloadOpen}
            onDownload={withBg => downloadPNG(withBg ? getBackgroundColor() : null)}
          />
        </div>
      </div>
    </div>
  );
}
