import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildCafeModel, CafeBuildResult } from './cafeBuilder';
import { CameraPreset, LightingMode, CutawayMode } from '../types/cafe';

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'cinematic_dusk',
    name: 'Cinematic Dusk View',
    category: 'overview',
    position: [-14, 9, 18],
    target: [-2, 1.5, 0],
    fov: 42,
    description: 'Hero perspective showcasing the dark fluted facade, warm glowing interior, takeaway window, and outdoor terrace at dusk.',
    details: {
      materials: 'Dark graphite concrete, fluted glass, polished chrome, smoked oak',
      capacity: '60 seats + 18 terrace',
      features: ['24/7 Takeaway window', 'Terrace string lights', 'Patio pyramid heaters'],
    },
  },
  {
    id: 'topdown_cutaway',
    name: 'Architectural Plan Cutaway',
    category: 'overview',
    position: [-2.5, 26, 0.5],
    target: [-2.5, 0, 0],
    fov: 38,
    description: 'Orthogonal-style master plan cutaway revealing the entire cafe zoning: Roastery, Coworking, Bar, Lounge, Kitchen, and Restrooms.',
    details: {
      equipment: 'Complete floor plan layout as per architectural specifications',
      features: ['Zoned acoustics', 'Temperature controlled green bean cellar (18°C)', 'Linear workflow'],
    },
  },
  {
    id: 'espresso_island',
    name: 'Espresso Bar & Island',
    category: 'equipment',
    position: [0.6, 2.2, 3.4],
    target: [0.5, 1.0, 0.3],
    fov: 45,
    description: 'Monolithic brushed stainless steel bar island with custom La Marzocco commercial machine, on-demand grinders, and overhead LED suspension rack.',
    details: {
      equipment: 'La Marzocco Linea PB 2-group custom chrome, 2x Mahlkönig grinders, Barista pitcher rinser',
      materials: 'Brushed 316 stainless steel, mirror chrome, fluted glass partition',
      features: ['Continuous warm 3200K LED halo', 'Under-counter milk refrigeration', 'Direct plumbing'],
    },
  },
  {
    id: 'roastery_lab',
    name: 'Roasting Lab & 18°C Cellar',
    category: 'equipment',
    position: [6.2, 2.8, -3.8],
    target: [3.8, 1.0, -7.0],
    fov: 44,
    description: 'Dedicated coffee roasting department with industrial drum roaster, active motorized cooling agitator, and climate-controlled green bean room.',
    details: {
      equipment: 'Probat industrial drum roaster, cyclone chaff separator, digital roast curve terminal',
      materials: 'Cast iron, stainless steel exhaust ductwork, burlap coffee sacks',
      features: ['Agitator cooling arms', 'RoR rate of rise profile tracking', '18°C humidity-controlled storage'],
    },
  },
  {
    id: 'coworking_table',
    name: 'Smoked Oak Coworking Desk',
    category: 'interior',
    position: [-6.8, 3.2, 7.2],
    target: [-6.8, 0.8, 3.6],
    fov: 46,
    description: '9-meter solid smoked oak communal workbench with embedded power hubs, MacBooks, and hanging chrome dome pendant lights.',
    details: {
      materials: 'Smoked dark oak, black powder-coated steel trestles, spun chrome shades',
      capacity: '10 coworking seats',
      features: ['Recessed 230V AC & USB-C fast charging modules', 'High-speed Wi-Fi 7', 'Acoustic comfort'],
    },
  },
  {
    id: 'evening_lounge',
    name: 'Evening Lounge & Dining',
    category: 'interior',
    position: [-2.0, 2.5, -1.8],
    target: [-5.2, 0.8, -4.5],
    fov: 46,
    description: 'Intimate modular sofa seating and candlelit dining tables surrounded by lush Monstera and Ficus greenery.',
    details: {
      materials: 'Deep charcoal textured woven fabric, dark wood bistro tables, amber glass candleholders',
      capacity: '18 lounge guests',
      features: ['Dimmable mood lighting', 'Direct view into roastery lab', 'Low-profile acoustic seating'],
    },
  },
  {
    id: 'outdoor_terrace',
    name: 'Outdoor Patio & Street',
    category: 'exterior',
    position: [-7.2, 2.8, 15.5],
    target: [-7.0, 1.2, 9.8],
    fov: 44,
    description: 'Sidewalk dining terrace with black fabric canopy, fairy string lights, glass pyramid flame patio heaters, and hedge planters.',
    details: {
      materials: 'Cobblestone granite pavers, black steel wire mesh chairs, tempered glass heater tubes',
      capacity: '16 outdoor seats',
      features: ['Real dancing fire flame heaters', 'String garland warm glow', 'All-weather retractable awning'],
    },
  },
  {
    id: 'commercial_kitchen',
    name: 'Commercial Prep Kitchen',
    category: 'interior',
    position: [-4.2, 2.2, -8.2],
    target: [-7.2, 1.0, -10.2],
    fov: 48,
    description: 'Heavy-duty stainless steel chef station with gas range burners, deep ventilation hood, and gastro prep line.',
    details: {
      equipment: 'Commercial 4-burner gas range, full stainless ventilation hood, refrigerated prep table',
      materials: 'Food-grade stainless steel, fire-rated wall cladding',
    },
  },
  {
    id: 'luxury_restroom',
    name: 'Executive Restroom / WC',
    category: 'interior',
    position: [-8.2, 2.2, -6.8],
    target: [-9.4, 1.4, -9.2],
    fov: 48,
    description: 'Brutalist graphite restroom suite with floating concrete vanity counter, surface-mounted metal vessel sinks, and backlit halo mirrors.',
    details: {
      materials: 'Dark architectural concrete, matte black faucets, halo LED mirrors',
      features: ['Occupancy indicator locks', 'Touchless Dyson hand drying', 'Ambient warm cove light'],
    },
  },
  {
    id: 'latte_art_closeup',
    name: 'Крупный план: Латте-арт & La Marzocco',
    category: 'equipment',
    position: [0.6, 1.45, 1.25],
    target: [0.6, 1.05, 0.45],
    fov: 34,
    description: 'Макро-ракурс на кастомную двухгруппную эспрессо-машину La Marzocco, весы Acaia Lunar, чашки с молочной розеттой (Latte Art) и питчер.',
    details: {
      equipment: 'La Marzocco Linea PB Custom Chrome, Acaia Lunar, Motta Pitcher',
      materials: 'Шлифованная сталь 316, зеркальный хром, фарфор',
      features: ['Реалистичная золотистая крема с рисунком тюльпана', 'Паровые трубки Cool Touch', 'Рабочее давление 9 BAR'],
    },
  },
  {
    id: 'entrance_eyelevel',
    name: 'Вход: Вид от первого лица (1.65м)',
    category: 'interior',
    position: [-0.2, 1.65, 5.8],
    target: [0.5, 1.45, 0.2],
    fov: 55,
    description: 'Осмотр кофейни с высоты человеческого взгляда от центрального входа: панорама эспрессо-острова, коворкинга и ростерии.',
    details: {
      capacity: 'Человеческий масштаб (Human scale eye-level view)',
      features: ['Полный обзор геометрии залов', 'Видимость световых сценариев', 'Эргономика пространства'],
    },
  },
];

