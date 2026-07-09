import { useState, useCallback, useRef, useEffect } from 'react';
import { generateSVG } from '../lib/waveUtils';

// Each layer gets slightly different amplitude/offsetY so stacking looks natural
const makeLayer = i => {
  const offsets = [0.58, 0.7, 0.8, 0.65, 0.75];
  const amps = [65, 50, 38, 55, 42];
  const freqs = [1.4, 1.6, 1.2, 1.8, 1.0];
  const phases = [0, 1.1, 2.3, 0.6, 1.8];

  const pinkBlue = [
    {
      stops: [
        { offset: 0, color: '#f472b6' },
        { offset: 100, color: '#93c5fd' },
      ],
    },
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

  const idx = i % 5;
  return {
    id: crypto.randomUUID(),
    amplitude: amps[idx],
    frequency: freqs[idx],
    phase: phases[idx],
    offsetY: offsets[idx],
    color: '#f472b6',
    gradient: pinkBlue[idx],
    opacity: 0.85,
    flipped: false,
  };
};

export function useWaveGenerator() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(400);
  const [background, setBackground] = useState('#ffffff');
  const [waveIntensity, setWaveIntensity] = useState(70);
  const [numLayers, setNumLayers] = useState(3);
  const [layers, setLayers] = useState(() => Array.from({ length: 3 }, (_, i) => makeLayer(i)));
  const [animating, setAnimating] = useState(false);
  const animFrameRef = useRef(null);

  // Keep layer count in sync — new layers always use their own index preset
  const setNumLayersSafe = useCallback(n => {
    const count = Math.min(5, Math.max(1, n));
    setNumLayers(count);
    setLayers(prev => {
      if (count > prev.length) {
        const extras = Array.from({ length: count - prev.length }, (_, i) =>
          makeLayer(prev.length + i),
        );
        return [...prev, ...extras];
      }
      return prev.slice(0, count);
    });
  }, []);

  // Apply a wave style preset (frequency + amplitude) to ALL layers, offset per layer
  const applyWaveStyle = useCallback(style => {
    setLayers(prev =>
      prev.map((l, i) => ({
        ...l,
        frequency: style.frequency + i * 0.15,
        amplitude: style.amplitude - i * 8,
      })),
    );
  }, []);

  const flipWaves = useCallback(() => {
    setLayers(prev => prev.map(l => ({ ...l, flipped: !l.flipped })));
  }, []);

  const toggleAnimation = useCallback(() => {
    setAnimating(prev => !prev);
  }, []);

  useEffect(() => {
    if (!animating) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }
    let lastTime = performance.now();
    const step = now => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      // Each layer animates with its own speed based on its frequency
      setLayers(prev =>
        prev.map(l => ({
          ...l,
          phase: l.phase + delta * (1.5 + l.frequency * 0.3),
        })),
      );
      animFrameRef.current = requestAnimationFrame(step);
    };
    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animating]);

  const randomizeAll = useCallback(() => {
    setLayers(prev =>
      prev.map((l, i) => ({
        ...l,
        amplitude: Math.floor(Math.random() * 60) + 25 - i * 5,
        frequency: Math.random() * 2.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        offsetY: 0.45 + i * 0.1 + Math.random() * 0.08,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        gradient: null,
      })),
    );
    setWaveIntensity(Math.floor(Math.random() * 60) + 40);
  }, []);

  const updateLayerColor = useCallback(color => {
    setLayers(prev => prev.map(l => ({ ...l, color, gradient: null })));
  }, []);

  const updateLayerGradient = useCallback(gradient => {
    setLayers(prev => prev.map(l => ({ ...l, gradient })));
  }, []);

  const svgCode = generateSVG(
    width,
    height,
    layers.map(l => ({ ...l, amplitude: l.amplitude * (waveIntensity / 100) })),
    background,
  );

  const copySVG = async () => {
    await navigator.clipboard.writeText(svgCode);
  };

  const downloadSVG = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bezier-wave.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(pngBlob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(pngBlob);
        a.download = 'bezier-wave.png';
        a.click();
      }, 'image/png');
    };
    img.src = url;
  };

  return {
    width,
    setWidth,
    height,
    setHeight,
    background,
    setBackground,
    waveIntensity,
    setWaveIntensity,
    numLayers,
    setNumLayers: setNumLayersSafe,
    layers,
    applyWaveStyle,
    flipWaves,
    animating,
    toggleAnimation,
    randomizeAll,
    updateLayerColor,
    updateLayerGradient,
    svgCode,
    copySVG,
    downloadSVG,
    downloadPNG,
  };
}
