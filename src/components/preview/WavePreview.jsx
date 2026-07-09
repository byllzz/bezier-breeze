export function WavePreview({ svgCode }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-stone-100 rounded-xl border border-stone-200 overflow-hidden">
      <div
        className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
        dangerouslySetInnerHTML={{ __html: svgCode }}
      />
    </div>
  );
}