export class CafeScene {
  private container: HTMLDivElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private clock = new THREE.Clock();
  private reqId = 0;

  private cafeData: CafeBuildResult;
  private currentPreset: CameraPreset = CAMERA_PRESETS[0];

  // Camera damping targets
  private targetPos = new THREE.Vector3().fromArray(CAMERA_PRESETS[0].position);
  private targetLookAt = new THREE.Vector3().fromArray(CAMERA_PRESETS[0].target);
  private targetFov = CAMERA_PRESETS[0].fov || 42;
  private isUserInteracting = false;

  // Environment and Lighting
  private hemiLight: THREE.HemisphereLight;
  private dirKeyLight: THREE.DirectionalLight;
  private envTexture: THREE.Texture | null = null;
  private currentLightingMode: LightingMode = 'dusk';
  private currentCutawayMode: CutawayMode = 'cutaway';

  // Animation and Tour states
  private agitatorSpeed = 1.0;
  private showHotspots = true;
  private isTourActive = false;
  private tourTimer = 0;
  private tourIndex = 0;

  // Raycasting
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private onHotspotClickCallback?: (hotspotId: string) => void;
  private onFpsUpdateCallback?: (fps: number) => void;
  private onPresetChangeCallback?: (preset: CameraPreset) => void;

  // Performance tracking
  private frameCount = 0;
  private lastFpsTime = performance.now();

