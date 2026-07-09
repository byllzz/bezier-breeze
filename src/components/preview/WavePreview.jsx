export function WavePreview({ svgCode, height }) {
  return (
    <div className="w-full h-full overflow-hidden bg-transparent">
      <div
        className="w-full h-full block"
        style={{ lineHeight: 0 }}
        dangerouslySetInnerHTML={{ __html: svgCode }}
      />
    </div>
  );
}
