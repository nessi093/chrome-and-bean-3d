export type LightingMode = 'dusk' | 'day' | 'night' | 'neon';

export type CutawayMode = 'full' | 'cutaway' | 'floorplan';

export interface CameraPreset {
  id: string;
  name: string;
  category: 'overview' | 'interior' | 'equipment' | 'exterior';
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  description: string;
  details?: {
    equipment?: string;
    materials?: string;
    capacity?: string;
    features?: string[];
  };
}

export interface Hotspot {
  id: string;
  name: string;
  position: [number, number, number];
  cameraPresetId: string;
  category: string;
  summary: string;
  description: string;
  specs: string[];
}