  constructor(container: HTMLDivElement) {
    this.container = container;

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111317);
    this.scene.fog = new THREE.FogExp2(0x14161a, 0.016);

    // 2. Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(this.targetFov, aspect, 0.1, 150);
    this.camera.position.copy(this.targetPos);

    // 3. Renderer setup strictly per guidelines
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true, // For screenshot capture
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 4. Studio Environment Reflection via RoomEnvironment & PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    this.envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    this.scene.environment = this.envTexture;
    pmremGenerator.dispose();

    // 5. Lighting Rig (Warm Key + Cool Fill + Directional Shadows)
    this.hemiLight = new THREE.HemisphereLight(0x7085a0, 0x1a1c20, 0.8);
    this.scene.add(this.hemiLight);

    this.dirKeyLight = new THREE.DirectionalLight(0xffecd0, 2.2);
    this.dirKeyLight.position.set(-18, 24, 16);
    this.dirKeyLight.castShadow = true;
    this.dirKeyLight.shadow.mapSize.width = 2048;
    this.dirKeyLight.shadow.mapSize.height = 2048;
    this.dirKeyLight.shadow.camera.near = 0.5;
    this.dirKeyLight.shadow.camera.far = 70;
    this.dirKeyLight.shadow.camera.left = -22;
    this.dirKeyLight.shadow.camera.right = 22;
    this.dirKeyLight.shadow.camera.top = 22;
    this.dirKeyLight.shadow.camera.bottom = -22;
    this.dirKeyLight.shadow.bias = -0.0004;
    this.dirKeyLight.shadow.normalBias = 0.02;
    this.scene.add(this.dirKeyLight);

    // 6. Build the Cafe Model
    this.cafeData = buildCafeModel();
    this.scene.add(this.cafeData.sceneGroup);

    // 7. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going underground
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 50;
    this.controls.target.copy(this.targetLookAt);

    this.controls.addEventListener('start', () => {
      this.isUserInteracting = true;
    });

    // 8. Event listeners
    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.addEventListener('click', this.onPointerClick);

    // Initial modes setup
    this.setLightingMode('dusk');
    this.setCutawayMode('cutaway');

    // Pre-warm shaders
    this.renderer.compile(this.scene, this.camera);

