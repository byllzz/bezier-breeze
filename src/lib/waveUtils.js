export const SHAPES = ['sine', 'square', 'triangle', 'sawtooth', 'random'];

function shapePoints(width, height, layer) {
  const {
    amplitude = 50,
    frequency = 1,
    phase = 0,
    offsetY = 0.5,
    shape = 'sine',
    flipped = false,
  } = layer;
  const points = [];
  const steps = 80;
  const step = width / steps;
  const centerY = height * offsetY;

  for (let i = 0; i <= steps; i++) {
    const x = i * step;
    let raw = 0;
    const t = (x / width) * frequency * 2 * Math.PI + phase;

    switch (shape) {
      case 'sine':
        raw = Math.sin(t);
        break;
      case 'square':
        raw = Math.sin(t) >= 0 ? 1 : -1;
        break;
      case 'triangle':
        raw = (2 / Math.PI) * Math.asin(Math.sin(t));
        break;
      case 'sawtooth':
        raw = 2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5));
        break;
      default:
        raw = Math.sin(t);
    }

    const y = centerY + amplitude * (flipped ? -raw : raw);
    points.push({ x, y });
  }
  return points;
}

export function generateWavePath(width, height, layer) {
  const pts = shapePoints(width, height, layer);
  let d = `M ${pts[0].x} ${pts[0].y}`;
  const segStep = width / 40; // use fewer control points for smooth bezier
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p3 = pts[i + 1];
    const cp1x = p0.x + segStep / 3;
    const cp1y = p0.y;
    const cp2x = p3.x - segStep / 3;
    const cp2y = p3.y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p3.x} ${p3.y}`;
  }
  d += ` L ${width} ${height} L 0 ${height} Z`;
  return d;
}

export function generateSVG(width, height, layers, background) {
  const paths = [...layers]
    .reverse()
    .map(layer => {
      const d = generateWavePath(width, height, layer);
      const fill = layer.gradient ? `url(#grad-${layer.id})` : layer.color;
      const opacity = layer.opacity ?? 0.8;
      let defs = '';
      if (layer.gradient) {
        defs = `<defs><linearGradient id="grad-${layer.id}" x1="0%" y1="0%" x2="0%" y2="100%">${layer.gradient.stops.map(s => `<stop offset="${s.offset}%" stop-color="${s.color}" />`).join('')}</linearGradient></defs>`;
      }
      return `${defs}<path d="${d}" fill="${fill}" opacity="${opacity}" />`;
    })
    .join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="${background}" />
  ${paths}
</svg>`;
}
