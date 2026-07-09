export function StyleButton({ style, activeStyle, handleStyleClick, isDark }) {
  return (
    <button
      onClick={() => handleStyleClick(style)}
      className={`flex items-center justify-center px-2 rounded-[9px] transition-all h-8 cursor-pointer
        ${
          activeStyle === style.id
            ? isDark
              ? ' bg-[#182635] '
              : 'bg-stone-200'
            : isDark
              ? 'border-2 border-stone-600'
              : 'bg-white border-2 border-stone-200'
        }`}
    >
      <svg
        viewBox="0 0 40 20"
        className={`w-full h-full fill-none transition-colors ${isDark ? 'stroke-stone-300' : 'stroke-stone-700'}`}
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        {style.id === 'gentle' && <path d="M4 10 C 12 4, 18 16, 26 10 C 32 4, 36 10, 38 10" />}
        {style.id === 'rolling' && <path d="M4 14 L 12 6 L 20 14 L 28 6 L 36 14" />}
        {style.id === 'choppy' && <path d="M4 12 L 10 6 L 18 14 L 24 6 L 30 14 L 36 10" />}
        {style.id === 'stacked' && <path d="M6 8 C 14 8, 20 4, 34 4 M6 14 C 14 14, 20 10, 34 10" />}
        {style.id === 'flat' && <path d="M4 8 C 14 12, 26 12, 36 8" />}
      </svg>
    </button>
  );
}