    // Start render loop
    this.tick();
  }

  private onResize = () => {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private onPointerClick = (e: MouseEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check click on hotspots
    for (const h of this.cafeData.hotspotTargets) {
      const dist = this.raycaster.ray.distanceToPoint(h.position);
      if (dist < 1.4) {
        if (this.onHotspotClickCallback) {
          this.onHotspotClickCallback(h.id);
        }
        const preset = CAMERA_PRESETS.find((p) => p.id === h.id);
        if (preset) {
          this.setCameraPreset(preset);
        }
        return;
      }
    }
  };

  public setOnHotspotClick(cb: (hotspotId: string) => void) {
    this.onHotspotClickCallback = cb;
  }

  public setOnFpsUpdate(cb: (fps: number) => void) {
    this.onFpsUpdateCallback = cb;
  }

  public setCameraPreset(preset: CameraPreset) {
    this.currentPreset = preset;
    this.targetPos.fromArray(preset.position);
    this.targetLookAt.fromArray(preset.target);
    this.targetFov = preset.fov || 44;
    this.isUserInteracting = false;
  }

  public setLightingMode(mode: LightingMode) {
    this.currentLightingMode = mode;

    if (mode === 'dusk') {
      // Atmospheric dusk / golden evening matching images 2, 6, 7, 11
      this.scene.background = new THREE.Color(0x1a1820);
      this.scene.fog = new THREE.FogExp2(0x18171f, 0.016);
      this.hemiLight.color.setHex(0x9fa8b8);
      this.hemiLight.groundColor.setHex(0x28201a);
      this.hemiLight.intensity = 0.9;

      this.dirKeyLight.color.setHex(0xffbe85);
      this.dirKeyLight.intensity = 2.2;
      this.dirKeyLight.position.set(-18, 14, 16);

      this.renderer.toneMappingExposure = 1.15;
      this.toggleInteriorLights(true, 1.0);
    } else if (mode === 'day') {
      // Crisp daylight
      this.scene.background = new THREE.Color(0x7da4c7);
      this.scene.fog = new THREE.FogExp2(0x7da4c7, 0.01);
      this.hemiLight.color.setHex(0xebf4ff);
      this.hemiLight.groundColor.setHex(0x404040);
      this.hemiLight.intensity = 1.3;

      this.dirKeyLight.color.setHex(0xffffff);
      this.dirKeyLight.intensity = 3.0;
      this.dirKeyLight.position.set(-14, 28, 14);

      this.renderer.toneMappingExposure = 1.0;
      this.toggleInteriorLights(true, 0.7);
    } else if (mode === 'night') {
      // Deep midnight mood with dramatic interior illumination
      this.scene.background = new THREE.Color(0x090a0d);
      this.scene.fog = new THREE.FogExp2(0x090a0d, 0.022);
      this.hemiLight.color.setHex(0x20304a);
      this.hemiLight.groundColor.setHex(0x0a0c10);
      this.hemiLight.intensity = 0.45;

      this.dirKeyLight.color.setHex(0x5a759e);
      this.dirKeyLight.intensity = 0.8;
      this.dirKeyLight.position.set(-10, 18, -12);

      this.renderer.toneMappingExposure = 1.35;
      this.toggleInteriorLights(true, 1.4);
    } else if (mode === 'neon') {
      // Cyber / dramatic neon evening
      this.scene.background = new THREE.Color(0x08090f);
      this.scene.fog = new THREE.FogExp2(0x0b0e17, 0.02);
      this.hemiLight.color.setHex(0x00ffff);
      this.hemiLight.groundColor.setHex(0xff0080);
      this.hemiLight.intensity = 0.6;

      this.dirKeyLight.color.setHex(0x40e0d0);
      this.dirKeyLight.intensity = 1.2;

      this.renderer.toneMappingExposure = 1.3;
      this.toggleInteriorLights(true, 1.3);
    }
  }

  private toggleInteriorLights(enabled: boolean, multiplier = 1.0) {
    this.cafeData.pointLights.forEach((pl) => {
      pl.visible = enabled;
      pl.intensity = 1.5 * multiplier;
    });
    this.cafeData.spotLights.forEach((sl) => {
      sl.visible = enabled;
      sl.intensity = 2.4 * multiplier;
    });
  }

  public setCutawayMode(mode: CutawayMode) {
    this.currentCutawayMode = mode;
    if (mode === 'full') {
      // Show full roof & top details
      this.cafeData.cutawayGroup.visible = true;
      this.cafeData.cutawayGroup.position.y = 0;
    } else if (mode === 'cutaway') {
      // Cutaway plan view (hides roof and ceiling ducts so complete interior is visible)
      this.cafeData.cutawayGroup.visible = false;
    } else {
      // Floorplan isolated
      this.cafeData.cutawayGroup.visible = false;
    }
  }

  public setAgitatorSpeed(speed: number) {
    this.agitatorSpeed = speed;
  }

  public toggleHotspots(visible: boolean) {
    this.showHotspots = visible;
  }

  public setOnPresetChange(cb: (preset: CameraPreset) => void) {
    this.onPresetChangeCallback = cb;
  }

  public toggleTour(): boolean {
    this.isTourActive = !this.isTourActive;
    this.tourTimer = 0;
    if (this.isTourActive) {
      this.tourIndex = CAMERA_PRESETS.findIndex((p) => p.id === this.currentPreset.id);
      if (this.tourIndex === -1) this.tourIndex = 0;
    }
    return this.isTourActive;
  }

  public getIsTourActive(): boolean {
    return this.isTourActive;
  }

  public captureScreenshot(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  private tick = () => {
    this.reqId = requestAnimationFrame(this.tick);

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const time = this.clock.getElapsedTime();

    // Auto-Tour smooth cycle between presets every 8 seconds
    if (this.isTourActive) {
      this.tourTimer += delta;
      if (this.tourTimer >= 8.5) {
        this.tourTimer = 0;
        this.tourIndex = (this.tourIndex + 1) % CAMERA_PRESETS.length;
        const nextPreset = CAMERA_PRESETS[this.tourIndex];
        this.setCameraPreset(nextPreset);
        if (this.onPresetChangeCallback) {
          this.onPresetChangeCallback(nextPreset);
        }
      }
    }

    // 1. Smooth Camera Damping when user is not manually dragging
    if (!this.isUserInteracting) {
      // Smooth exponential damping: 1 - Math.exp(-k * dt)
      const dampFactor = 1.0 - Math.exp(-4.5 * delta);
      this.camera.position.lerp(this.targetPos, dampFactor);
      this.controls.target.lerp(this.targetLookAt, dampFactor);

      if (Math.abs(this.camera.fov - this.targetFov) > 0.05) {
        this.camera.fov += (this.targetFov - this.camera.fov) * dampFactor;
        this.camera.updateProjectionMatrix();
      }

      // Check if settled
      if (this.camera.position.distanceTo(this.targetPos) < 0.08) {
        this.isUserInteracting = true; // Hand back control smoothly
      }
    }

    this.controls.update();

    // 2. Animate Roaster Cooling Tray Agitator
    if (this.cafeData.animatedObjects.roasterAgitator && this.agitatorSpeed > 0) {
      this.cafeData.animatedObjects.roasterAgitator.rotation.y += delta * 1.8 * this.agitatorSpeed;
    }

    // 3. Animate Patio Gas Heater Flames (dancing flicker)
    this.cafeData.animatedObjects.patioFlames.forEach((flame, idx) => {
      const flicker = 0.85 + Math.sin(time * 12 + idx * 2.5) * 0.15 + Math.sin(time * 24) * 0.08;
      flame.scale.set(flicker, flicker * 1.1, flicker);
      flame.rotation.y = time * 2 + idx;
    });

    // 4. Animate Roaster exhaust steam particles
    if (this.cafeData.animatedObjects.steamParticles) {
      const positions = this.cafeData.animatedObjects.steamParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += delta * 0.6; // Rise in Y
        positions[i] += Math.sin(time * 2 + i) * 0.003; // Drift in X
        // Reset if reached ceiling
        if (positions[i + 1] > 4.4) {
          positions[i + 1] = 2.8;
          positions[i] = 4.85 + (Math.random() - 0.5) * 0.25;
          positions[i + 2] = -6.5 + (Math.random() - 0.5) * 0.25;
        }
      }
      this.cafeData.animatedObjects.steamParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Render Scene
    this.renderer.render(this.scene, this.camera);

    // FPS calculation
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsTime >= 500) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      if (this.onFpsUpdateCallback) {
        this.onFpsUpdateCallback(fps);
      }
      this.frameCount = 0;
      this.lastFpsTime = now;
    }
  };

  public dispose() {
    cancelAnimationFrame(this.reqId);
    window.removeEventListener('resize', this.onResize);
    this.renderer.domElement.removeEventListener('click', this.onPointerClick);
    this.controls.dispose();
    this.renderer.dispose();
    if (this.envTexture) this.envTexture.dispose();
    if (this.container && this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
