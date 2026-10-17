import React, { useEffect, useRef, useState } from 'react';
import { CafeScene, CAMERA_PRESETS } from './three/CafeScene';
import { CameraPreset, LightingMode, CutawayMode } from './types/cafe';
import { TopHeader } from './components/TopHeader';
import { BottomDock } from './components/BottomDock';
import { ZoneDetailsModal } from './components/ZoneDetailsModal';
import { cafeAudio } from './three/audioEngine';
import { Check } from 'lucide-react';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const sceneInstanceRef = useRef<CafeScene | null>(null);

  const [currentPreset, setCurrentPreset] = useState<CameraPreset>(CAMERA_PRESETS[0]);
  const [lightingMode, setLightingMode] = useState<LightingMode>('dusk');
  const [cutawayMode, setCutawayMode] = useState<CutawayMode>('cutaway');
  const [agitatorSpeed, setAgitatorSpeed] = useState<number>(1.0);
  const [fps, setFps] = useState<number>(60);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTourActive, setIsTourActive] = useState<boolean>(false);

  // Initialize Three.js scene once
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const scene = new CafeScene(canvasMountRef.current);
    sceneInstanceRef.current = scene;

    scene.setOnFpsUpdate((newFps) => {
      setFps(newFps);
    });

    scene.setOnPresetChange((preset) => {
      setCurrentPreset(preset);
    });

    scene.setOnHotspotClick((hotspotId) => {
      const found = CAMERA_PRESETS.find((p) => p.id === hotspotId);
      if (found) {
        setCurrentPreset(found);
      }
    });

    return () => {
      scene.dispose();
      sceneInstanceRef.current = null;
    };
  }, []);

  const handleSelectPreset = (preset: CameraPreset) => {
    setCurrentPreset(preset);
    sceneInstanceRef.current?.setCameraPreset(preset);
  };

  const handleSelectLighting = (mode: LightingMode) => {
    setLightingMode(mode);
    sceneInstanceRef.current?.setLightingMode(mode);
  };

  const handleSelectCutaway = (mode: CutawayMode) => {
    setCutawayMode(mode);
    sceneInstanceRef.current?.setCutawayMode(mode);
  };

  const handleAgitatorSpeedChange = (speed: number) => {
    setAgitatorSpeed(speed);
    sceneInstanceRef.current?.setAgitatorSpeed(speed);
  };

  const handleEspressoHiss = () => {
    cafeAudio.playEspressoSteamSound();
    showToast('Сброс пара эспрессо-группы La Marzocco (9 BAR)');
  };

  const handleTakeScreenshot = () => {
    if (!sceneInstanceRef.current) return;
    const dataUrl = sceneInstanceRef.current.captureScreenshot();

    // Trigger instant browser download
    const link = document.createElement('a');
    link.download = `CHROME_AND_BEAN_3D_${currentPreset.id}_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    showToast('Снимок 3D сцены успешно сохранен!');
  };

  const handleToggleTour = () => {
    if (!sceneInstanceRef.current) return;
    const active = sceneInstanceRef.current.toggleTour();
    setIsTourActive(active);
    showToast(active ? 'Запущен кинематографичный авто-тур по кофейне' : 'Авто-тур остановлен');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 font-['Inter',sans-serif]">
      {/* 3D WebGL Canvas Container - Isolated from React HUD updates */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Header */}
      <TopHeader
        currentPreset={currentPreset}
        fps={fps}
        lightingMode={lightingMode}
        onLightingChange={handleSelectLighting}
        onTakeScreenshot={handleTakeScreenshot}
        onOpenZoneDetails={() => setIsDetailsModalOpen(true)}
        onEspressoHiss={handleEspressoHiss}
        isTourActive={isTourActive}
        onToggleTour={handleToggleTour}
      />

      {/* Collapsible Ergonomic Bottom Dock */}
      <BottomDock
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        lightingMode={lightingMode}
        onSelectLighting={handleSelectLighting}
        cutawayMode={cutawayMode}
        onSelectCutaway={handleSelectCutaway}
        agitatorSpeed={agitatorSpeed}
        onAgitatorSpeedChange={handleAgitatorSpeedChange}
      />

      {/* Zone Details Modal */}
      {isDetailsModalOpen && (
        <ZoneDetailsModal
          preset={currentPreset}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-2xl text-xs text-white animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
