export function WavePreview({ svgCode, height }) {
  return (
    <div
      className="w-full overflow-hidden"
      style={{ height: `${height}px`, display: 'block', lineHeight: 0, fontSize: 0 }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          lineHeight: 0,
          fontSize: 0,
        }}
        dangerouslySetInnerHTML={{ __html: svgCode }}
      />
    </div>
  );
}
