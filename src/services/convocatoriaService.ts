import { supabase } from './supabaseClient';
import { Jugador, Convocatoria, Inscripcion, HistorialAsistencia } from '../types';

export const convocatoriaService = {
  // Crear nueva convocatoria
  async crearConvocatoria(fecha: string): Promise<Convocatoria> {
    const { data, error } = await supabase
      .from('convocatorias')
      .insert([
        {
          fecha,
          estado: 'PLANIFICADA',
          suspension_lluvia: false,
          sedes_canceladas: []
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtener convocatoria por ID
  async obtenerConvocatoria(id: string): Promise<Convocatoria> {
    const { data, error } = await supabase
      .from('convocatorias')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Listar todas las convocatorias
  async listarConvocatorias(): Promise<Convocatoria[]> {
    const { data, error } = await supabase
      .from('convocatorias')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Obtener convocatoria del día
  async obtenerConvocatoriaDelDia(): Promise<Convocatoria | null> {
    const hoy = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('convocatorias')
      .select('*')
      .eq('fecha', hoy)
      .single();

    if (error?.code === 'PGRST116') return null; // No existe
    if (error) throw error;
    return data;
  },

  // Actualizar estado de convocatoria
  async actualizarEstado(id: string, estado: string): Promise<Convocatoria> {
    const { data, error } = await supabase
      .from('convocatorias')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar suspensiones
  async actualizarSuspensiones(
    id: string,
    lluvia: boolean,
    sedesCanceladas: string[]
  ): Promise<Convocatoria> {
    const { data, error } = await supabase
      .from('convocatorias')
      .update({
        suspension_lluvia: lluvia,
        sedes_canceladas: sedesCanceladas,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtener inscripciones de una convocatoria
  async obtenerInscripciones(convocatoriaId: string): Promise<Inscripcion[]> {
    const { data, error } = await supabase
      .from('inscripciones')
      .select(`
        *,
        jugador:jugadores(*)
      `)
      .eq('convocatoria_id', convocatoriaId)
      .order('timestamp_inscripcion', { ascending: true });

    if (error) throw error;
    return data || [];
  }
};
