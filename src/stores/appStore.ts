import { create } from 'zustand';
import { Convocatoria, Jugador, Inscripcion, EquipoAsignado, ConfiguracionPanel } from '../types';
import { convocatoriaService } from '../services/convocatoriaService';
import { jugadorService } from '../services/jugadorService';

interface AppState {
  // Estado
  convocatoriaActual: Convocatoria | null;
  jugadores: Jugador[];
  inscripciones: Inscripcion[];
  equiposAsignados: Map<string, EquipoAsignado[]>;
  configuracion: ConfiguracionPanel | null;
  darkMode: boolean;
  cargando: boolean;
  error: string | null;

  // Acciones - Convocatorias
  cargarConvocatoriaDelDia: () => Promise<void>;
  crearConvocatoria: (fecha: string) => Promise<void>;
  abrirConvocatoria: () => Promise<void>;
  cerrarConvocatoria: () => Promise<void>;

  // Acciones - Jugadores
  cargarJugadores: () => Promise<void>;
  agregarJugador: (jugador: Partial<Jugador>) => Promise<void>;
  actualizarEstadoPago: (jugadorId: string, estado: 'AL_DÍA' | 'DEBE') => Promise<void>;

  // Acciones - Configuración
  actualizarConfiguracion: (config: Partial<ConfiguracionPanel>) => Promise<void>;
  toggleDarkMode: () => void;

  // Acciones - General
  setError: (error: string | null) => void;
  resetState: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  convocatoriaActual: null,
  jugadores: [],
  inscripciones: [],
  equiposAsignados: new Map(),
  configuracion: null,
  darkMode: localStorage.getItem('darkMode') === 'true',
  cargando: false,
  error: null,

  // Cargar convocatoria del día
  cargarConvocatoriaDelDia: async () => {
    set({ cargando: true, error: null });
    try {
      const convocatoria = await convocatoriaService.obtenerConvocatoriaDelDia();
      if (convocatoria) {
        const inscripciones = await convocatoriaService.obtenerInscripciones(convocatoria.id);
        set({ convocatoriaActual: convocatoria, inscripciones });
      }
      set({ cargando: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar convocatoria',
        cargando: false
      });
    }
  },

  // Crear nueva convocatoria
  crearConvocatoria: async (fecha: string) => {
    set({ cargando: true, error: null });
    try {
      const convocatoria = await convocatoriaService.crearConvocatoria(fecha);
      set({ convocatoriaActual: convocatoria, cargando: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear convocatoria',
        cargando: false
      });
    }
  },

  // Abrir convocatoria
  abrirConvocatoria: async () => {
    const { convocatoriaActual } = get();
    if (!convocatoriaActual) return;

    set({ cargando: true, error: null });
    try {
      const actualizada = await convocatoriaService.actualizarEstado(
        convocatoriaActual.id,
        'ABIERTA'
      );
      set({ convocatoriaActual: actualizada, cargando: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al abrir convocatoria',
        cargando: false
      });
    }
  },

  // Cerrar convocatoria
  cerrarConvocatoria: async () => {
    const { convocatoriaActual } = get();
    if (!convocatoriaActual) return;

    set({ cargando: true, error: null });
    try {
      const actualizada = await convocatoriaService.actualizarEstado(
        convocatoriaActual.id,
        'CERRADA'
      );
      set({ convocatoriaActual: actualizada, cargando: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cerrar convocatoria',
        cargando: false
      });
    }
  },

  // Cargar jugadores
  cargarJugadores: async () => {
    set({ cargando: true, error: null });
    try {
      const jugadores = await jugadorService.listarJugadores();
      set({ jugadores, cargando: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar jugadores',
        cargando: false
      });
    }
  },

  // Agregar jugador
  agregarJugador: async (jugador: Partial<Jugador>) => {
    set({ cargando: true, error: null });
    try {
      const nuevoJugador = await jugadorService.crearOActualizarJugador(jugador);
      const { jugadores } = get();
      set({
        jugadores: [...jugadores, nuevoJugador],
        cargando: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al agregar jugador',
        cargando: false
      });
    }
  },

  // Actualizar estado de pago
  actualizarEstadoPago: async (jugadorId: string, estado: 'AL_DÍA' | 'DEBE') => {
    set({ error: null });
    try {
      await jugadorService.actualizarEstadoPago(jugadorId, estado);
      const { jugadores } = get();
      const updated = jugadores.map(j =>
        j.id === jugadorId ? { ...j, estado_pago: estado } : j
      );
      set({ jugadores: updated });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar pago'
      });
    }
  },

  // Actualizar configuración
  actualizarConfiguracion: async (config: Partial<ConfiguracionPanel>) => {
    set({ error: null });
    try {
      // Aquí iría la llamada a BD
      set({ configuracion: config as ConfiguracionPanel });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar configuración'
      });
    }
  },

  // Toggle modo oscuro
  toggleDarkMode: () => {
    const { darkMode } = get();
    const newDarkMode = !darkMode;
    localStorage.setItem('darkMode', String(newDarkMode));
    set({ darkMode: newDarkMode });
  },

  // Establecer error
  setError: (error: string | null) => set({ error }),

  // Reset estado
  resetState: () => {
    set({
      convocatoriaActual: null,
      jugadores: [],
      inscripciones: [],
      equiposAsignados: new Map(),
      configuracion: null,
      error: null,
      cargando: false
    });
  }
}));
