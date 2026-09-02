import { create } from 'zustand';
import { ConfigPanel, Jugador } from '../services/sheetsService';

interface AppState {
  inscriptos: Jugador[];
  config: Partial<ConfigPanel>;
  loading: boolean;
  error: string | null;
  success: string | null;
  
  setInscriptos: (inscriptos: Jugador[]) => void;
  setConfig: (config: Partial<ConfigPanel>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  inscriptos: [],
  config: {
    lluvia: 'SOL',
    suspension1: 'NINGUNA',
    suspension2: 'NINGUNA',
    bajas: [],
  },
  loading: false,
  error: null,
  success: null,
  
  setInscriptos: (inscriptos) => set({ inscriptos }),
  setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),
}));
