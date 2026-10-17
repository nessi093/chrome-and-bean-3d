import * as THREE from 'three';

// Cache procedural textures to avoid duplicate canvas operations
const textureCache = new Map<string, THREE.Texture>();

function getOrCreateTexture(key: string, generator: () => THREE.Texture): THREE.Texture {
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }
  const texture = generator();
  textureCache.set(key, texture);
  return texture;
}

/**
 * Procedural Brushed Stainless Steel Roughness / Bump map
 */
export function getBrushedMetalTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('brushed_metal', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base neutral fill
    ctx.fillStyle = '#888888';
    ctx.fillRect(0, 0, 512, 512);

    // Fine directional brushed streaks
    for (let i = 0; i < 2400; i++) {
      const y = Math.random() * 512;
      const x = Math.random() * 512;
      const length = 40 + Math.random() * 120;
      const alpha = 0.04 + Math.random() * 0.08;
      const brightness = Math.random() > 0.5 ? 255 : 0;

      ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha})`;
      ctx.fillRect(x, y, length, 1 + Math.random() * 1.5);
      // Wrap around horizontally for seamless tiling
      if (x + length > 512) {
        ctx.fillRect(0, y, (x + length) - 512, 1 + Math.random() * 1.5);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Fluted / Reeded Glass normal bump texture
 */
export function getFlutedGlassTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('fluted_glass', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    const ribs = 32;
    const ribWidth = 256 / ribs;

    for (let i = 0; i < ribs; i++) {
      const grad = ctx.createLinearGradient(i * ribWidth, 0, (i + 1) * ribWidth, 0);
      grad.addColorStop(0, '#555555');
      grad.addColorStop(0.5, '#ffffff');
      grad.addColorStop(1, '#555555');
      ctx.fillStyle = grad;
      ctx.fillRect(i * ribWidth, 0, ribWidth, 256);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 1);
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Dark Architectural Concrete (Charcoal brutalist stucco)
 */
export function getConcreteTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('concrete_charcoal', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Dark charcoal base
    ctx.fillStyle = '#222326';
    ctx.fillRect(0, 0, 512, 512);

    // Stippling and trowel marks
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 24;
      const baseVal = 34 + noise;
      data[i] = Math.min(255, Math.max(0, baseVal));
      data[i + 1] = Math.min(255, Math.max(0, baseVal + 1));
      data[i + 2] = Math.min(255, Math.max(0, baseVal + 3));
    }
    ctx.putImageData(imgData, 0, 0);

    // Soft concrete formwork blemishes
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 20 + Math.random() * 60;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(15, 16, 18, 0.25)');
      grad.addColorStop(1, 'rgba(15, 16, 18, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Smoked Dark Oak Wood Grain
 */
export function getSmokedOakTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('smoked_oak', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Very dark warm brown/black wood base
    ctx.fillStyle = '#1c1815';
    ctx.fillRect(0, 0, 512, 512);

    // Wood rings / longitudinal streaks
    for (let y = 0; y < 512; y++) {
      const wave = Math.sin(y * 0.05) * 8 + Math.sin(y * 0.12) * 4;
      const val = Math.sin(y * 0.2 + wave) * 15;
      const colorVal = Math.floor(28 + val + (Math.random() - 0.5) * 8);
      ctx.fillStyle = `rgb(${colorVal + 4}, ${colorVal}, ${Math.max(12, colorVal - 4)})`;
      ctx.fillRect(0, y, 512, 1);
    }

    // Wood pores
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      ctx.fillStyle = 'rgba(10, 8, 7, 0.4)';
      ctx.fillRect(x, y, 15 + Math.random() * 30, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Cobblestone / Paver Blocks for Outdoor Terrace
 */
export function getCobblestoneTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('cobblestone', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Dark grey mortar base
    ctx.fillStyle = '#2a2c30';
    ctx.fillRect(0, 0, 512, 512);

    // Paver block dimensions (running bond pattern)
    const blockH = 16;
    const blockW = 32;

    for (let row = 0; row < 512 / blockH; row++) {
      const offsetX = (row % 2 === 0) ? 0 : blockW / 2;
      for (let col = -1; col < 512 / blockW + 1; col++) {
        const x = col * blockW + offsetX;
        const y = row * blockH;

        // Subtle variation per stone
        const tone = 70 + Math.floor((Math.random() - 0.5) * 24);
        ctx.fillStyle = `rgb(${tone - 4}, ${tone}, ${tone + 4})`;
        // Beveled edges leaving mortar gaps
        ctx.fillRect(x + 1.5, y + 1.5, blockW - 3, blockH - 3);

        // Micro texture on stone face
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(x + 2, y + 2, (blockW - 4) * 0.7, 2);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Burlap Coffee Sack Texture with Stencil
 */
export function getBurlapSackTexture(label = 'CHROME & BEAN'): THREE.CanvasTexture {
  return getOrCreateTexture(`burlap_${label}`, () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Jute sack brown base
    ctx.fillStyle = '#a89476';
    ctx.fillRect(0, 0, 512, 512);

    // Burlap cross-weave pattern
    for (let x = 0; x < 512; x += 4) {
      ctx.fillStyle = (x % 8 === 0) ? 'rgba(120, 100, 75, 0.35)' : 'rgba(200, 185, 155, 0.25)';
      ctx.fillRect(x, 0, 2, 512);
    }
    for (let y = 0; y < 512; y += 4) {
      ctx.fillStyle = (y % 8 === 0) ? 'rgba(120, 100, 75, 0.35)' : 'rgba(200, 185, 155, 0.25)';
      ctx.fillRect(0, y, 512, 2);
    }

    // Vintage Stencil Stamp
    ctx.save();
    ctx.translate(256, 256);
    ctx.rotate(-0.04);
    ctx.fillStyle = 'rgba(40, 30, 22, 0.85)';
    ctx.textAlign = 'center';

    // Stencil borders
    ctx.strokeStyle = 'rgba(40, 30, 22, 0.75)';
    ctx.lineWidth = 3;
    ctx.strokeRect(-180, -140, 360, 280);
    ctx.strokeRect(-172, -132, 344, 264);

    ctx.font = 'bold 24px monospace';
    ctx.fillText('ORIGIN: SPECIALTY GRADE', 0, -90);

    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(label, 0, -40);

    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('EST. 2026 • ROASTERY', 0, 0);

    ctx.font = 'bold 22px monospace';
    ctx.fillText('LOT: CB-8849 / 60 KG', 0, 45);

    ctx.font = 'bold 20px monospace';
    ctx.fillText('STORE AT 18°C / HUMIDITY 60%', 0, 85);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Neon Sign Texture ("24/7 • ONLINE")
 */
export function getNeonSignTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('neon_24_7', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Black background
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, 512, 128);

    // Glowing Pill border
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = '#40e0d0'; // Cyan/white neon glow
    ctx.shadowBlur = 18;

    // Rounded rectangle pill
    const r = 32;
    const x = 30, y = 20, w = 452, h = 88;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.stroke();

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('24/7 • ONLINE', 256, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Metal Logo Sign ("CHROME & BEAN")
 */
export function getChromeSignTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('chrome_sign', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#18191b';
    ctx.fillRect(0, 0, 512, 256);

    // Brushed metal gradient for lettering
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#f0f3f6');
    grad.addColorStop(0.3, '#ffffff');
    grad.addColorStop(0.5, '#adb5bd');
    grad.addColorStop(0.8, '#dee2e6');
    grad.addColorStop(1, '#6c757d');

    ctx.fillStyle = grad;
    ctx.textAlign = 'left';
    ctx.font = 'bold 58px "Space Grotesk", sans-serif';
    ctx.fillText('CHROME', 40, 95);
    ctx.fillText('& BEAN', 40, 165);

    ctx.fillStyle = '#adb5bd';
    ctx.font = '600 20px "Space Grotesk", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('ROASTERY & BAR', 42, 215);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Laptop Screen Display (Code, Trading / Roast Curve charts, Figma UI)
 */
export function getLaptopScreenTexture(type: 'code' | 'chart' | 'cad' = 'code'): THREE.CanvasTexture {
  return getOrCreateTexture(`laptop_${type}`, () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    // Dark IDE background
    ctx.fillStyle = '#1e1e24';
    ctx.fillRect(0, 0, 512, 320);

    // Window top bar
    ctx.fillStyle = '#2b2b36';
    ctx.fillRect(0, 0, 512, 28);
    ctx.fillStyle = '#ff5f56';
    ctx.beginPath();
    ctx.arc(16, 14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath();
    ctx.arc(32, 14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#27c93f';
    ctx.beginPath();
    ctx.arc(48, 14, 5, 0, Math.PI * 2);
    ctx.fill();

    if (type === 'code') {
      // Code lines
      const colors = ['#61afef', '#e06c75', '#98c379', '#d19a66', '#c678dd', '#abb2bf'];
      for (let y = 44; y < 300; y += 14) {
        const indent = (y % 40 === 0) ? 20 : (y % 28 === 0) ? 60 : 40;
        let curX = indent;
        while (curX < 460) {
          const w = 18 + Math.random() * 55;
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          ctx.fillRect(curX, y, w, 7);
          curX += w + 8;
        }
      }
    } else if (type === 'chart') {
      // Roaster Rate of Rise (RoR) Temperature Curve graph
      ctx.fillStyle = '#16161a';
      ctx.fillRect(20, 44, 472, 256);
      ctx.strokeStyle = '#333340';
      for (let x = 20; x < 490; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 44); ctx.lineTo(x, 300); ctx.stroke();
      }
      for (let y = 44; y < 300; y += 40) {
        ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(492, y); ctx.stroke();
      }
      // Green Bean Temp Curve (Yellow)
      ctx.strokeStyle = '#e5c07b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(30, 240);
      ctx.bezierCurveTo(120, 280, 280, 160, 480, 80);
      ctx.stroke();

      // RoR Curve (Cyan)
      ctx.strokeStyle = '#56b6c2';
      ctx.beginPath();
      ctx.moveTo(30, 100);
      ctx.bezierCurveTo(140, 70, 300, 210, 480, 240);
      ctx.stroke();

      ctx.fillStyle = '#abb2bf';
      ctx.font = '12px monospace';
      ctx.fillText('ROAST PROFILE: ETHIOPIA YIRGACHEFFE #4', 35, 65);
      ctx.fillText('TEMP: 204.5°C | RoR: 8.2°C/min | DEV: 14.2%', 35, 82);
    } else {
      // Figma / UI layout
      ctx.fillStyle = '#252530';
      ctx.fillRect(15, 38, 120, 270);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(160, 50, 320, 240);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(180, 70, 280, 100);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(180, 190, 80, 30);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Pressure Gauge Dial Texture for espresso machine & roaster
 */
export function getGaugeDialTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('gauge_dial', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Metal bezel ring
    ctx.fillStyle = '#e5e7eb';
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();

    // Dark dial face
    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(128, 128, 110, 0, Math.PI * 2);
    ctx.fill();

    // Ticks
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 0.75) + (i / 19) * (Math.PI * 1.5);
      const r1 = 92;
      const r2 = (i % 5 === 0) ? 80 : 86;
      ctx.beginPath();
      ctx.moveTo(128 + Math.cos(angle) * r1, 128 + Math.sin(angle) * r1);
      ctx.lineTo(128 + Math.cos(angle) * r2, 128 + Math.sin(angle) * r2);
      ctx.stroke();
    }

    // Optimal 9 bar green zone
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(128, 128, 98, Math.PI * 1.3, Math.PI * 1.7);
    ctx.stroke();

    // Red needle
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(128, 128);
    const needleAngle = Math.PI * 1.48; // Pointing to 9 BAR
    ctx.lineTo(128 + Math.cos(needleAngle) * 80, 128 + Math.sin(needleAngle) * 80);
    ctx.stroke();

    // Needle pivot cap
    ctx.fillStyle = '#f3f4f6';
    ctx.beginPath();
    ctx.arc(128, 128, 10, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Latte Art (Warm espresso crema with white milk rosette/tulip)
 */
export function getLatteArtTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('latte_art', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Rich hazelnut crema base with gradient
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, '#a36838');
    grad.addColorStop(0.6, '#7d451b');
    grad.addColorStop(0.92, '#522b0f');
    grad.addColorStop(1, '#3b1c08');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Micro foam specks
    for (let i = 0; i < 400; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 110;
      ctx.fillStyle = 'rgba(255, 235, 210, 0.08)';
      ctx.fillRect(128 + Math.cos(a) * r, 128 + Math.sin(a) * r, 1.5, 1.5);
    }

    // Steamed white milk foam tulip/heart
    ctx.save();
    ctx.translate(128, 128);
    ctx.fillStyle = '#fffdf7';
    ctx.shadowColor = 'rgba(100, 50, 20, 0.4)';
    ctx.shadowBlur = 4;

    // Heart top lobe
    ctx.beginPath();
    ctx.arc(-22, -18, 26, 0, Math.PI * 2);
    ctx.arc(22, -18, 26, 0, Math.PI * 2);
    ctx.fill();

    // Central leaf/tulip stacks
    for (let s = -10; s <= 25; s += 16) {
      ctx.beginPath();
      ctx.ellipse(0, s, 34 - Math.abs(s) * 0.4, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Stem pull-through line
    ctx.strokeStyle = '#854d24';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.lineTo(0, 48);
    ctx.stroke();

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Dark Charcoal Brick Masonry (Upper facade from photos 2, 6, 7)
 */
export function getDarkBrickTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('dark_brick', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Dark charcoal mortar
    ctx.fillStyle = '#18191c';
    ctx.fillRect(0, 0, 512, 512);

    const bh = 14;
    const bw = 36;
    for (let r = 0; r < 512 / bh; r++) {
      const offsetX = (r % 2 === 0) ? 0 : bw / 2;
      for (let c = -1; c < 512 / bw + 1; c++) {
        const x = c * bw + offsetX;
        const y = r * bh;

        // Brick color variation (dark espresso/charcoal tones)
        const tone = 36 + Math.floor((Math.random() - 0.5) * 16);
        ctx.fillStyle = `rgb(${tone + 2}, ${tone}, ${tone - 2})`;
        ctx.fillRect(x + 1.5, y + 1.5, bw - 3, bh - 3);

        // Subtle brick texture stipple
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(x + 2, y + 2, bw - 4, 1);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Circular Medal Logo Badge (Photo 1)
 */
export function getChromeMedallionTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('chrome_medallion', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Background dark brushed circle
    ctx.fillStyle = '#161719';
    ctx.fillRect(0, 0, 512, 512);

    // Outer concentric metallic rings
    ctx.strokeStyle = '#d4d8dd';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 256, 240, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#8a9199';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(256, 256, 210, 0, Math.PI * 2);
    ctx.stroke();

    // Arched text "CHROME" on top, "& BEAN" on bottom
    ctx.save();
    ctx.translate(256, 256);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CHROME', 0, -145);
    ctx.fillText('& BEAN', 0, 145);

    // Portafilter & Coffee Bean Emblem
    ctx.fillStyle = '#c5ccd3';
    ctx.fillRect(-150, -12, 110, 24); // Handle
    ctx.beginPath();
    ctx.arc(30, 0, 52, 0, Math.PI * 2); // Basket
    ctx.fill();

    // Roasted Coffee Bean inside basket
    ctx.fillStyle = '#4a2d18';
    ctx.beginPath();
    ctx.ellipse(30, 0, 32, 22, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#241408';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.quadraticCurveTo(30, 8, 50, 0);
    ctx.stroke();

    ctx.fillStyle = '#a6b0b8';
    ctx.font = 'bold 22px "Space Grotesk", sans-serif';
    ctx.fillText('ROASTERY & BAR', 0, 195);
    ctx.font = '600 18px "Space Grotesk", sans-serif';
    ctx.fillText('EST. 2026', 0, 220);

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Linear Slotted Stainless Trench Drain Texture (Kitchen & Terrace)
 */
export function getTrenchDrainTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('trench_drain', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#788088';
    ctx.fillRect(0, 0, 128, 256);

    // Slotted drainage openings
    ctx.fillStyle = '#111215';
    for (let y = 8; y < 250; y += 14) {
      ctx.fillRect(16, y, 96, 6);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 4);
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Plaid Blanket Texture (Photo 2)
 */
export function getPlaidFabricTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('plaid_blanket', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#404348';
    ctx.fillRect(0, 0, 256, 256);

    // Plaid grid checks
    ctx.fillStyle = 'rgba(210, 215, 225, 0.35)';
    for (let x = 0; x < 256; x += 32) {
      ctx.fillRect(x, 0, 14, 256);
    }
    for (let y = 0; y < 256; y += 32) {
      ctx.fillRect(0, y, 256, 14);
    }

    // Fine accent thread
    ctx.fillStyle = 'rgba(240, 160, 80, 0.5)';
    for (let x = 16; x < 256; x += 32) {
      ctx.fillRect(x, 0, 2, 256);
    }
    for (let y = 16; y < 256; y += 32) {
      ctx.fillRect(0, y, 256, 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }) as THREE.CanvasTexture;
}

/**
 * Procedural Green Bean Cellar Climate Display ("18.2°C • 58% RH")
 */
export function getCellarClimateTexture(): THREE.CanvasTexture {
  return getOrCreateTexture('cellar_climate', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0f1115';
    ctx.fillRect(0, 0, 256, 96);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 26px monospace';
    ctx.fillText('18.2°C', 18, 42);

    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 26px monospace';
    ctx.fillText('58% RH', 140, 42);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '14px monospace';
    ctx.fillText('CLIMATE: OPTIMAL', 18, 76);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }) as THREE.CanvasTexture;
}
