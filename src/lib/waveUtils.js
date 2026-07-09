export const WAVE_STYLES = [
  { id: 'gentle', label: 'Gentle', frequency: 1, amplitude: 60 },
  { id: 'rolling', label: 'Rolling', frequency: 2, amplitude: 50 },
  { id: 'choppy', label: 'Choppy', frequency: 3.5, amplitude: 40 },
  { id: 'stacked', label: 'Stacked', frequency: 1.5, amplitude: 70 },
  { id: 'flat', label: 'Flat', frequency: 0.5, amplitude: 25 },
];

// SVG paths for the 5 style buttons
export const WAVE_STYLE_ICONS = {
  gentle: 'M 0 20 C 20 5, 40 35, 60 20 C 80 5, 100 35, 120 20',
  rolling: 'M 0 20 C 15 5, 30 35, 45 20 C 60 5, 75 35, 90 20 C 105 5, 120 35, 135 20',
  choppy: 'M 0 15 L 20 30 L 40 10 L 60 30 L 80 10 L 100 30 L 120 15',
  stacked: 'M 0 25 C 30 5, 60 45, 90 25 C 110 10, 120 30, 130 25',
  flat: 'M 0 20 C 40 15, 80 25, 120 20',
};

export function generateWavePath(width, height, layer) {
  const { amplitude = 50, frequency = 1, phase = 0, offsetY = 0.5, flipped = false } = layer;

  const steps = 120; // more steps = cleaner curve
  const centerY = height * offsetY;
  const points = [];

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const t = (i / steps) * frequency * 2 * Math.PI + phase;
    const raw = Math.sin(t);
    const y = centerY + amplitude * (flipped ? -raw : raw);
    points.push({ x, y });
  }

  // Build smooth bezier path
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpx = (p0.x + p1.x) / 2;
    d += ` C ${cpx.toFixed(2)} ${p0.y.toFixed(2)}, ${cpx.toFixed(2)} ${p1.y.toFixed(2)}, ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  }

  // FIX: Close path to the top if flipped, otherwise close to the bottom
  if (flipped) {
    d += ` L ${width} 0 L 0 0 Z`;
  } else {
    d += ` L ${width} ${height} L 0 ${height} Z`;
  }

  return d;
}

export function generateSVG(width, height, layers, background = null) {
  const paths = [...layers]
    .reverse()
    .map(layer => {
      const d = generateWavePath(width, height, layer);
      const gradId = `grad-${layer.id}`;
      const fill = layer.gradient ? `url(#${gradId})` : layer.color;
      const opacity = layer.opacity ?? 0.85;

      let defs = '';
      if (layer.gradient) {
        const stops = layer.gradient.stops
          .map(s => `<stop offset="${s.offset}%" stop-color="${s.color}" />`)
          .join('');
        defs = `<defs><linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="0%">${stops}</linearGradient></defs>`;
      }

      return `  ${defs}<path d="${d}" fill="${fill}" opacity="${opacity}" />`;
    })
    .join('\n');

  const bgRect = background
    ? `<rect width="${width}" height="${height}" fill="${background}" />`
    : ''; // transparent by default

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" preserveAspectRatio="none">
  ${bgRect}
${paths}
</svg>`;
}
