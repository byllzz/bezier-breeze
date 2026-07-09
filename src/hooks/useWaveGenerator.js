import { useState, useCallback, useRef, useEffect } from 'react';
import { generateSVG } from '../lib/waveUtils';

const makeLayer = (i, baseAmp, baseFreq) => {
  // Provide default base amplitude/frequency if not given
  const defaultAmps = [65, 50, 38, 55, 42];
  const defaultFreqs = [1.4, 1.6, 1.2, 1.8, 1.0];
  const idx = i % 5;

  return {
    id: crypto.randomUUID(),
    baseAmplitude: baseAmp ?? defaultAmps[idx],
    baseFrequency: baseFreq ?? defaultFreqs[idx],
    ampSpeed: 0.5 + Math.random() * 0.8, // Increased variance
    freqSpeed: 0.4 + Math.random() * 0.7, // Increased variance
    phaseSpeed: 0.5 + Math.random() * 1.5, // Unique horizontal speed so they separate
    ampPhase: Math.random() * Math.PI * 2,
    freqPhase: Math.random() * Math.PI * 2,
    phase: 0,
    offsetY: 0.58 + i * 0.05,
    color: '#f472b6',
    gradient: {
      stops: [
        { offset: 0, color: '#f472b6' },
        { offset: 100, color: '#93c5fd' },
      ],
    },
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
  const [time, setTime] = useState(0);
  const animFrameRef = useRef(null);

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

  const applyWaveStyle = useCallback(style => {
    setLayers(prev =>
      prev.map((l, i) => ({
        ...l,
        baseFrequency: style.frequency + i * 0.15,
        baseAmplitude: style.amplitude - i * 8,
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
      setTime(t => t + delta);
      // Update each layer's phase (for wave movement) using its unique phaseSpeed
      setLayers(prev =>
        prev.map(l => ({
          ...l,
          phase: l.phase + delta * (l.phaseSpeed + l.baseFrequency * 0.3),
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
        baseAmplitude: Math.floor(Math.random() * 60) + 25 - i * 5,
        baseFrequency: Math.random() * 2.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        offsetY: 0.45 + i * 0.1 + Math.random() * 0.08,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        gradient: null,
        ampSpeed: 0.5 + Math.random() * 0.8,
        freqSpeed: 0.4 + Math.random() * 0.7,
        phaseSpeed: 0.5 + Math.random() * 1.5,
        ampPhase: Math.random() * Math.PI * 2,
        freqPhase: Math.random() * Math.PI * 2,
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

  // Compute current layers with animated amplitude/frequency
  const getAnimatedLayers = useCallback(() => {
    return layers.map(l => {
      // Increased multipliers to make the breathing effect more noticeable
      const ampMod = 1 + 0.45 * Math.sin(time * l.ampSpeed + l.ampPhase);
      const freqMod = 1 + 0.35 * Math.sin(time * l.freqSpeed + l.freqPhase);
      const amplitude = l.baseAmplitude * ampMod * (waveIntensity / 100);
      const frequency = l.baseFrequency * freqMod;
      return {
        ...l,
        amplitude,
        frequency,
      };
    });
  }, [layers, time, waveIntensity]);

  const svgCode = generateSVG(
    width,
    height,
    getAnimatedLayers(),
    null, // background is handled separately during download
  );

  const downloadSVG = useCallback(
    (bgColor = null) => {
      const layersWithBg = getAnimatedLayers();
      const code = generateSVG(width, height, layersWithBg, bgColor);
      const blob = new Blob([code], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bezier-wave.svg';
      a.click();
      URL.revokeObjectURL(url);
    },
    [width, height, getAnimatedLayers],
  );

  const downloadPNG = useCallback(
    (bgColor = null) => {
      const layersWithBg = getAnimatedLayers();
      const code = generateSVG(width, height, layersWithBg, bgColor);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const blob = new Blob([code], { type: 'image/svg+xml' });
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
    },
    [width, height, getAnimatedLayers],
  );

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
    downloadSVG,
    downloadPNG,
  };
}
