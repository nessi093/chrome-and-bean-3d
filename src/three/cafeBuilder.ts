import * as THREE from 'three';
import {
  getBrushedMetalTexture,
  getFlutedGlassTexture,
  getConcreteTexture,
  getSmokedOakTexture,
  getCobblestoneTexture,
  getBurlapSackTexture,
  getNeonSignTexture,
  getChromeSignTexture,
  getLaptopScreenTexture,
  getGaugeDialTexture,
  getLatteArtTexture,
  getDarkBrickTexture,
  getChromeMedallionTexture,
  getTrenchDrainTexture,
  getPlaidFabricTexture,
  getCellarClimateTexture,
} from './proceduralTextures';

export interface CafeBuildResult {
  sceneGroup: THREE.Group;
  cutawayGroup: THREE.Group; // Group that can be hidden/lowered in cutaway floorplan view
  animatedObjects: {
    roasterAgitator?: THREE.Group;
    patioFlames: THREE.Mesh[];
    carLights: THREE.Object3D[];
    steamParticles?: THREE.Points;
  };
  pointLights: THREE.PointLight[];
  spotLights: THREE.SpotLight[];
  hotspotTargets: { name: string; position: THREE.Vector3; id: string }[];
}

export function buildCafeModel(): CafeBuildResult {
  const sceneGroup = new THREE.Group();
  sceneGroup.name = 'CafeMaster';

  const cutawayGroup = new THREE.Group();
  cutawayGroup.name = 'CutawayElements';
  sceneGroup.add(cutawayGroup);

  const pointLights: THREE.PointLight[] = [];
  const spotLights: THREE.SpotLight[] = [];
  const patioFlames: THREE.Mesh[] = [];
  const carLights: THREE.Object3D[] = [];
  const hotspotTargets: { name: string; position: THREE.Vector3; id: string }[] = [];

  // ==========================================
  // SHARED PROCEDURAL MATERIALS
  // ==========================================
  const brushedMetalTex = getBrushedMetalTexture();
  const flutedGlassTex = getFlutedGlassTexture();
  const concreteTex = getConcreteTexture();
  const oakTex = getSmokedOakTexture();
  const cobblestoneTex = getCobblestoneTexture();

  // Dark polished concrete floor (Interior)
  const floorInteriorMat = new THREE.MeshStandardMaterial({
    color: 0x222428,
    roughness: 0.28,
    metalness: 0.15,
    bumpMap: concreteTex,
    bumpScale: 0.02,
  });

  // Dark graphite brutalist walls
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x1c1e22,
    roughness: 0.85,
    metalness: 0.1,
    bumpMap: concreteTex,
    bumpScale: 0.05,
  });

  // Brushed Stainless Steel (Counter, Espresso Machine, Prep stations)
  const stainlessMat = new THREE.MeshStandardMaterial({
    color: 0xd8dde2,
    roughness: 0.22,
    metalness: 0.92,
    bumpMap: brushedMetalTex,
    bumpScale: 0.015,
  });

  // Mirror Chrome (Pendants, Trim, Accents, Portafilter)
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf4f7f9,
    roughness: 0.06,
    metalness: 0.98,
  });

  // Smoked Oak Wood (Tables, chairs, shelves)
  const woodOakMat = new THREE.MeshStandardMaterial({
    color: 0x241d18,
    roughness: 0.55,
    metalness: 0.05,
    map: oakTex,
    bumpMap: oakTex,
    bumpScale: 0.03,
  });

  // Fluted / Reeded Glass
  const flutedGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.72,
    roughness: 0.25,
    transmission: 0.75,
    ior: 1.5,
    thickness: 0.08,
    normalMap: flutedGlassTex,
    normalScale: new THREE.Vector2(0.5, 0.5),
    depthWrite: false,
  });

  // Clear Window Glass
  const clearGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xeef4f8,
    transparent: true,
    opacity: 0.35,
    roughness: 0.05,
    transmission: 0.92,
    ior: 1.52,
    thickness: 0.05,
    depthWrite: false,
  });

  // Matte Black Steel (Window frames, furniture legs, ducting)
  const blackSteelMat = new THREE.MeshStandardMaterial({
    color: 0x17181a,
    roughness: 0.6,
    metalness: 0.65,
  });

  // Cast Iron Roaster Black
  const castIronMat = new THREE.MeshStandardMaterial({
    color: 0x141416,
    roughness: 0.75,
    metalness: 0.8,
  });

  // Upholstery fabric (Charcoal lounge sofas)
  const fabricSofaMat = new THREE.MeshStandardMaterial({
    color: 0x2b2e34,
    roughness: 0.92,
    metalness: 0.02,
  });

  // Warm LED emission material (for light fixtures & strip channels)
  const warmLedMat = new THREE.MeshBasicMaterial({
    color: 0xffe6b8,
  });

  // White porcelain ceramic (Cups, sanitary)
  const porcelainMat = new THREE.MeshStandardMaterial({
    color: 0xf8f9fa,
    roughness: 0.12,
    metalness: 0.05,
  });

  // Coffee bean material
  const roastedBeanMat = new THREE.MeshStandardMaterial({
    color: 0x2a170c,
    roughness: 0.45,
    metalness: 0.15,
  });

  // ==========================================
  // 1. GROUND, FLOORS & STREET ENVIRONMENT
  // ==========================================
  // Exterior Asphalt Ground & Road
  const roadGeo = new THREE.PlaneGeometry(64, 56);
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x18191c,
    roughness: 0.9,
    metalness: 0.1,
  });
  const roadMesh = new THREE.Mesh(roadGeo, roadMat);
  roadMesh.rotation.x = -Math.PI / 2;
  roadMesh.position.set(0, -0.05, 0);
  roadMesh.receiveShadow = true;
  sceneGroup.add(roadMesh);

  // Road lane markings
  const roadLineMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.6 });
  for (let z = -20; z <= 24; z += 6) {
    const laneDash = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 3), roadLineMat);
    laneDash.rotation.x = -Math.PI / 2;
    laneDash.position.set(-18, -0.04, z);
    sceneGroup.add(laneDash);
  }

  // Parking Bays Markings (on the right side: X: 11 to 24, Z: -16 to 18)
  for (let pz = -14; pz <= 16; pz += 4.5) {
    const parkLine = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 0.14), roadLineMat);
    parkLine.rotation.x = -Math.PI / 2;
    parkLine.position.set(16.5, -0.04, pz);
    sceneGroup.add(parkLine);
  }

  // Pedestrian Sidewalk & Terrace Slab (Cobblestone)
  const sidewalkGeo = new THREE.BoxGeometry(28, 0.18, 30);
  const sidewalkMat = new THREE.MeshStandardMaterial({
    color: 0x42464d,
    roughness: 0.65,
    metalness: 0.1,
    map: cobblestoneTex,
    bumpMap: cobblestoneTex,
    bumpScale: 0.04,
  });
  const sidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
  sidewalk.position.set(-2, 0.09, 2);
  sidewalk.receiveShadow = true;
  sceneGroup.add(sidewalk);

  // Interior Cafe Floor Slab (Slightly raised +0.02)
  const interiorFloorGeo = new THREE.BoxGeometry(19.8, 0.22, 17.8);
  const interiorFloor = new THREE.Mesh(interiorFloorGeo, floorInteriorMat);
  interiorFloor.position.set(-2.5, 0.11, -2.5);
  interiorFloor.receiveShadow = true;
  sceneGroup.add(interiorFloor);

  // ==========================================
  // 2. CAFE ARCHITECTURAL WALLS & PERIMETER
  // ==========================================
  // Dimensions: Cafe bounds from X: -12.4 to +7.4 (W: 19.8), Z: -11.4 to +6.4 (D: 17.8)
  const wallHeight = 4.4;

  // Back Wall (Z = -11.4)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(19.8, wallHeight, 0.4), wallMat);
  backWall.position.set(-2.5, wallHeight / 2, -11.4);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  sceneGroup.add(backWall);

  // Right Wall (X = +7.4)
  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, wallHeight, 17.8), wallMat);
  rightWall.position.set(7.4, wallHeight / 2, -2.5);
  rightWall.castShadow = true;
  rightWall.receiveShadow = true;
  sceneGroup.add(rightWall);

  // Left Wall (X = -12.4) - Partially solid, partially large floor-to-ceiling glass
  const leftWallSolid = new THREE.Mesh(new THREE.BoxGeometry(0.4, wallHeight, 8), wallMat);
  leftWallSolid.position.set(-12.4, wallHeight / 2, -7.4);
  leftWallSolid.castShadow = true;
  leftWallSolid.receiveShadow = true;
  sceneGroup.add(leftWallSolid);

  // Left Wall Glass Section
  const leftGlass = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallHeight - 0.4, 9.8), clearGlassMat);
  leftGlass.position.set(-12.4, (wallHeight - 0.4) / 2 + 0.2, 1.5);
  sceneGroup.add(leftGlass);

  // Left Glass Steel Mullions
  for (let z = -3.2; z <= 6.2; z += 2.4) {
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.18, wallHeight, 0.14), blackSteelMat);
    mullion.position.set(-12.4, wallHeight / 2, z);
    sceneGroup.add(mullion);
  }

  // Front Facade (Z = +6.4) - The Iconic Exterior from Images 2 & 6!
  // Front Solid Entrance Pillar / Takeaway wall
  const frontPillar = new THREE.Mesh(new THREE.BoxGeometry(5.4, wallHeight, 0.45), wallMat);
  frontPillar.position.set(4.6, wallHeight / 2, 6.4);
  frontPillar.castShadow = true;
  frontPillar.receiveShadow = true;
  sceneGroup.add(frontPillar);

  // Takeaway Window Cutout counter sill (Images 2, 6, 7)
  const takeawayShelf = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.5), woodOakMat);
  takeawayShelf.position.set(1.4, 1.05, 6.45);
  sceneGroup.add(takeawayShelf);

  // Takeaway POS Terminal
  const posStand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.22, 12), blackSteelMat);
  posStand.position.set(1.1, 1.2, 6.45);
  const posScreen = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.02), blackSteelMat);
  posScreen.position.set(1.1, 1.32, 6.45);
  posScreen.rotation.x = -0.3;
  sceneGroup.add(posStand, posScreen);

  // Takeaway Paper Cups on the ledge
  for (let i = 0; i < 2; i++) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.12, 16), porcelainMat);
    cup.position.set(1.5 + i * 0.12, 1.15, 6.45);
    sceneGroup.add(cup);
  }

  // Double Glass Entrance Doors (Center: X: -0.2 to 1.6, Z: 6.4)
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.1, 3.2, 0.15), blackSteelMat);
  doorFrame.position.set(-0.2, 1.6, 6.4);
  const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(1.9, 3.0, 0.05), clearGlassMat);
  doorGlass.position.set(-0.2, 1.6, 6.4);
  sceneGroup.add(doorGlass);

  // Chrome Tube Pull Handles
  const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 12), chromeMat);
  handleL.position.set(-0.35, 1.45, 6.55);
  const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.9, 12), chromeMat);
  handleR.position.set(-0.05, 1.45, 6.55);
  sceneGroup.add(handleL, handleR);

  // Front Panoramic Glass Windows (X: -12.4 to -1.3, Z: 6.4)
  const frontGlassW = 10.8;
  const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(frontGlassW, wallHeight - 0.4, 0.06), clearGlassMat);
  frontGlass.position.set(-6.8, (wallHeight - 0.4) / 2 + 0.2, 6.4);
  sceneGroup.add(frontGlass);

  // Steel Mullions along front glass
  for (let x = -12.4; x <= -1.4; x += 2.7) {
    const mull = new THREE.Mesh(new THREE.BoxGeometry(0.14, wallHeight, 0.18), blackSteelMat);
    mull.position.set(x, wallHeight / 2, 6.4);
    sceneGroup.add(mull);
  }

  // Upper Architectural Fascia & Cove (Top header above glass)
  const fascia = new THREE.Mesh(new THREE.BoxGeometry(20.4, 0.5, 0.6), wallMat);
  fascia.position.set(-2.5, wallHeight + 0.15, 6.4);
  sceneGroup.add(fascia);

  // Warm LED Fascia Strip (Images 2, 6)
  const fasciaLed = new THREE.Mesh(new THREE.BoxGeometry(20.2, 0.06, 0.08), warmLedMat);
  fasciaLed.position.set(-2.5, wallHeight - 0.08, 6.72);
  sceneGroup.add(fasciaLed);

  // Exterior Lit Signs: "CHROME & BEAN" + "24/7 • ONLINE"
  const chromeSignTex = getChromeSignTexture();
  const chromeSignMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 1.2),
    new THREE.MeshStandardMaterial({
      map: chromeSignTex,
      roughness: 0.15,
      metalness: 0.9,
    })
  );
  chromeSignMesh.position.set(4.6, 2.7, 6.64);
  sceneGroup.add(chromeSignMesh);

  // Warm backlight wash behind Chrome Sign
  const signBacklight = new THREE.PointLight(0xffecd0, 1.2, 3.5);
  signBacklight.position.set(4.6, 2.7, 6.8);
  sceneGroup.add(signBacklight);
  pointLights.push(signBacklight);

  // Neon "24/7 • ONLINE" Pill Sign
  const neonTex = getNeonSignTexture();
  const neonSignMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.42),
    new THREE.MeshBasicMaterial({
      map: neonTex,
      transparent: true,
    })
  );
  neonSignMesh.position.set(4.6, 1.85, 6.64);
  sceneGroup.add(neonSignMesh);

  const neonGlowLight = new THREE.PointLight(0x40e0d0, 1.5, 4.0);
  neonGlowLight.position.set(4.6, 1.85, 6.8);
  sceneGroup.add(neonGlowLight);
  pointLights.push(neonGlowLight);

  // ==========================================
  // CUTAWAY GROUP: ROOF, UPPER BRICK FACADE, CEILING DUCTWORK & LIGHTS
  // ==========================================
  // The roof slab
  const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(20.2, 0.35, 18.2), wallMat);
  roofSlab.position.set(-2.5, wallHeight + 0.35, -2.5);
  cutawayGroup.add(roofSlab);

  // Upper Building Stories (Dark Charcoal Brick Masonry from Photos 2, 6, 7)
  const brickMat = new THREE.MeshStandardMaterial({
    map: getDarkBrickTexture(),
    bumpMap: getDarkBrickTexture(),
    bumpScale: 0.04,
    roughness: 0.88,
  });
  const upperBuilding = new THREE.Mesh(new THREE.BoxGeometry(20.2, 3.8, 18.2), brickMat);
  upperBuilding.position.set(-2.5, wallHeight + 2.2, -2.5);
  upperBuilding.castShadow = true;
  upperBuilding.receiveShadow = true;
  cutawayGroup.add(upperBuilding);

  // Upper Windows with warm evening interior glow
  for (let wx = -10.5; wx <= 5.5; wx += 3.8) {
    const upperWindow = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.0, 0.1), new THREE.MeshPhysicalMaterial({
      color: 0xffeedd,
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0xffc870,
      emissiveIntensity: 0.45,
    }));
    upperWindow.position.set(wx, wallHeight + 2.2, 6.62);
    cutawayGroup.add(upperWindow);
  }

  // Ceiling HVAC Ductwork (Large round spiral galvanized steel pipes as seen in images 3, 4, 7, 9)
  const ductMat = new THREE.MeshStandardMaterial({
    color: 0x9fa4a9,
    roughness: 0.35,
    metalness: 0.85,
    bumpMap: brushedMetalTex,
    bumpScale: 0.02,
  });

  const mainDuct = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 17, 24), ductMat);
  mainDuct.rotation.x = Math.PI / 2;
  mainDuct.position.set(-2.0, wallHeight - 0.45, -2.5);
  cutawayGroup.add(mainDuct);

  const branchDuct = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 14, 24), ductMat);
  branchDuct.rotation.z = Math.PI / 2;
  branchDuct.position.set(-2.5, wallHeight - 0.45, -4.5);
  cutawayGroup.add(branchDuct);

  // Cable Trays (Perforated metal ladder racks suspended from ceiling)
  const cableTray = new THREE.Mesh(new THREE.BoxGeometry(16, 0.06, 0.4), blackSteelMat);
  cableTray.position.set(-3.0, wallHeight - 0.55, 0.5);
  cutawayGroup.add(cableTray);

  // Ceiling Track Light Rails
  const trackMat = new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.6, metalness: 0.7 });
  for (let z = -8; z <= 4; z += 4) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(15, 0.04, 0.05), trackMat);
    rail.position.set(-3.0, wallHeight - 0.15, z);
    cutawayGroup.add(rail);

    // Track spotlights
    for (let x = -9; x <= 3; x += 3) {
      const spotHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.18, 12), trackMat);
      spotHousing.position.set(x, wallHeight - 0.25, z);
      spotHousing.rotation.x = 0.2;
      cutawayGroup.add(spotHousing);
    }
  }

  // ==========================================
  // 3. ZONE 1: CENTRAL ESPRESSO BAR ISLAND (Images 2, 6, 7, 8, 9)
  // ==========================================
  // Monolithic brushed stainless steel island counter
  // Position: centered at X: 0.5, Z: 0.2, L: 5.6, W: 2.2, H: 0.95
  const islandGroup = new THREE.Group();
  islandGroup.name = 'Zone_EspressoBar';
  islandGroup.position.set(0.5, 0, 0.2);

  // Main Counter Body
  const islandBody = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.92, 2.2), stainlessMat);
  islandBody.position.set(0, 0.46, 0);
  islandBody.castShadow = true;
  islandBody.receiveShadow = true;
  islandGroup.add(islandBody);

  // Recessed dark toe kick
  const toeKick = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.1, 2.0), blackSteelMat);
  toeKick.position.set(0, 0.05, 0);
  islandGroup.add(toeKick);

  // Countertop with bevel edge
  const counterTop = new THREE.Mesh(new THREE.BoxGeometry(5.46, 0.06, 2.26), stainlessMat);
  counterTop.position.set(0, 0.95, 0);
  islandGroup.add(counterTop);

  // Professional Multi-Group Espresso Machine (La Marzocco Linea style, Images 7, 8, 9)
  // Built as a composite 8-part model
  const espressoGroup = new THREE.Group();
  espressoGroup.name = 'LaMarzoccoMachine';
  espressoGroup.position.set(0.6, 0.98, 0.4);

  // 1. Main chassis
  const emBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.46, 0.65), chromeMat);
  emBody.position.set(0, 0.23, 0);
  emBody.castShadow = true;
  espressoGroup.add(emBody);

  // 2. Rear brushed plate with La Marzocco logo strip
  const emBackPlate = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.4, 0.02), stainlessMat);
  emBackPlate.position.set(0, 0.24, -0.33);
  espressoGroup.add(emBackPlate);

  // 3. Top cup warming tray
  const emTray = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.04, 0.55), stainlessMat);
  emTray.position.set(0, 0.47, 0);
  espressoGroup.add(emTray);

  // 4. Ceramic espresso cups on top rack
  for (let cx = -0.45; cx <= 0.45; cx += 0.18) {
    for (let cz = -0.15; cz <= 0.15; cz += 0.15) {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.06, 12), porcelainMat);
      c.position.set(cx + (Math.random() - 0.5) * 0.03, 0.52, cz);
      espressoGroup.add(c);
    }
  }

  // 5. Dual group heads with portafilters
  for (let gx of [-0.26, 0.26]) {
    const groupHead = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.12, 16), chromeMat);
    groupHead.position.set(gx, 0.18, 0.34);
    const portaHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.018, 0.22, 12), blackSteelMat);
    portaHandle.rotation.x = Math.PI / 2.3;
    portaHandle.position.set(gx, 0.14, 0.46);
    espressoGroup.add(groupHead, portaHandle);
  }

  // 6. Dual curved steam wands (Lathe / Tube geometry)
  for (let side of [-0.52, 0.52]) {
    const wand = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.24, 12), chromeMat);
    wand.position.set(side, 0.2, 0.32);
    wand.rotation.z = side > 0 ? -0.3 : 0.3;
    wand.rotation.x = 0.4;
    espressoGroup.add(wand);
  }

  // 7. Dual pressure gauges
  const dialTex = getGaugeDialTexture();
  const dialMat = new THREE.MeshBasicMaterial({ map: dialTex });
  for (let dx of [-0.08, 0.08]) {
    const dial = new THREE.Mesh(new THREE.CircleGeometry(0.04, 24), dialMat);
    dial.position.set(dx, 0.34, 0.33);
    espressoGroup.add(dial);
  }

  // 8. Slitted drip tray
  const dripTray = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.05, 0.28), stainlessMat);
  dripTray.position.set(0, 0.03, 0.42);
  espressoGroup.add(dripTray);

  // Latte Art cups sitting on the drip tray receiving espresso
  const latteArtMat = new THREE.MeshBasicMaterial({ map: getLatteArtTexture() });
  for (let lx of [-0.26, 0.26]) {
    const latteCup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.038, 0.07, 16), porcelainMat);
    latteCup.position.set(lx, 0.08, 0.42);
    const crema = new THREE.Mesh(new THREE.CircleGeometry(0.046, 16), latteArtMat);
    crema.rotation.x = -Math.PI / 2;
    crema.position.set(lx, 0.116, 0.42);
    espressoGroup.add(latteCup, crema);

    // Digital Acaia Lunar scales under the group heads
    const scale = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.015, 0.13), blackSteelMat);
    scale.position.set(lx, 0.04, 0.42);
    espressoGroup.add(scale);
  }

  // Barista pointed milk steaming pitcher
  const pitcher = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.11, 16), stainlessMat);
  pitcher.position.set(-0.62, 0.06, 0.36);
  espressoGroup.add(pitcher);

  islandGroup.add(espressoGroup);

  // Under-counter illuminated bar display cooler (Oat milk, cold brew bottles)
  const barCooler = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.72, 0.08), new THREE.MeshPhysicalMaterial({
    color: 0x40e0d0,
    transparent: true,
    opacity: 0.35,
    roughness: 0.05,
    transmission: 0.85,
  }));
  barCooler.position.set(0, 0.45, -1.05);
  islandGroup.add(barCooler);

  // Cold brew & Oatly milk cartons inside cooler
  for (let bx = -0.7; bx <= 0.7; bx += 0.24) {
    const carton = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.22, 0.09), porcelainMat);
    carton.position.set(bx, 0.22, -0.92);
    islandGroup.add(carton);
  }

  // Circular Chrome & Bean Medallion (Photo 1) on interior feature wall
  const medallionMesh = new THREE.Mesh(
    new THREE.CircleGeometry(0.9, 32),
    new THREE.MeshStandardMaterial({
      map: getChromeMedallionTexture(),
      roughness: 0.2,
      metalness: 0.9,
    })
  );
  medallionMesh.position.set(0.8, 2.5, -2.35);
  sceneGroup.add(medallionMesh);

  // 2 Commercial On-Demand Coffee Grinders (Mahlkönig EK43 / Mythos style)
  for (let gx of [-0.6, -1.1]) {
    const grinder = new THREE.Group();
    grinder.position.set(gx, 0.98, 0.4);

    // Motor base
    const gBase = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.42, 0.32), blackSteelMat);
    gBase.position.set(0, 0.21, 0);
    // Clear hopper filled with beans
    const gHopper = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.32, 16), new THREE.MeshPhysicalMaterial({
      color: 0x996633,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      transmission: 0.5,
    }));
    gHopper.position.set(0, 0.58, 0);
    // Hopper lid
    const gLid = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.125, 0.03, 16), blackSteelMat);
    gLid.position.set(0, 0.74, 0);
    // Spout & fork
    const gSpout = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.12), chromeMat);
    gSpout.position.set(0, 0.16, 0.18);

    grinder.add(gBase, gHopper, gLid, gSpout);
    islandGroup.add(grinder);
  }

  // Barista Sink & Chrome Gooseneck Faucet
  const sink = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.02, 0.5), blackSteelMat);
  sink.position.set(1.7, 0.98, 0.3);
  islandGroup.add(sink);

  const faucetCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.7, 0.98, 0.1),
    new THREE.Vector3(1.7, 1.35, 0.1),
    new THREE.Vector3(1.7, 1.42, 0.22),
    new THREE.Vector3(1.7, 1.32, 0.25),
  ]);
  const faucetMesh = new THREE.Mesh(new THREE.TubeGeometry(faucetCurve, 20, 0.018, 12, false), chromeMat);
  islandGroup.add(faucetMesh);

  // Suspended Architectural Overhead Steel Rack (Images 7, 8, 9)
  // Suspended rectangular steel frame with warm LED halo perimeter!
  const overheadFrameGroup = new THREE.Group();
  overheadFrameGroup.position.set(0.5, 3.1, 0.2);

  // 4 Suspension steel rods from ceiling
  for (let rx of [-2.4, 2.4]) {
    for (let rz of [-0.9, 0.9]) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.3, 8), blackSteelMat);
      rod.position.set(rx, 0.65, rz);
      overheadFrameGroup.add(rod);
    }
  }

  // Rectangular perimeter tubular frame
  const rackFrameL = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.06, 0.06), blackSteelMat);
  rackFrameL.position.set(0, 0, 0.9);
  const rackFrameR = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.06, 0.06), blackSteelMat);
  rackFrameR.position.set(0, 0, -0.9);
  const rackFrameW1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.8), blackSteelMat);
  rackFrameW1.position.set(2.6, 0, 0);
  const rackFrameW2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.8), blackSteelMat);
  rackFrameW2.position.set(-2.6, 0, 0);
  overheadFrameGroup.add(rackFrameL, rackFrameR, rackFrameW1, rackFrameW2);

  // Continuous Warm LED Light Halo underneath overhead frame
  const ledHalo = new THREE.Mesh(new THREE.BoxGeometry(5.16, 0.03, 1.76), warmLedMat);
  ledHalo.position.set(0, -0.04, 0);
  overheadFrameGroup.add(ledHalo);

  // Downward warm spot light illuminating the espresso bar
  const barSpot = new THREE.SpotLight(0xffe2b8, 3.2, 7.0, Math.PI / 3, 0.4, 1.2);
  barSpot.position.set(0.5, 3.0, 0.2);
  barSpot.target = islandBody;
  barSpot.castShadow = true;
  sceneGroup.add(barSpot);
  spotLights.push(barSpot);

  sceneGroup.add(islandGroup);
  sceneGroup.add(overheadFrameGroup);

  hotspotTargets.push({
    id: 'espresso_island',
    name: 'Espresso Bar & Island',
    position: new THREE.Vector3(0.5, 1.2, 0.2),
  });

  // Fluted Glass Acoustic Partitions behind the bar (Images 7, 8, 9)
  const partitionGroup = new THREE.Group();
  partitionGroup.position.set(0.8, 0, -2.4);

  // Steel posts
  for (let px of [-2.4, -0.8, 0.8, 2.4]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.2, 0.08), blackSteelMat);
    post.position.set(px, 1.6, 0);
    partitionGroup.add(post);
  }
  // Reeded glass panels
  for (let px of [-1.6, 0, 1.6]) {
    const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(1.52, 2.8, 0.04), flutedGlassMat);
    glassPanel.position.set(px, 1.6, 0);
    partitionGroup.add(glassPanel);
  }
  sceneGroup.add(partitionGroup);

  // ==========================================
  // 4. ZONE 2: COFFEE ROASTING LABORATORY & GREEN BEAN ROOM (Images 4, 7, 8, 11)
  // ==========================================
  const roasterZoneGroup = new THREE.Group();
  roasterZoneGroup.name = 'Zone_Roastery';
  roasterZoneGroup.position.set(4.4, 0, -6.8);

  // Industrial Drum Coffee Roaster (Probat style)
  // 9-part procedural composite group
  const roaster = new THREE.Group();
  roaster.name = 'CoffeeRoasterMachine';
  roaster.position.set(0, 0, 0);

  // 1. Heavy cast iron drum housing
  const drumGeo = new THREE.CylinderGeometry(0.48, 0.48, 1.1, 24);
  const drumMesh = new THREE.Mesh(drumGeo, castIronMat);
  drumMesh.rotation.z = Math.PI / 2;
  drumMesh.position.set(0, 0.85, 0);
  drumMesh.castShadow = true;
  roaster.add(drumMesh);

  // 2. Front polished chrome faceplate
  const facePlate = new THREE.Mesh(new THREE.CylinderGeometry(0.49, 0.49, 0.06, 24), chromeMat);
  facePlate.rotation.z = Math.PI / 2;
  facePlate.position.set(-0.56, 0.85, 0);
  roaster.add(facePlate);

  // 3. Green bean loading hopper on top
  const hopper = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.5, 24, 1, true), chromeMat);
  hopper.position.set(-0.25, 1.65, 0);
  const hopperNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.25, 16), chromeMat);
  hopperNeck.position.set(-0.25, 1.35, 0);
  roaster.add(hopper, hopperNeck);

  // 4. Circular cooling tray with roasted beans
  const coolingTray = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.35, 32), castIronMat);
  coolingTray.position.set(-1.1, 0.42, 0);
  coolingTray.castShadow = true;
  roaster.add(coolingTray);

  const beanBed = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.05, 32), roastedBeanMat);
  beanBed.position.set(-1.1, 0.55, 0);
  roaster.add(beanBed);

  // 5. Motorized Agitator Arms inside cooling tray (ANIMATED!)
  const agitatorGroup = new THREE.Group();
  agitatorGroup.position.set(-1.1, 0.6, 0);

  const agitatorHub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16), chromeMat);
  agitatorGroup.add(agitatorHub);

  for (let a = 0; a < 3; a++) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.02), stainlessMat);
    arm.rotation.y = (a * Math.PI * 2) / 3;
    arm.position.x = Math.cos((a * Math.PI * 2) / 3) * 0.28;
    arm.position.z = Math.sin((a * Math.PI * 2) / 3) * 0.28;
    agitatorGroup.add(arm);
  }
  roaster.add(agitatorGroup);

  // 6. Exhaust Chimney Ducts (Loops upward into ceiling)
  const exhaustPipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.8, 16), stainlessMat);
  exhaustPipe1.position.set(0.45, 1.8, 0);
  roaster.add(exhaustPipe1);

  const exhaustElbow = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.14, 12, 16, Math.PI / 2), stainlessMat);
  exhaustElbow.position.set(0.45, 2.7, 0.3);
  exhaustElbow.rotation.y = -Math.PI / 2;
  roaster.add(exhaustElbow);

  // 7. Cyclone chaff collector tower
  const cyclone = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.12, 1.2, 16), castIronMat);
  cyclone.position.set(0.9, 0.9, 0.5);
  roaster.add(cyclone);

  // 8. Digital Control Terminal on articulated arm
  const armPivot = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), blackSteelMat);
  armPivot.position.set(-0.7, 1.1, -0.4);
  const touchScreen = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.22, 0.03), new THREE.MeshBasicMaterial({
    map: getLaptopScreenTexture('chart'), // RoR temperature roast curve!
  }));
  touchScreen.position.set(-0.7, 1.35, -0.4);
  touchScreen.rotation.y = 0.5;
  roaster.add(armPivot, touchScreen);

  roasterZoneGroup.add(roaster);

  // Warm Roaster Lab Work Light
  const roasterLight = new THREE.PointLight(0xffb86c, 1.8, 6.0);
  roasterLight.position.set(3.5, 2.6, -6.8);
  sceneGroup.add(roasterLight);
  pointLights.push(roasterLight);

  // "GREEN BEAN 18°C" Glass Cellar Room (Images 4, 7, 8, 11)
  // Location: X: 4.8 to 7.2, Z: -11.2 to -8.6
  const greenBeanRoom = new THREE.Group();
  greenBeanRoom.position.set(5.8, 0, -9.8);

  // Fluted glass walls and door
  const gbGlassFront = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 0.04), flutedGlassMat);
  gbGlassFront.position.set(0, 1.6, 1.4);
  const gbGlassSide = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.2, 2.8), flutedGlassMat);
  gbGlassSide.position.set(-1.2, 1.6, 0);
  greenBeanRoom.add(gbGlassFront, gbGlassSide);

  // Wooden shipping pallets
  const palletMat = new THREE.MeshStandardMaterial({ color: 0x8a7050, roughness: 0.85 });
  for (let pz of [-0.6, 0.6]) {
    const pallet = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 1.0), palletMat);
    pallet.position.set(0.1, 0.06, pz);
    greenBeanRoom.add(pallet);
  }

  // 12 Stacked Burlap Coffee Sacks with custom stencil stamp!
  const burlapTex = getBurlapSackTexture('CHROME & BEAN');
  const sackMat = new THREE.MeshStandardMaterial({
    color: 0x9e896b,
    roughness: 0.95,
    metalness: 0.02,
    map: burlapTex,
  });

  const sackGeo = new THREE.BoxGeometry(0.7, 0.22, 0.42);
  const sackCoords = [
    [-0.3, 0.22, -0.6, 0.08],
    [0.4, 0.22, -0.6, -0.05],
    [0.0, 0.42, -0.6, 0.02],
    [-0.3, 0.22, 0.6, 0.12],
    [0.4, 0.22, 0.6, -0.09],
    [0.1, 0.42, 0.6, 0.0],
    [-0.2, 0.62, 0.6, 0.05],
    [0.3, 0.62, -0.6, -0.03],
    [0.0, 0.82, -0.6, 0.04],
  ];

  sackCoords.forEach(([sx, sy, sz, rot]) => {
    const sack = new THREE.Mesh(sackGeo, sackMat);
    sack.position.set(sx, sy, sz);
    sack.rotation.y = rot;
    sack.castShadow = true;
    greenBeanRoom.add(sack);
  });

  // Green Bean Room Signage "GREEN BEAN 18°C"
  const gbSign = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.2), new THREE.MeshBasicMaterial({
    color: 0x111111,
  }));
  gbSign.position.set(0, 2.2, 1.44);

  // Digital climate sensor monitor (18.2°C • 58% RH)
  const climateMonitor = new THREE.Mesh(
    new THREE.PlaneGeometry(0.65, 0.25),
    new THREE.MeshBasicMaterial({ map: getCellarClimateTexture() })
  );
  climateMonitor.position.set(0, 1.85, 1.44);

  // Wall-mounted Air Conditioner Split Unit (Photo 4)
  const acUnit = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.32, 0.24), porcelainMat);
  acUnit.position.set(0, 2.7, -1.2);
  greenBeanRoom.add(gbSign, climateMonitor, acUnit);

  // Coffee Cupping & Quality Control Workbench (Photo 4)
  const cuppingBench = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.85, 0.7), stainlessMat);
  cuppingBench.position.set(0.6, 0.42, 2.2);
  greenBeanRoom.add(cuppingBench);

  // Precision Acaia scale and 4 ceramic cupping bowls
  const acaiaScale = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.18), blackSteelMat);
  acaiaScale.position.set(0.2, 0.86, 2.2);
  greenBeanRoom.add(acaiaScale);
  for (let ci = 0; ci < 4; ci++) {
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.05, 16), porcelainMat);
    bowl.position.set(0.6 + ci * 0.16, 0.88, 2.2);
    greenBeanRoom.add(bowl);
  }

  sceneGroup.add(greenBeanRoom);
  sceneGroup.add(roasterZoneGroup);

  hotspotTargets.push({
    id: 'roastery_lab',
    name: 'Coffee Roastery & Green Bean Lab',
    position: new THREE.Vector3(3.8, 1.5, -6.8),
  });

  // Retail Coffee Bean Display Shelves (Back wall shelves in Image 4, 7, 11)
  const retailShelf = new THREE.Group();
  retailShelf.position.set(1.5, 0, -11.0);
  for (let sy = 0.6; sy <= 2.6; sy += 0.5) {
    const shelfBoard = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.35), blackSteelMat);
    shelfBoard.position.set(0, sy, 0);
    retailShelf.add(shelfBoard);

    // Coffee bags & jars
    for (let bx = -1.0; bx <= 1.0; bx += 0.32) {
      if (Math.random() > 0.2) {
        const bag = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.1), sackMat);
        bag.position.set(bx, sy + 0.12, 0);
        retailShelf.add(bag);
      } else {
        const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.18, 16), clearGlassMat);
        jar.position.set(bx, sy + 0.09, 0);
        retailShelf.add(jar);
      }
    }
  }
  sceneGroup.add(retailShelf);

  // ==========================================
  // 5. ZONE 3: COMMUNAL COWORKING LONG DESK (Images 4, 5, 7, 8, 9)
  // ==========================================
  // Massive smoked dark oak wood table running along the front glass window
  // Dimensions: L: 8.8, W: 1.5, H: 0.78, Position: X: -6.8, Z: 3.6
  const coworkGroup = new THREE.Group();
  coworkGroup.name = 'Zone_Coworking';
  coworkGroup.position.set(-6.8, 0, 3.6);

  // Thick solid dark oak tabletop
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.08, 1.5), woodOakMat);
  tableTop.position.set(0, 0.74, 0);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  coworkGroup.add(tableTop);

  // Heavy steel trestle legs
  for (let lx of [-3.8, 0, 3.8]) {
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 1.3), blackSteelMat);
    legL.position.set(lx, 0.35, 0);
    legL.castShadow = true;
    coworkGroup.add(legL);
  }

  // Recessed Flush Power Box Modules with AC Outlets (Image 5)
  for (let px of [-2.6, -0.9, 0.9, 2.6]) {
    const powerBox = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.18), blackSteelMat);
    powerBox.position.set(px, 0.79, 0);
    coworkGroup.add(powerBox);
  }

  // Laptops (MacBooks open on the table)
  const laptopPositions = [
    [-3.2, 0.35, -0.3, 'code'],
    [-1.8, -0.35, 0.2, 'chart'],
    [0.2, 0.35, -0.2, 'code'],
    [1.8, -0.35, 0.3, 'cad'],
    [3.2, 0.35, -0.1, 'code'],
  ];

  laptopPositions.forEach(([lx, lz, rotY, screenType]) => {
    const laptop = new THREE.Group();
    laptop.position.set(lx as number, 0.78, lz as number);
    laptop.rotation.y = rotY as number;

    // Base keyboard unibody
    const lBase = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.015, 0.26), stainlessMat);
    lBase.position.set(0, 0.008, 0);

    // Open Screen lid tilted back
    const lScreenLid = new THREE.Group();
    lScreenLid.position.set(0, 0.015, -0.13);
    lScreenLid.rotation.x = 0.35; // 110 degrees open

    const lBack = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.24, 0.01), stainlessMat);
    lBack.position.set(0, 0.12, 0);

    const lDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(0.34, 0.22),
      new THREE.MeshBasicMaterial({
        map: getLaptopScreenTexture(screenType as 'code' | 'chart' | 'cad'),
      })
    );
    lDisplay.position.set(0, 0.12, 0.006);

    lScreenLid.add(lBack, lDisplay);
    laptop.add(lBase, lScreenLid);
    coworkGroup.add(laptop);

    // Ceramic Coffee cup with Latte Art Crema
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.08, 16), porcelainMat);
    mug.position.set((lx as number) + 0.32, 0.82, (lz as number) + 0.08);
    const crema = new THREE.Mesh(new THREE.CircleGeometry(0.042, 16), new THREE.MeshBasicMaterial({ map: getLatteArtTexture() }));
    crema.rotation.x = -Math.PI / 2;
    crema.position.set((lx as number) + 0.32, 0.862, (lz as number) + 0.08);

    // Smartphone lying on table
    const phone = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.008, 0.16), blackSteelMat);
    phone.position.set((lx as number) - 0.28, 0.785, (lz as number) + 0.15);
    phone.rotation.y = (Math.random() - 0.5) * 0.4;

    // Hardcover Moleskine Notebook
    const notebook = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.018, 0.24), blackSteelMat);
    notebook.position.set((lx as number) + 0.28, 0.79, (lz as number) - 0.2);
    notebook.rotation.y = (Math.random() - 0.5) * 0.3;

    coworkGroup.add(mug, crema, phone, notebook);
  });

  // Black Minimalist Chairs along both sides of table (10 chairs)
  for (let side of [-0.95, 0.95]) {
    for (let cx of [-3.4, -1.7, 0, 1.7, 3.4]) {
      const chair = new THREE.Group();
      chair.position.set(cx, 0, side);
      chair.rotation.y = side > 0 ? Math.PI : 0;

      // Seat
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.44), blackSteelMat);
      seat.position.set(0, 0.46, 0);
      // Backrest
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.35, 0.04), blackSteelMat);
      back.position.set(0, 0.72, -0.2);
      // Legs
      for (let legX of [-0.18, 0.18]) {
        for (let legZ of [-0.18, 0.18]) {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.012, 0.46, 8), blackSteelMat);
          leg.position.set(legX, 0.23, legZ);
          chair.add(leg);
        }
      }
      chair.add(seat, back);
      coworkGroup.add(chair);
    }
  }

  // 7 Chrome Dome Pendant Lamps hanging above the table (Exact matching Image 5)
  for (let px of [-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6]) {
    const pendant = new THREE.Group();
    pendant.position.set(px, 2.6, 0);

    // Cable
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 1.4, 6), blackSteelMat);
    cable.position.set(0, 0.7, 0);

    // Chrome hemispherical dome shade
    const shade = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      chromeMat
    );
    shade.rotation.x = Math.PI;
    shade.position.set(0, 0, 0);

    // Warm glowing bulb
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), warmLedMat);
    bulb.position.set(0, -0.05, 0);

    pendant.add(cable, shade, bulb);
    coworkGroup.add(pendant);

    // Local warm spot light pooling on table
    const pendantLight = new THREE.SpotLight(0xffe4b5, 1.8, 4.5, Math.PI / 4, 0.5, 1.2);
    pendantLight.position.set(-6.8 + px, 2.5, 3.6);
    pendantLight.target = tableTop;
    sceneGroup.add(pendantLight);
    spotLights.push(pendantLight);
  }

  sceneGroup.add(coworkGroup);

  hotspotTargets.push({
    id: 'coworking_table',
    name: 'Smoked Oak Coworking Hub',
    position: new THREE.Vector3(-6.8, 1.2, 3.6),
  });

  // ==========================================
  // 6. ZONE 4: EVENING LOUNGE & DINING TABLES (Images 7, 8, 11)
  // ==========================================
  const loungeGroup = new THREE.Group();
  loungeGroup.name = 'Zone_Lounge';
  loungeGroup.position.set(-5.6, 0, -4.5);

  // Modular Deep Sectional Sofa in Charcoal Fabric
  // U-shape / L-shape sofa modules
  const sofaModules = [
    [-1.6, 0.22, 0, 1.2, 0.44, 1.0],
    [-0.4, 0.22, 0, 1.2, 0.44, 1.0],
    [0.8, 0.22, 0, 1.2, 0.44, 1.0],
    [0.8, 0.22, -1.1, 1.0, 0.44, 1.2],
    [0.8, 0.22, -2.2, 1.0, 0.44, 1.0],
  ];

  sofaModules.forEach(([sx, sy, sz, w, h, d]) => {
    const cushion = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), fabricSofaMat);
    cushion.position.set(sx, sy, sz);
    cushion.castShadow = true;
    loungeGroup.add(cushion);
  });

  // Low dark oak coffee table in front of sofa
  const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 0.8), woodOakMat);
  coffeeTable.position.set(-0.4, 0.18, -1.1);
  loungeGroup.add(coffeeTable);

  // Wine glasses & cups on coffee table
  for (let i of [-0.4, 0.2]) {
    const wineGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.16, 12), clearGlassMat);
    wineGlass.position.set(-0.4 + i, 0.43, -1.1);
    loungeGroup.add(wineGlass);
  }

  // Dining Tables with candlelit settings (Images 7, 8, 11)
  const diningTablePositions = [
    [-3.8, -1.2],
    [-3.8, -3.2],
    [-1.6, -7.8],
    [0.4, -7.8],
  ];

  diningTablePositions.forEach(([dx, dz]) => {
    const table = new THREE.Group();
    table.position.set(dx, 0, dz);

    const dTop = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 1.0), woodOakMat);
    dTop.position.set(0, 0.74, 0);
    const dLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.72, 12), blackSteelMat);
    dLeg.position.set(0, 0.36, 0);
    const dBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.03, 16), blackSteelMat);
    dBase.position.set(0, 0.015, 0);
    table.add(dTop, dLeg, dBase);

    // Table settings: plates, wine glasses, candle jar
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.02, 16), porcelainMat);
    plate.position.set(0, 0.78, 0.2);
    const candleJar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.09, 12), new THREE.MeshPhysicalMaterial({
      color: 0xffaa44,
      transmission: 0.8,
      roughness: 0.2,
    }));
    candleJar.position.set(0, 0.81, 0);
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), warmLedMat);
    flame.position.set(0, 0.85, 0);

    table.add(plate, candleJar, flame);

    // 2 Dining chairs
    for (let side of [-0.65, 0.65]) {
      const dChair = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.42), blackSteelMat);
      dChair.position.set(0, 0.22, side);
      table.add(dChair);
    }

    sceneGroup.add(table);

    // Warm candle flicker light
    const candleLight = new THREE.PointLight(0xff9d42, 0.8, 2.5);
    candleLight.position.set(dx, 0.9, dz);
    sceneGroup.add(candleLight);
    pointLights.push(candleLight);
  });

  // Tall potted plants (Monstera deliciosa & Ficus)
  const plantPositions = [
    [-6.2, 0, -2.2],
    [-3.0, 0, -5.8],
    [2.8, 0, -4.6],
  ];

  plantPositions.forEach(([px, py, pz]) => {
    const plantGroup = new THREE.Group();
    plantGroup.position.set(px, py, pz);

    // Concrete cylindrical planter
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.3, 0.7, 24), floorInteriorMat);
    pot.position.set(0, 0.35, 0);
    pot.castShadow = true;
    plantGroup.add(pot);

    // Soil
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.05, 16), castIronMat);
    soil.position.set(0, 0.68, 0);
    plantGroup.add(soil);

    // Broad Monstera leaves
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x1e4620,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    for (let l = 0; l < 8; l++) {
      const angle = (l / 8) * Math.PI * 2;
      const leafStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8, 8), leafMat);
      leafStem.position.set(Math.cos(angle) * 0.15, 0.9, Math.sin(angle) * 0.15);
      leafStem.rotation.z = Math.cos(angle) * 0.5;
      leafStem.rotation.x = Math.sin(angle) * 0.5;

      const leafBlade = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), leafMat);
      leafBlade.scale.set(1.2, 0.04, 0.7);
      leafBlade.position.set(Math.cos(angle) * 0.4, 1.25, Math.sin(angle) * 0.4);
      leafBlade.rotation.y = angle;
      plantGroup.add(leafStem, leafBlade);
    }

    sceneGroup.add(plantGroup);
  });

  sceneGroup.add(loungeGroup);

  hotspotTargets.push({
    id: 'lounge_dining',
    name: 'Evening Lounge & Dining',
    position: new THREE.Vector3(-4.8, 1.2, -4.5),
  });

  // ==========================================
  // 7. ZONE 5: RESTROOM / WC CORRIDOR (Images 4, 10)
  // ==========================================
  const wcGroup = new THREE.Group();
  wcGroup.name = 'Zone_Restroom';
  wcGroup.position.set(-9.4, 0, -9.0);

  // Partition walls
  const wcWall = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.4, 0.15), wallMat);
  wcWall.position.set(0, 1.7, 0);
  wcGroup.add(wcWall);

  // 3 Dark stall cubicle doors with indicators (Image 10)
  for (let dx of [-1.8, -0.6, 0.6]) {
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.6, 0.06), blackSteelMat);
    door.position.set(dx, 1.3, 0.1);

    // Indicator lock (Green / Red LED)
    const ind = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.02), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
    ind.position.set(dx + 0.38, 1.25, 0.14);

    // Chrome door handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.15, 8), chromeMat);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(dx + 0.35, 1.15, 0.15);

    wcGroup.add(door, ind, handle);
  }

  // Floating concrete washbasin counter
  const vanity = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 0.65), floorInteriorMat);
  vanity.position.set(0.6, 0.85, -1.4);
  wcGroup.add(vanity);

  // 2 Cylindrical metal vessel wash basins (Image 10)
  for (let bx of [0.0, 1.2]) {
    const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 24, 1, true), castIronMat);
    basin.position.set(bx, 1.05, -1.4);
    // Wall mount faucet
    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.2, 8), blackSteelMat);
    faucet.rotation.x = Math.PI / 2;
    faucet.position.set(bx, 1.22, -1.7);
    wcGroup.add(basin, faucet);

    // Tall LED backlit mirror
    const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.1, 0.04), chromeMat);
    mirror.position.set(bx, 1.9, -1.75);
    const mirrorBacklight = new THREE.Mesh(new THREE.BoxGeometry(0.58, 1.14, 0.02), warmLedMat);
    mirrorBacklight.position.set(bx, 1.9, -1.77);
    wcGroup.add(mirror, mirrorBacklight);
  }

  // Warm cove lighting for WC
  const wcLight = new THREE.PointLight(0xffd8a8, 1.2, 4.0);
  wcLight.position.set(-9.0, 2.8, -9.8);
  sceneGroup.add(wcLight);
  pointLights.push(wcLight);

  sceneGroup.add(wcGroup);

  // ==========================================
  // 8. ZONE 6: COMMERCIAL PREP KITCHEN (Images 3, 4)
  // ==========================================
  const kitchenGroup = new THREE.Group();
  kitchenGroup.name = 'Zone_Kitchen';
  kitchenGroup.position.set(-6.8, 0, -10.2);

  // Chef prep line stainless counters
  const kitchenCounter = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.9, 0.85), stainlessMat);
  kitchenCounter.position.set(0, 0.45, 0);
  kitchenCounter.castShadow = true;
  kitchenGroup.add(kitchenCounter);

  // Commercial 4-Burner Gas Range with Blue/Orange flame
  const stoveTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.8), castIronMat);
  stoveTop.position.set(-1.2, 0.92, 0);
  kitchenGroup.add(stoveTop);

  for (let bx of [-1.5, -0.9]) {
    for (let bz of [-0.2, 0.2]) {
      const burner = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.018, 8, 16), castIronMat);
      burner.rotation.x = Math.PI / 2;
      burner.position.set(bx, 0.95, bz);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
      flame.scale.set(1, 0.3, 1);
      flame.position.set(bx, 0.96, bz);
      kitchenGroup.add(burner, flame);
    }
  }

  // Stainless Steel Ventilation Hood above stove (Image 3)
  const ventHood = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.6, 1.1), stainlessMat);
  ventHood.position.set(0, 2.5, 0);
  kitchenGroup.add(ventHood);

  // Gastro containers with fresh garnish & plates
  for (let gx of [0.4, 0.8, 1.2, 1.6]) {
    const gn = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.38), stainlessMat);
    gn.position.set(gx, 0.95, 0);
    const herbs = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.34), new THREE.MeshStandardMaterial({ color: 0x2e7d32 }));
    herbs.position.set(gx, 0.98, 0);
    kitchenGroup.add(gn, herbs);
  }

  // Linear Stainless Trench Floor Drain (Photo 3)
  const trenchDrainTex = getTrenchDrainTexture();
  const kitchenDrain = new THREE.Mesh(
    new THREE.PlaneGeometry(0.3, 3.8),
    new THREE.MeshStandardMaterial({ map: trenchDrainTex, roughness: 0.3, metalness: 0.8 })
  );
  kitchenDrain.rotation.x = -Math.PI / 2;
  kitchenDrain.position.set(0, 0.12, 1.2);
  kitchenGroup.add(kitchenDrain);

  // Stack of 16 white ceramic dinner plates on the pass
  for (let py = 0; py < 16; py++) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.018, 16), porcelainMat);
    p.position.set(-0.2, 0.95 + py * 0.018, 0);
    kitchenGroup.add(p);
  }

  // Magnetic wall knife strip with 5 chef knives (Photo 3)
  const knifeStrip = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.02), blackSteelMat);
  knifeStrip.position.set(-1.2, 1.8, -0.42);
  kitchenGroup.add(knifeStrip);
  for (let k = 0; k < 5; k++) {
    const knifeBlade = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.22 - k * 0.02, 0.005), chromeMat);
    knifeBlade.position.set(-1.6 + k * 0.2, 1.7, -0.4);
    const knifeHandle = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.09, 0.015), blackSteelMat);
    knifeHandle.position.set(-1.6 + k * 0.2, 1.85, -0.4);
    kitchenGroup.add(knifeBlade, knifeHandle);
  }

  // High-speed commercial blender (Vitamix style)
  const blenderBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.18), blackSteelMat);
  blenderBase.position.set(-2.0, 1.0, 0);
  const blenderJar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.26, 12), clearGlassMat);
  blenderJar.position.set(-2.0, 1.21, 0);
  kitchenGroup.add(blenderBase, blenderJar);

  // Sauté Pan on the front burner
  const pan = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.05, 16), castIronMat);
  pan.position.set(-0.9, 0.97, 0.2);
  const panHandle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.22), castIronMat);
  panHandle.position.set(-0.9, 0.99, 0.33);
  kitchenGroup.add(pan, panHandle);

  sceneGroup.add(kitchenGroup);

  // ==========================================
  // 9. ZONE 7: OUTDOOR TERRACE & STREET (Images 2, 6, 7, 12)
  // ==========================================
  const terraceGroup = new THREE.Group();
  terraceGroup.name = 'Zone_Terrace';
  terraceGroup.position.set(-7.2, 0, 9.8);

  // Black Retractable Fabric Canopy / Awning (Images 2, 6)
  const awningMat = new THREE.MeshStandardMaterial({ color: 0x1b1c1e, roughness: 0.9, side: THREE.DoubleSide });
  const awning = new THREE.Mesh(new THREE.PlaneGeometry(10.2, 3.8), awningMat);
  awning.rotation.x = -Math.PI / 2 - 0.22;
  awning.position.set(0, 3.8, -0.6);
  terraceGroup.add(awning);

  // Awning steel support arms
  for (let ax of [-4.8, 0, 4.8]) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.6, 8), blackSteelMat);
    arm.rotation.x = 1.35;
    arm.position.set(ax, 3.2, -0.5);
    terraceGroup.add(arm);
  }

  // Suspended String Lights Garland (Images 2, 7)
  // Warm glowing Edison bulbs beneath awning
  for (let gx = -4.5; gx <= 4.5; gx += 0.9) {
    const bulbDrop = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.25, 6), blackSteelMat);
    bulbDrop.position.set(gx, 3.0, 0.2);
    const bulbSphere = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), warmLedMat);
    bulbSphere.position.set(gx, 2.85, 0.2);
    terraceGroup.add(bulbDrop, bulbSphere);
  }

  // String Light soft ambient light
  const garlandLight = new THREE.PointLight(0xffd699, 2.4, 9.0);
  garlandLight.position.set(-7.2, 3.0, 10.0);
  sceneGroup.add(garlandLight);
  pointLights.push(garlandLight);

  // Outdoor Dining Tables & Wire Chairs with Plaid Blankets (Images 2, 6, 7)
  const plaidTex = getPlaidFabricTexture();
  const plaidMat = new THREE.MeshStandardMaterial({ map: plaidTex, roughness: 0.95 });
  const redWineMat = new THREE.MeshPhysicalMaterial({ color: 0x660011, transmission: 0.8, roughness: 0.1 });

  const outdoorTableSpots = [
    [-3.8, -0.2],
    [-1.2, -0.2],
    [1.4, -0.2],
    [3.8, -0.2],
  ];

  outdoorTableSpots.forEach(([tx, tz]) => {
    const oTable = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.9), woodOakMat);
    oTable.position.set(tx, 0.74, tz);
    const oLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.72, 8), blackSteelMat);
    oLeg.position.set(tx, 0.36, tz);
    const oBase = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.02, 0.45), blackSteelMat);
    oBase.position.set(tx, 0.01, tz);
    terraceGroup.add(oTable, oLeg, oBase);

    // Wine glasses with ruby red wine reflections
    const wineGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.14, 12), clearGlassMat);
    wineGlass.position.set(tx + 0.15, 0.83, tz - 0.15);
    const wineLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.06, 12), redWineMat);
    wineLiquid.position.set(tx + 0.15, 0.81, tz - 0.15);
    terraceGroup.add(wineGlass, wineLiquid);

    // Folded napkin with cutlery
    const napkin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.01, 0.2), porcelainMat);
    napkin.position.set(tx - 0.18, 0.77, tz + 0.1);
    terraceGroup.add(napkin);

    // 2 Wire Chairs per table, one with a cozy draped Plaid Blanket (Photo 2)
    for (let side of [-0.65, 0.65]) {
      const chair = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.42), blackSteelMat);
      chair.position.set(tx, 0.22, tz + side);
      terraceGroup.add(chair);

      if (side > 0) {
        // Folded plaid blanket draped over chair back
        const blanket = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.06), plaidMat);
        blanket.position.set(tx, 0.42, tz + side + 0.08);
        terraceGroup.add(blanket);
      }
    }
  });

  // Modern Urban Street Lamp Post (Photo 2, 12)
  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 5.2, 12), blackSteelMat);
  lampPole.position.set(-6.8, 2.6, 3.8);
  const lampArm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.06), blackSteelMat);
  lampArm.position.set(-6.4, 5.1, 3.8);
  const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.24), chromeMat);
  lampHead.position.set(-6.0, 5.0, 3.8);
  const lampLight = new THREE.PointLight(0xffe6c2, 2.0, 8.0);
  lampLight.position.set(-6.0, 4.8, 3.8);
  terraceGroup.add(lampPole, lampArm, lampHead, lampLight);
  pointLights.push(lampLight);

  // 2 Commercial Glass Pyramid Patio Gas Heaters with glowing flame inside! (Images 2, 12)
  for (let hx of [-4.8, 3.0]) {
    const heater = new THREE.Group();
    heater.position.set(hx, 0, 1.4);

    // Lower metal housing
    const baseBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), blackSteelMat);
    baseBox.position.set(0, 0.4, 0);

    // 4 Corner aluminum rails
    for (let rx of [-0.22, 0.22]) {
      for (let rz of [-0.22, 0.22]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.4, 0.03), chromeMat);
        rail.position.set(rx, 1.5, rz);
        heater.add(rail);
      }
    }

    // Glass flame tube
    const glassTube = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.3, 16), clearGlassMat);
    glassTube.position.set(0, 1.5, 0);

    // Glowing dancing flame mesh (ANIMATED in render loop)
    const flameMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.015, 0.9, 12),
      new THREE.MeshBasicMaterial({ color: 0xff6600 })
    );
    flameMesh.position.set(0, 1.45, 0);
    patioFlames.push(flameMesh);

    // Top pyramid reflector cap
    const topCap = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.2, 4), chromeMat);
    topCap.rotation.y = Math.PI / 4;
    topCap.position.set(0, 2.3, 0);

    heater.add(baseBox, glassTube, flameMesh, topCap);
    terraceGroup.add(heater);

    // Warm orange light emitted by patio heater
    const heaterLight = new THREE.PointLight(0xff6600, 2.0, 5.0);
    heaterLight.position.set(hx, 1.5, 1.4);
    terraceGroup.add(heaterLight);
    pointLights.push(heaterLight);
  }

  // Planter boxes dividing sidewalk from street (Image 2, 12)
  for (let bx of [-4.5, -1.5, 1.5, 4.5]) {
    const planterBox = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.6, 0.5), blackSteelMat);
    planterBox.position.set(bx, 0.3, 2.5);

    // Lush trimmed green hedge inside
    const hedge = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.45, 0.42), new THREE.MeshStandardMaterial({
      color: 0x1f4722,
      roughness: 0.9,
    }));
    hedge.position.set(bx, 0.7, 2.5);
    terraceGroup.add(planterBox, hedge);
  }

  sceneGroup.add(terraceGroup);

  hotspotTargets.push({
    id: 'outdoor_terrace',
    name: 'Outdoor Patio & Awning',
    position: new THREE.Vector3(-7.2, 1.4, 9.8),
  });

  // ==========================================
  // 10. PARKED MODERN CARS & STREET (Images 2, 7, 12)
  // ==========================================
  // Procedural modern sedans / SUVs in parking bays
  function createCar(colorHex: number): THREE.Group {
    const car = new THREE.Group();

    // Car Body (Primary silhouette)
    const carMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      metalness: 0.85,
      roughness: 0.18,
    });

    const lowerHull = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.55, 4.4), carMat);
    lowerHull.position.set(0, 0.5, 0);
    lowerHull.castShadow = true;

    // Cabin & Glass (Secondary read)
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.5, 2.4), carMat);
    cabin.position.set(0, 1.0, -0.2);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.46, 2.3), new THREE.MeshPhysicalMaterial({
      color: 0x11161f,
      roughness: 0.05,
      metalness: 0.9,
    }));
    windshield.position.set(0, 1.0, -0.2);

    car.add(lowerHull, cabin, windshield);

    // 4 Wheels
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });

    const wheelCoords = [
      [-1.05, 0.35, 1.3],
      [1.05, 0.35, 1.3],
      [-1.05, 0.35, -1.3],
      [1.05, 0.35, -1.3],
    ];

    wheelCoords.forEach(([wx, wy, wz]) => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.24, 16), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(wx, wy, wz);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.25, 12), rimMat);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(wx, wy, wz);
      car.add(tire, rim);
    });

    // Headlights (Cool White LED)
    const hLeft = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.1, 0.05), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    hLeft.position.set(-0.7, 0.55, 2.2);
    const hRight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.1, 0.05), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    hRight.position.set(0.7, 0.55, 2.2);

    // Taillights (Red LED)
    const tLeft = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.05), new THREE.MeshBasicMaterial({ color: 0xff1122 }));
    tLeft.position.set(-0.7, 0.6, -2.2);
    const tRight = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.05), new THREE.MeshBasicMaterial({ color: 0xff1122 }));
    tRight.position.set(0.7, 0.6, -2.2);

    car.add(hLeft, hRight, tLeft, tRight);
    carLights.push(hLeft, hRight, tLeft, tRight);
    return car;
  }

  // Place 4 parked cars on the parking lot (Image 7, 12)
  const carColors = [0x1f2429, 0x3d4349, 0x8a929a, 0x16181b]; // Dark luxury tones matching renders
  const carPositions: [number, number, number, number][] = [
    [16.5, 0, -11.5, 0],
    [16.5, 0, -7.0, 0],
    [16.5, 0, -2.5, 0],
    [16.5, 0, 2.0, 0],
  ];

  carPositions.forEach(([cx, cy, cz, rotY], idx) => {
    const car = createCar(carColors[idx % carColors.length]);
    car.position.set(cx, cy, cz);
    car.rotation.y = rotY;
    sceneGroup.add(car);
  });

  // Street trees with circular cast iron grates (Image 12)
  for (let tz of [-8, 6]) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(-15, 0, tz);

    // Tree grate
    const grate = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.04, 24), castIronMat);
    grate.position.set(0, 0.02, 0);

    // Tree trunk
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 3.8, 12), woodOakMat);
    trunk.position.set(0, 1.9, 0);

    // Foliage canopy (layered spheres)
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1b381e, roughness: 0.9 });
    for (let f = 0; f < 3; f++) {
      const crown = new THREE.Mesh(new THREE.SphereGeometry(1.2 - f * 0.2, 12, 12), foliageMat);
      crown.position.set(0, 3.4 + f * 0.8, 0);
      treeGroup.add(crown);
    }

    treeGroup.add(grate, trunk);
    sceneGroup.add(treeGroup);
  }

  // Steam particle generator (for roaster exhaust and espresso machine)
  const particleCount = 60;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = 4.85 + (Math.random() - 0.5) * 0.3;
    positions[i * 3 + 1] = 2.8 + Math.random() * 1.5;
    positions[i * 3 + 2] = -6.5 + (Math.random() - 0.5) * 0.3;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xcccccc,
    size: 0.12,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const steamParticles = new THREE.Points(particleGeo, particleMat);
  sceneGroup.add(steamParticles);

  return {
    sceneGroup,
    cutawayGroup,
    animatedObjects: {
      roasterAgitator: agitatorGroup,
      patioFlames,
      carLights,
      steamParticles,
    },
    pointLights,
    spotLights,
    hotspotTargets,
  };
}
