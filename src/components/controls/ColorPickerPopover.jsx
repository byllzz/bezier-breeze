const PRESET_COLORS = [
  '#f472b6',
  '#fb7185',
  '#fda4af',
  '#f9a8d4',
  '#a5b4fc',
  '#93c5fd',
  '#bfdbfe',
  '#c7d2fe',
];

export function ColorPickerPopover({
  colorRef,
  colorMode,
  colorPopoverOpen,
  setColorPopoverOpen,
  setGradientPopoverOpen,
  updateLayerColor,
  setColorMode,
  isDark,
}) {
  return (
    <div ref={colorRef} className="relative">
      <button
        onClick={() => {
          setColorPopoverOpen(!colorPopoverOpen);
          setGradientPopoverOpen(false);
        }}
        className={`flex flex-col items-center py-4 rounded-[10px] w-25 transition-all cursor-pointer ${colorMode === 'solid' ? (isDark ? 'bg-[#182635]' : 'bg-[#eef2f6]') : isDark ? 'hover:bg-neutral-900/40' : 'hover:bg-stone-50'}`}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-500 mb-2 border border-stone-200/40 shadow-sm" />
        <span
          className={`text-[14px] font-semibold ${colorMode === 'solid' ? (isDark ? 'text-white' : 'text-stone-900') : 'text-stone-500'}`}
        >
          Color
        </span>
      </button>

      {colorPopoverOpen && (
        <div
          className={`absolute -right-5  v-24 px-4 py-2  rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 z-20 w-40 ${isDark ? 'border-stone-600 bg-[#182635]' : 'bg-white borde-stone-200'}`}
        >
          <div className="grid grid-cols-4 gap-2">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => {
                  updateLayerColor(c);
                  setColorMode('solid');
                  setColorPopoverOpen(false);
                }}
                className="w-5 h-5 rounded-[5px] border border-neutral-300 dark:border-neutral-600 hover:scale-105 transition cursor-pointer"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <input
              type="color"
              value="#f472b6"
              onChange={e => {
                updateLayerColor(e.target.value);
                setColorMode('solid');
                setColorPopoverOpen(false);
              }}
              className="w-10 h-10 p-0 border-0 rounded cursor-pointer"
            />
            <button
              onClick={e => {
                e.stopPropagation();
                const randomHex =
                  '#' +
                  Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, '0');
                updateLayerColor(randomHex);
                setColorMode('solid');
              }}
              className="flex-1 py-1.5 text-sm font-medium bg-stone-100 text-black! rounded-md hover:bg-stone-200 transition cursor-pointer"
            >
              Random
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
