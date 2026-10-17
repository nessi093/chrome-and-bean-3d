# CHROME & BEAN | 3D Architectural Cafe Experience

> Interactive, photorealistic 3D architectural experience of **CHROME & BEAN: Roastery & Bar (Est. 2026, 24/7 ONLINE)** built with Three.js, React 19, TypeScript, and Tailwind CSS.

![Three.js](https://img.shields.io/badge/Three.js-r160+-black?style=flat-square&logo=three.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6+-646CFF?style=flat-square&logo=vite)

---

## 🏛️ Project Overview

**CHROME & BEAN** is a high-end specialty coffee roastery, coworking space, and evening bar. This interactive 3D model was procedurally engineered from architectural renders and floor plans, featuring:

- **Photorealistic PBR Rendering**: Studio PBR lighting (`ACESFilmicToneMapping`), zero-dependency environment reflection via `RoomEnvironment` & `PMREMGenerator`, warm key light paired with cool fill, and contact grounding shadows.
- **Architectural Facade**: Charcoal fluted brutalist concrete, upper dark brick masonry volume, floor-to-ceiling glass curtain walls, glowing neon *"24/7 • ONLINE"* pill sign, and backlit polished chrome lettering.
- **Walk-Up Takeaway Window**: Street-facing order counter with POS terminal and paper cups.
- **Outdoor Terrace**: Granite cobblestone paving, black retractable awning, Edison bulb garland string lights, wire mesh dining sets, and **commercial glass pyramid patio gas heaters with dancing flames**.
- **Central Espresso Bar Island**: Monolithic brushed stainless steel counter with custom chrome La Marzocco Linea multi-group machine, Acaia Lunar scales, latte art crema, Mahlkönig grinders, barista steaming pitchers, under-counter illuminated cooler, and suspended steel frame with warm 3200K LED halo.
- **Roastery Lab & Green Bean Cellar (18°C)**: Industrial Probat drum roaster with motorized rotating cooling agitator arms, digital rate-of-rise (RoR) touch screen, cyclone chaff separator, Euro-pallets with stenciled burlap coffee sacks, digital climate monitor (`18.2°C • 58% RH`), and quality-control cupping bench.
- **Communal Coworking Workbench**: 9-meter solid smoked oak table with flush aluminum AC/USB power grommets, MacBooks with live code/CAD displays, ceramic mugs with latte art, Moleskine notebooks, and 7 suspended brushed chrome dome pendants.
- **Evening Lounge & Dining**: Modular deep charcoal sectional sofas, candlelit dining tables with wine glasses and napkins, and lush potted Monstera & Ficus greenery.
- **Commercial Open Kitchen**: Food-grade stainless line, 4-burner gas range with blue flame, deep exhaust hood, stacked porcelain plates, magnetic wall knife strip with chef knives, and stainless floor trench drain grates.
- **Executive Restroom / WC**: Dark graphite walls with cove lighting, 3 private cubicles with LED occupancy indicators, floating concrete vanity, round vessel basins, and halo-backlit mirrors.

---

## 🕹️ Interactive Features

1. **Cinematic Auto-Tour**: Automated smooth glide across all 11 zones of the cafe.
2. **Architectural Cutaway Mode**: Toggle between the full building volume with roof/brick facade and the orthogonal floor plan cutaway.
3. **4 Atmospheric Lighting Scenarios**:
   - **Dusk (Сумерки)**: Signature golden hour sunset with warm interior glow.
   - **Day (Дневной)**: Bright daylight streaming through panoramic glass.
   - **Night (Ночь)**: High-contrast ambient spots and candlelit mood.
   - **Cyber Neon (Неон)**: Futuristic cyan/pink illumination.
4. **Procedural Web Audio Engine**: Synthesizes atmospheric cafe room hum and espresso machine steam release (`9 BAR`) with 0 external sound files.
5. **High-Res Screenshot Capture**: Instant PNG export of any camera angle.
6. **Agitator Speed Slider**: Control roaster cooling blade rotation in real time.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/chrome-and-bean-3d.git

# Navigate to the project directory
cd chrome-and-bean-3d

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to explore the 3D cafe.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

- **Three.js (r160+)**: WebGL 3D rendering, procedural geometries, PBR materials, OrbitControls.
- **React 19 & TypeScript**: UI state, collapsible bottom dock, and zone specification modal.
- **Tailwind CSS**: Modern Apple-style dark glassmorphism styling.
- **Lucide Icons**: Crisp SVG icons.
- **Web Audio API**: Procedural sound generation without 404s.

---

## 📄 License

MIT License. Designed and engineered for **CHROME & BEAN (Est. 2026)**.
