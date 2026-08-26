import { supabase } from './supabaseClient';
import { HistorialAsistencia } from '../types';

export const asistenciaService = {
  // Registrar asistencia
  async registrarAsistencia(
    jugadorId: string,
    convocatoriaId: string,
    sedeId: string,
    asistio: boolean,
    estado: 'ASISTIÓ' | 'SE_BAJÓ' | 'NO_APARECIÓ',
    motivo?: string
  ): Promise<HistorialAsistencia> {
    const { data, error } = await supabase
      .from('historial_asistencias')
      .insert([
        {
          jugador_id: jugadorId,
          convocatoria_id: convocatoriaId,
          sede_id: sedeId,
          asistio,
          estado,
          motivo,
          timestamp: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtener historial de un jugador
  async obtenerHistorialJugador(jugadorId: string): Promise<HistorialAsistencia[]> {
    const { data, error } = await supabase
      .from('historial_asistencias')
      .select('*')
      .eq('jugador_id', jugadorId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Obtener asistencias de una convocatoria
  async obtenerAsistenciasConvocatoria(convocatoriaId: string): Promise<HistorialAsistencia[]> {
    const { data, error } = await supabase
      .from('historial_asistencias')
      .select('*')
      .eq('convocatoria_id', convocatoriaId);

    if (error) throw error;
    return data || [];
  },

  // Actualizar asistencia
  async actualizarAsistencia(
    id: string,
    asistio: boolean,
    estado: 'ASISTIÓ' | 'SE_BAJÓ' | 'NO_APARECIÓ'
  ): Promise<void> {
    const { error } = await supabase
      .from('historial_asistencias')
      .update({ asistio, estado })
      .eq('id', id);

    if (error) throw error;
  }
};
