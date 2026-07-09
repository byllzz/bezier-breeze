import { useState, useCallback, useRef, useEffect } from 'react';
import { generateSVG, SHAPES } from '../lib/waveUtils';

const defaultLayer = i => ({
  id: crypto.randomUUID(),
  amplitude: 60,
  frequency: 2,
  phase: 0,
  offsetY: 0.5,
  color: '#6366f1',
  gradient: null,
  shape: 'sine',
  flipped: false,
});

export function useWaveGenerator() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(400);
  const [background, setBackground] = useState('#ffffff');
  const [numWaves, setNumWaves] = useState(3);
  const [activeLayerIdx, setActiveLayerIdx] = useState(0);
  const [layers, setLayers] = useState(() => Array.from({ length: 3 }, (_, i) => defaultLayer(i)));

  const [animating, setAnimating] = useState(false);
  const animFrameRef = useRef(null);

  // keep layer count in sync
  const setNumWavesSafe = useCallback(n => {
    const count = Math.min(5, Math.max(1, n));
    setNumWaves(count);
    setLayers(prev => {
      if (count > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: count - prev.length }, (_, i) => defaultLayer(prev.length + i)),
        ];
      } else if (count < prev.length) {
        return prev.slice(0, count);
      }
      return prev;
    });
    setActiveLayerIdx(prev => Math.min(prev, count - 1));
  }, []);

  const updateActiveLayer = useCallback(
    changes => {
      setLayers(prev => prev.map((l, i) => (i === activeLayerIdx ? { ...l, ...changes } : l)));
    },
    [activeLayerIdx],
  );

  const flipActiveLayer = useCallback(() => {
    updateActiveLayer({ flipped: !layers[activeLayerIdx]?.flipped });
  }, [activeLayerIdx, layers, updateActiveLayer]);

  const toggleAnimation = useCallback(() => {
    setAnimating(prev => !prev);
  }, []);

  // animation loop
  useEffect(() => {
    if (!animating) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }
    let lastTime = performance.now();
    const step = now => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setLayers(prev =>
        prev.map(l => ({
          ...l,
          phase: l.phase + delta * 2, // smooth phase shift
        })),
      );
      animFrameRef.current = requestAnimationFrame(step);
    };
    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animating]);

  const randomizeAll = useCallback(() => {
    setLayers(prev =>
      prev.map(l => ({
        ...l,
        amplitude: Math.floor(Math.random() * 80) + 20,
        frequency: Math.random() * 3 + 0.5,
        phase: Math.random() * Math.PI * 2,
        offsetY: Math.random() * 0.6 + 0.2,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        gradient: null,
      })),
    );
  }, []);

  const svgCode = generateSVG(width, height, layers, background);

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
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
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
    numWaves,
    setNumWaves: setNumWavesSafe,
    activeLayerIdx,
    setActiveLayerIdx,
    layers,
    updateActiveLayer,
    flipActiveLayer,
    animating,
    toggleAnimation,
    randomizeAll,
    svgCode,
    copySVG,
    downloadSVG,
    downloadPNG,
  };
}
