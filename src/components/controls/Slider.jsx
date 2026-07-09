export function Slider({ label, min, max, step, value, onChange, isDark, hasGap }) {
  return (
    <div className={`grid grid-cols-[65px_1fr] items-center ${hasGap ? 'gap-2' : ''}`}>
      <label
        className={`text-sm font-medium transition-colors ${isDark ? 'text-white' : 'text-black'}`}
      >
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        className={`w-full accent-black h-[2px] rounded-lg appearance-none cursor-e-resize transition-colors ${isDark ? 'bg-neutral-400 accent-white' : 'bg-stone-400'}`}
      />
    </div>
  );
}
