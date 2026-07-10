import { useState, useCallback, useRef, useEffect } from 'react';
import { generateSVG } from '../lib/waveUtils';
import { useLocalStorage } from './useLocalStorage';

//  Storage keys
const LS = {
  WIDTH: 'bb:width',
  HEIGHT: 'bb:height',
  BACKGROUND: 'bb:background',
  WAVE_INTENSITY: 'bb:waveIntensity',
  NUM_LAYERS: 'bb:numLayers',
  LAYERS: 'bb:layers',
  HISTORY: 'bb:history',
  IS_DARK: 'bb:isDark',
};

//  Layer factory
const makeLayer = (i, baseAmp, baseFreq) => {
  const defaultAmps = [65, 50, 38, 55, 42];
  const defaultFreqs = [1.4, 1.6, 1.2, 1.8, 1.0];
  const idx = i % 5;

  return {
    id: crypto.randomUUID(),
    baseAmplitude: baseAmp ?? defaultAmps[idx],
    baseFrequency: baseFreq ?? defaultFreqs[idx],
    ampSpeed: 0.5 + Math.random() * 0.8,
    freqSpeed: 0.4 + Math.random() * 0.7,
    phaseSpeed: 0.5 + Math.random() * 1.5,
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

const DEFAULT_LAYERS = Array.from({ length: 1 }, (_, i) => makeLayer(i));
const DEFAULT_HISTORY = [
  {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    action: 'Initialized',
    layers: 1,
    intensity: 70,
    style: 'gentle',
    color: 'gradient',
  },
];

//  Hook
export function useWaveGenerator() {
  // All persisted state via useLocalStorage
  const [width, setWidth] = useLocalStorage(LS.WIDTH, 800);
  const [height, setHeight] = useLocalStorage(LS.HEIGHT, 400);
  const [background, setBackground] = useLocalStorage(LS.BACKGROUND, '#ffffff');
  const [waveIntensity, setWaveIntensity] = useLocalStorage(LS.WAVE_INTENSITY, 70);
  const [numLayers, setNumLayers] = useLocalStorage(LS.NUM_LAYERS, 1);
  const [layers, setLayers] = useLocalStorage(LS.LAYERS, DEFAULT_LAYERS);
  const [history, setHistory] = useLocalStorage(LS.HISTORY, DEFAULT_HISTORY);

  // Transient state
  const [animating, setAnimating] = useState(false);
  const [time, setTime] = useState(0);
  const animFrameRef = useRef(null);

  //  History helper
  const addHistory = useCallback(
    (action, extra = {}) => {
      setHistory(prev => [
        { id: crypto.randomUUID(), timestamp: Date.now(), action, ...extra },
        ...prev.slice(0, 49),
      ]);
    },
    [setHistory],
  );

  //  Layer count
  const setNumLayersSafe = useCallback(
    n => {
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
      addHistory(`Layers → ${count}`, { layers: count });
    },
    [setNumLayers, setLayers, addHistory],
  );

  //  Style presets
  const applyWaveStyle = useCallback(
    style => {
      setLayers(prev =>
        prev.map((l, i) => ({
          ...l,
          baseFrequency: style.frequency + i * 0.15,
          baseAmplitude: style.amplitude - i * 8,
        })),
      );
      addHistory(`Style → ${style.label}`, { style: style.label });
    },
    [setLayers, addHistory],
  );

  //  Flip
  const flipWaves = useCallback(() => {
    setLayers(prev => prev.map(l => ({ ...l, flipped: !l.flipped })));
    addHistory('Flipped waves');
  }, [setLayers, addHistory]);

  //  Animate
  const toggleAnimation = useCallback(() => {
    setAnimating(prev => {
      addHistory(prev ? 'Animation paused' : 'Animation started');
      return !prev;
    });
  }, [addHistory]);

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
      // NOTE: phase is transient - we update layers in memory but do NOT
      // persist phase on every frame.
      // setLayers here intentionally bypasses the LS setter during animation.
      setLayers(prev =>
        prev.map(l => ({ ...l, phase: l.phase + delta * (l.phaseSpeed + l.baseFrequency * 0.3) })),
      );
      animFrameRef.current = requestAnimationFrame(step);
    };
    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animating, setLayers]);

  //  Randomize
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
    const newIntensity = Math.floor(Math.random() * 150) + 40;
    setWaveIntensity(newIntensity);
    addHistory('Randomized all', { intensity: newIntensity });
  }, [setLayers, setWaveIntensity, addHistory]);

  //  Colors
  const updateLayerColor = useCallback(
    color => {
      setLayers(prev => prev.map(l => ({ ...l, color, gradient: null })));
      addHistory('Color changed', { color });
    },
    [setLayers, addHistory],
  );

  const updateLayerGradient = useCallback(
    gradient => {
      setLayers(prev => prev.map(l => ({ ...l, gradient })));
      addHistory('Gradient changed');
    },
    [setLayers, addHistory],
  );

  //  Reset everything
  const resetAll = useCallback(() => {
    setWidth(800);
    setHeight(400);
    setBackground('#ffffff');
    setWaveIntensity(70);
    setNumLayers(1);
    setLayers(Array.from({ length: 1 }, (_, i) => makeLayer(i)));
    setHistory([
      {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        action: 'Reset to defaults',
        layers: 1,
        intensity: 70,
      },
    ]);
    setAnimating(false);
    setTime(0);
  }, [setWidth, setHeight, setBackground, setWaveIntensity, setNumLayers, setLayers, setHistory]);

  //  Animated layer computation
  const getAnimatedLayers = useCallback(() => {
    return layers.map(l => {
      const ampMod = 1 + 0.45 * Math.sin(time * l.ampSpeed + l.ampPhase);
      const freqMod = 1 + 0.35 * Math.sin(time * l.freqSpeed + l.freqPhase);

      let amplitude, frequency;
      if (waveIntensity <= 100) {
        amplitude = l.baseAmplitude * ampMod * (waveIntensity / 100);
        frequency = l.baseFrequency * freqMod;
      } else {
        const freqExtra = 1 + ((waveIntensity - 100) / 200) * 14;
        amplitude = l.baseAmplitude * ampMod * 0.6;
        frequency = l.baseFrequency * freqMod * freqExtra;
      }
      return { ...l, amplitude, frequency };
    });
  }, [layers, time, waveIntensity]);

  const svgCode = generateSVG(width, height, getAnimatedLayers(), null);

  //  Downloads
  const downloadSVG = useCallback(
    (bgColor = null) => {
      const code = generateSVG(width, height, getAnimatedLayers(), bgColor);
      const blob = new Blob([code], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bezier-wave.svg';
      a.click();
      URL.revokeObjectURL(url);
      addHistory('Exported SVG');
    },
    [width, height, getAnimatedLayers, addHistory],
  );

  const downloadPNG = useCallback(
    (bgColor = null) => {
      const code = generateSVG(width, height, getAnimatedLayers(), bgColor);
      const canvas = document.createElement('canvas');
      canvas.width = 3840;
      canvas.height = 2160;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const blob = new Blob([code], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 3840, 2160);
        URL.revokeObjectURL(url);
        canvas.toBlob(pngBlob => {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(pngBlob);
          a.download = 'bezier-wave-4k.png';
          a.click();
        }, 'image/png');
      };
      img.src = url;
      addHistory('Exported PNG (4K)');
    },
    [width, height, getAnimatedLayers, addHistory],
  );

  return {
    // state
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
    animating,
    toggleAnimation,
    history,
    svgCode,
    // actions
    applyWaveStyle,
    flipWaves,
    randomizeAll,
    updateLayerColor,
    updateLayerGradient,
    downloadSVG,
    downloadPNG,
    resetAll,
  };
}
