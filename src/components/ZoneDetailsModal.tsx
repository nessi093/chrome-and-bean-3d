import React from 'react';
import { CameraPreset } from '../types/cafe';
import { X, CheckCircle2, Cpu, Sparkles, Building, Layers } from 'lucide-react';

interface ZoneDetailsModalProps {
  preset: CameraPreset;
  onClose: () => void;
}

export const ZoneDetailsModal: React.FC<ZoneDetailsModalProps> = ({ preset, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 text-neutral-100 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/50">
                {preset.category}
              </span>
              <span className="text-xs text-neutral-400 font-mono">CHROME & BEAN • 2026</span>
            </div>
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
              {preset.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <p className="text-sm text-neutral-300 leading-relaxed">
            {preset.description}
          </p>

          {preset.details?.equipment && (
            <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-1.5">
                <Cpu className="w-4 h-4" />
                <span>Оборудование & Спецификации</span>
              </div>
              <p className="text-xs text-neutral-300 leading-normal">
                {preset.details.equipment}
              </p>
            </div>
          )}

          {preset.details?.materials && (
            <div className="p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 mb-1.5">
                <Layers className="w-4 h-4" />
                <span>Материалы и отделка</span>
              </div>
              <p className="text-xs text-neutral-300 leading-normal">
                {preset.details.materials}
              </p>
            </div>
          )}

          {preset.details?.features && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">
                Ключевые особенности
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {preset.details.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-neutral-300 bg-neutral-950/40 border border-neutral-800/60 px-3 py-2 rounded-xl"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
