const PRESET_GRADIENTS = [
  {
    stops: [
      { offset: 0, color: '#fb7185' },
      { offset: 100, color: '#a5b4fc' },
    ],
  },
  {
    stops: [
      { offset: 0, color: '#fda4af' },
      { offset: 100, color: '#bfdbfe' },
    ],
  },
  {
    stops: [
      { offset: 0, color: '#f9a8d4' },
      { offset: 100, color: '#c7d2fe' },
    ],
  },
  {
    stops: [
      { offset: 0, color: '#fecdd3' },
      { offset: 100, color: '#ddd6fe' },
    ],
  },
];

export function GradientPickerPopover({
  gradientRef,
  colorMode,
  gradientPopoverOpen,
  setGradientPopoverOpen,
  setColorPopoverOpen,
  updateLayerGradient,
  setColorMode,
  isDark,
}) {
  return (
    <div ref={gradientRef} className="relative">
      <button
        onClick={() => {
          setGradientPopoverOpen(!gradientPopoverOpen);
          setColorPopoverOpen(false);
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

      {gradientPopoverOpen && (
        <div
          className={`absolute -right-10 mt-1.5  w-40 p-4 dark:bg-[#1a2330] rounded-lg shadow-xl border  z-20 ${isDark ? 'border-stone-600 bg-[#182635]' : 'bg-white borde-stone-200'}`}
        >
          <div className="grid grid-cols-2 gap-2">
            {PRESET_GRADIENTS.map((grad, idx) => (
              <button
                key={idx}
                onClick={() => {
                  updateLayerGradient(grad);
                  setColorMode('gradient');
                  setGradientPopoverOpen(false);
                }}
                className="w-full h-7 rounded-[5px] border border-neutral-300 dark:border-neutral-600 hover:scale-105 transition cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${grad.stops[0].color}, ${grad.stops[1].color})`,
                }}
              />
            ))}
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              const g = {
                stops: [
                  { offset: 0, color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)` },
                  { offset: 100, color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)` },
                ],
              };
              updateLayerGradient(g);
              setColorMode('gradient');
            }}
            className="w-full mt-3 py-1.5 text-sm font-medium bg-stone-100 text-black! rounded-md hover:bg-stone-200 dark:hover:bg-neutral-600 transition cursor-pointer"
          >
            Random Gradient
          </button>
        </div>
      )}
    </div>
  );
}
