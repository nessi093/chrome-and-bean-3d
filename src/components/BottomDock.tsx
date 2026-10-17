import React, { useState, useEffect } from 'react';
import { CameraPreset, LightingMode, CutawayMode } from '../types/cafe';
import { CAMERA_PRESETS } from '../three/CafeScene';
import {
  Compass,
  SunMedium,
  Building2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Eye,
  RotateCw,
  Sparkles,
  Flame,
  Grid,
} from 'lucide-react';

interface BottomDockProps {
  currentPreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
  lightingMode: LightingMode;
  onSelectLighting: (mode: LightingMode) => void;
  cutawayMode: CutawayMode;
  onSelectCutaway: (mode: CutawayMode) => void;
  agitatorSpeed: number;
  onAgitatorSpeedChange: (speed: number) => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  currentPreset,
  onSelectPreset,
  lightingMode,
  onSelectLighting,
  cutawayMode,
  onSelectCutaway,
  agitatorSpeed,
  onAgitatorSpeedChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'lighting' | 'cutaway' | 'machinery'>('presets');

  // Shortcut key 'H' to toggle dock collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H' || e.key === 'р' || e.key === 'Р') {
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-[960px] transition-transform duration-300 ease-out ${
        isCollapsed ? 'translate-y-[calc(100%-2.4rem)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse / Expand Toggle Tab */}
      <div className="flex justify-center -mb-[1px]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1 rounded-t-xl bg-neutral-900 border-t border-x border-neutral-800 text-xs text-neutral-400 hover:text-white transition shadow-lg"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Показать управление (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Свернуть панель (H)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container (Solid dark surface without backdrop-filter for lossless 60fps) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-3 md:p-4">
        {/* Dock Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5 mb-3 gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'presets'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Зоны и ракурсы</span>
            </button>

            <button
              onClick={() => setActiveTab('lighting')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'lighting'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <SunMedium className="w-3.5 h-3.5 text-cyan-400" />
              <span>Освещение & Время</span>
            </button>

            <button
              onClick={() => setActiveTab('cutaway')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'cutaway'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Архитектурный срез</span>
            </button>

            <button
              onClick={() => setActiveTab('machinery')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'machinery'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-rose-400" />
              <span>Оборудование & Анимация</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
            <span>Вращение: ЛКМ • Панорама: ПКМ • Зум: Колесо</span>
          </div>
        </div>

        {/* TAB 1: Camera Presets & Zones */}
        {activeTab === 'presets' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-[140px] overflow-y-auto pr-1">
            {CAMERA_PRESETS.map((preset) => {
              const isSelected = currentPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`flex flex-col items-start text-left p-2 rounded-xl border transition ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/80 text-amber-200'
                      : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
                      {preset.category}
                    </span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </div>
                  <span className="text-xs font-semibold truncate w-full">{preset.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 2: Lighting & Mood */}
        {activeTab === 'lighting' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              {
                id: 'dusk' as LightingMode,
                name: 'Сумерки / Вечер (Dusk)',
                desc: 'Фирменный теплый свет интерьера и синий закат (как на рендерах)',
                color: 'from-amber-600 to-indigo-900',
              },
              {
                id: 'day' as LightingMode,
                name: 'Дневной свет (Day)',
                desc: 'Естественный дневной свет через стеклянные фасады',
                color: 'from-sky-400 to-amber-200',
              },
              {
                id: 'night' as LightingMode,
                name: 'Глубокая ночь (Night)',
                desc: 'Контрастные акцентные споты и свечи на столах',
                color: 'from-neutral-900 to-blue-950',
              },
              {
                id: 'neon' as LightingMode,
                name: 'Кибер Неон (24/7)',
                desc: 'Бирюзовое неоновое свечение и футуристичный хром',
                color: 'from-cyan-500 to-pink-600',
              },
            ].map((mode) => {
              const isSelected = lightingMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => onSelectLighting(mode.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition ${
                    isSelected
                      ? 'bg-neutral-800 border-cyan-500 text-white'
                      : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${mode.color} shrink-0 mt-0.5 shadow-sm`} />
                  <div>
                    <div className="text-xs font-semibold text-neutral-200">{mode.name}</div>
                    <div className="text-[11px] text-neutral-400 leading-tight mt-0.5 line-clamp-2">{mode.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 3: Architectural Cutaway */}
        {activeTab === 'cutaway' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-neutral-300">
              <span className="font-semibold block text-neutral-100">Управление перекрытиями здания:</span>
              Снимите крышу и верхние воздуховоды, чтобы изучить подробный план всех залов и лаборатории обжарки кофе.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onSelectCutaway('cutaway')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                  cutawayMode === 'cutaway'
                    ? 'bg-emerald-950/50 text-emerald-300 border-emerald-600'
                    : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Срез без крыши (План)</span>
              </button>

              <button
                onClick={() => onSelectCutaway('full')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                  cutawayMode === 'full'
                    ? 'bg-emerald-950/50 text-emerald-300 border-emerald-600'
                    : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Полное здание с крышей</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: Machinery & Animation */}
        {activeTab === 'machinery' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Roaster Agitator Speed slider */}
            <div className="bg-neutral-950/60 border border-neutral-800 p-2.5 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-neutral-300 flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                  Вращение лопастей охлаждения ростера:
                </span>
                <span className="font-mono text-neutral-400">{Math.round(agitatorSpeed * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.5"
                step="0.1"
                value={agitatorSpeed}
                onChange={(e) => onAgitatorSpeedChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Ambient stats */}
            <div className="flex items-center justify-around bg-neutral-950/60 border border-neutral-800 p-2.5 rounded-xl text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Уличные обогреватели: <strong className="text-emerald-400">Вкл</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Пар эспрессо: <strong className="text-emerald-400">9 BAR</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
