import React from 'react';
import { CameraPreset, LightingMode } from '../types/cafe';
import { Camera, Volume2, VolumeX, Sparkles, Layers, Info, Moon, Sun, Coffee } from 'lucide-react';
import { cafeAudio } from '../three/audioEngine';

interface TopHeaderProps {
  currentPreset: CameraPreset;
  fps: number;
  lightingMode: LightingMode;
  onLightingChange: (mode: LightingMode) => void;
  onTakeScreenshot: () => void;
  onOpenZoneDetails: () => void;
  onEspressoHiss: () => void;
  isTourActive: boolean;
  onToggleTour: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentPreset,
  fps,
  lightingMode,
  onLightingChange,
  onTakeScreenshot,
  onOpenZoneDetails,
  onEspressoHiss,
  isTourActive,
  onToggleTour,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const handleToggleAudio = () => {
    const active = cafeAudio.toggle();
    setIsPlayingAudio(active);
  };

  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none select-none">
      {/* Brand & Badge (Top-Left) */}
      <div className="flex items-center gap-3 pointer-events-auto bg-neutral-900/90 border border-neutral-800/80 rounded-2xl px-4 py-2.5 shadow-2xl backdrop-blur-none">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-600 flex items-center justify-center shadow-inner">
          <Coffee className="w-5 h-5 text-neutral-950" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wider text-white font-['Space_Grotesk']">
              CHROME & BEAN
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              24/7 ONLINE
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 font-medium">
            Roastery & Bar • Est. 2026 • 3D Architectural Model
          </p>
        </div>
      </div>

      {/* Active Zone Pill (Top-Center) */}
      <div className="hidden md:flex items-center gap-2 pointer-events-auto bg-neutral-900/90 border border-neutral-800/80 rounded-full px-4 py-1.5 shadow-xl">
        <div className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="text-xs text-neutral-400 font-mono">ЗОНА:</span>
        <span className="text-xs font-semibold text-neutral-200">{currentPreset.name}</span>
        <button
          onClick={onOpenZoneDetails}
          title="Спецификация зоны"
          className="ml-1 p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Action Controls (Top-Right) */}
      <div className="flex items-center gap-2 pointer-events-auto bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-1.5 shadow-2xl">
        {/* Cinematic Auto-Tour toggle */}
        <button
          onClick={onToggleTour}
          title={isTourActive ? 'Остановить тур' : 'Запустить кинематографичный авто-тур по кофейне'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
            isTourActive
              ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-lg'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-800 border-neutral-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isTourActive ? 'Стоп тур' : 'Авто-тур'}</span>
        </button>

        {/* Steam hiss sound trigger */}
        <button
          onClick={onEspressoHiss}
          title="Спустить пар эспрессо (La Marzocco Steam)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/40 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Пар</span>
        </button>

        {/* Procedural Cafe Ambience Sound Toggle */}
        <button
          onClick={handleToggleAudio}
          title={isPlayingAudio ? 'Выключить атмосферный звук' : 'Включить звук кофейни (Web Audio)'}
          className={`p-2 rounded-xl text-xs transition border ${
            isPlayingAudio
              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800 border-transparent'
          }`}
        >
          {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Snapshot / Screenshot button */}
        <button
          onClick={onTakeScreenshot}
          title="Сделать снимок экрана 3D модели"
          className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 border border-transparent transition"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* FPS Counter */}
        <div className="px-2 py-1 rounded-lg bg-neutral-950 text-[11px] font-mono font-medium text-neutral-400 border border-neutral-800/60">
          <span className="text-emerald-400">{fps}</span> FPS
        </div>
      </div>
    </header>
  );
};
