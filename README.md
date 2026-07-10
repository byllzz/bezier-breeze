<p align="center">
  <img src="./public/favicon.svg" width="120" alt="BézierBreeze Logo" />
</p>

<h1 align="center">BézierBreeze</h1>

<p align="center">
  A smooth, 4K-ready SVG wave generator built with React.<br />
  Create layered, customizable wave backgrounds using cubic Bézier curves.<br />
  Adjust intensity, layers, shapes, colors, and gradients - then export at full 4K resolution as SVG or PNG.
</p>

<p align="center">
  <a href="https://bezierbreeze.vercel.app">
    <img src="https://img.shields.io/badge/%20Try%20-BézierBreeze-6366f1?style=for-the-badge" alt="Try BézierBreeze" />
  </a>
</p>

<p align="center">
  <img src="./public/previewLight.png" width="100%" alt="BézierBreeze Light Mode" />
  <img src="./public/previewDark.png" width="100%" alt="BézierBreeze Dark Mode" />
</p>

---

## What is BézierBreeze?

**BézierBreeze** is a free, open-source SVG wave generator built with React. It uses smooth cubic Bézier curves (400 steps per layer) to create silky, crisp wave patterns rendered at a 3840×2160 internal coordinate space - meaning every export is 4K-ready regardless of your screen size.

Adjust wave intensity (0–300), number of layers, and canvas height with simple sliders. Choose from five wave style presets, flip layers vertically, and animate waves live. Fill with solid colors or gradients and export as SVG or 4K PNG. Your entire session - sliders, colors, layers, theme - is automatically saved to localStorage and restored on your next visit.

No sign-ups, no ads, no servers - everything runs directly in your browser.

---

## Features

### Wave Controls

**Wave Intensity (0–300)**
A single slider controls overall waviness across three zones:
- `0–100` - amplitude scales from flat to full height
- `100–300` - frequency ramps from 1× up to 15×, producing 30+ visible crests at maximum

**Multiple Layers (1–5)**
Add up to 5 independent wave layers, each with its own amplitude, frequency, phase speed, vertical offset, color, and flip state.

**Height Control**
Resize the SVG canvas height (200–800 px) smoothly without affecting the surrounding layout.

**Five Wave Style Presets**
- Gentle - long, low-frequency swells
- Rolling - medium double-crest rhythm
- Choppy - tight angular peaks
- Stacked - wide-amplitude layered look
- Flat - near-horizon subtle curve

**Flip**
Toggle all layers vertically to mirror the wave direction - useful for bottom-aligned or inverted designs.

**Animate**
Real-time phase animation with per-layer independent phase, amplitude, and frequency breathing speeds. Each layer moves at its own rate so they organically separate over time.

**Randomize (Generate)**
One click randomizes all layer amplitudes, frequencies, phases, vertical offsets, colors, and wave intensity simultaneously.

---

### Color & Gradient

**Solid Color**
Eight pink/lavender presets, a full color picker, and a random hex generator.

**Linear Gradient**
Four two-stop gradient presets plus a random gradient generator. Gradients are baked into the SVG as `<linearGradient>` defs so they export perfectly.

---

### Details Panel (left sidebar)

A live data panel with three tabs:

**Stats tab**
- Output resolution (always 3840×2160)
- Preview width and wave height
- Estimated SVG file size
- Layer count, intensity value, estimated visible crests
- Flip state, color mode, animation status
- Bézier step count and quality badge

**Layers tab**
Per-layer breakdown showing base amplitude, base frequency, vertical offset percentage, opacity, flip state, and fill color or gradient for every active layer - updates live as you adjust controls.

**History tab**
A timestamped action log (up to 50 entries) recording every change: style presets, color changes, layer count adjustments, flips, randomizes, and exports. Each entry shows a relative timestamp (e.g. "just now", "3m ago").

---

### Export

**SVG** - downloads a vector file with the full 3840×2160 viewBox. Scales to any size without quality loss.

**PNG 4K** - renders to an off-screen `<canvas>` at 3840×2160 and exports a lossless PNG.

Both formats support two modes:
- **With Background** - fills the background with the current theme color (white in light mode, `#0E141B` in dark)
- **Transparent** - no background rect, just the waves

---

### Persistence (localStorage)

Every setting is automatically saved to `localStorage` under a `bb:` namespace and restored on your next visit - no manual save required.

| Key | What it stores |
|---|---|
| `bb:width` | Canvas width |
| `bb:height` | Canvas height |
| `bb:waveIntensity` | Wave slider value |
| `bb:numLayers` | Layer count |
| `bb:layers` | Full layer config (amp, freq, color, gradient, etc.) |
| `bb:history` | Action history log |
| `bb:background` | Background color |
| `bb:isDark` | Light / dark theme preference |

Writes are debounced (300 ms) so rapid slider drags don't hammer storage. Cross-tab sync is supported via the native `storage` event. Animation phase is intentionally not persisted - it resets on load, which is the correct behavior.

**Reset** - the "↺ Reset to defaults & clear saved state" button in the control panel wipes all wave state back to a single default layer. Theme preference is preserved across resets since it's a UI setting, not wave state.

---

### Theme

Full light and dark mode with a toggle in the header. Your preference is saved to `localStorage` (`bb:isDark`) and applied instantly on every future visit.

---

## How It Works

For each layer, 400 evenly-spaced points are calculated along the x-axis using a sine function with the layer's current frequency, amplitude, and phase. These points are connected with cubic Bézier curves (using midpoint control points) to produce a smooth, continuous path. The path is closed to the bottom (or top if flipped) of the canvas, filled with the selected color or gradient, and composed with other layers in reverse z-order.

All geometry is computed in a 3840×2160 internal coordinate space. The SVG uses `viewBox="0 0 3840 2160"` with `preserveAspectRatio="none"` and `width="100%" height="100%"` so it scales perfectly to any container without pixel rounding artifacts.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI and state |
| Tailwind CSS v4 | Styling |
| Vite 6 | Build tool and dev server |
| Lucide React | Icons |
| Custom Bézier math | Wave generation and SVG output |
| `useLocalStorage` hook | Debounced, cross-tab persistent state |

---

## Project Structure

```
src/
├── App.jsx                          # Root layout (3-column: Details | Canvas | Controls)
├── hooks/
│   ├── useWaveGenerator.js          # All wave state, actions, and SVG generation
│   └── useLocalStorage.js           # Generic debounced localStorage hook
├── lib/
│   └── waveUtils.js                 # generateWavePath, generateSVG, WAVE_STYLES
└── components/
    ├── layout/
    │   ├── Header.jsx               # Logo, theme toggle, social links
    │   └── DetailsPanel.jsx         # Stats / Layers / History tabs
    ├── controls/
    │   ├── ControlPanel.jsx         # Right sidebar with all controls
    │   ├── Slider.jsx               # Reusable range slider
    │   ├── StyleButton.jsx          # Wave preset button with inline SVG icon
    │   ├── ColorPickerPopover.jsx   # Solid color picker
    │   ├── GradientPickerPopover.jsx# Gradient picker
    │   └── DownloadDropdown.jsx     # SVG / PNG export with bg options
    └── preview/
        └── WavePreview.jsx          # Renders SVG string into the canvas area
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm (or yarn / pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/byllzz/bezier-breeze.git

# Navigate to the project directory
cd bezier-breeze

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`.

---

<p align="center">
  Made with 💜 using React, Tailwind CSS, and a little math.<br />
  <strong>Let your backgrounds flow. 🌊</strong>
</p>
<p align="center">© 2026 BézierBreeze - Open Source MIT</p>
