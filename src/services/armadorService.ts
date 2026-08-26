import { supabase } from './supabaseClient';
import { Inscripcion, EquipoAsignado, Sede } from '../types';

interface ResultadoArmado {
  equipos: Map<Sede, { titulares: EquipoAsignado[]; suplentes: EquipoAsignado[] }>;
  noAsignados: Inscripcion[];
}

export const armadorService = {
  // Función principal: Armar equipos automáticamente
  async armarEquipos(convocatoriaId: string): Promise<ResultadoArmado> {
    // 1. Obtener inscripciones
    const { data: inscripciones, error: errInsc } = await supabase
      .from('inscripciones')
      .select(`
        *,
        jugador:jugadores(*)
      `)
      .eq('convocatoria_id', convocatoriaId)
      .order('timestamp_inscripcion', { ascending: true });

    if (errInsc) throw errInsc;

    // 2. Obtener configuración
    const { data: config, error: errConfig } = await supabase
      .from('configuracion_panel')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (errConfig) throw errConfig;

    // 3. Capacidades de sedes
    const capacidades: Record<Sede, number> = {
      'CANTON': 14,
      'SM': 16,
      'PUERTOS': config?.puertos_10vs10 ? 20 : 14
    };

    // 4. Filtrar por lluvia y suspensiones
    let jugadoresValidos = (inscripciones || []).filter((insc: any) => {
      if (config?.suspension_lluvia && !insc.juega_con_lluvia) return false;
      if (config?.sedes_canceladas?.includes(insc.sede_preferida)) return false;
      return true;
    });

    // 5. Ordenar por prioridad (tu algoritmo original)
    jugadoresValidos.sort((a: any, b: any) => {
      const jugadorA = a.jugador;
      const jugadorB = b.jugador;

      // VIP primero
      if (jugadorA.es_vip !== jugadorB.es_vip) {
        return jugadorA.es_vip ? -1 : 1;
      }

      // Pago al día
      if (jugadorA.estado_pago !== jugadorB.estado_pago) {
        return jugadorA.estado_pago === 'AL_DÍA' ? -1 : 1;
      }

      // Por antigüedad (timestamp)
      return new Date(a.timestamp_inscripcion).getTime() - 
             new Date(b.timestamp_inscripcion).getTime();
    });

    // 6. Asignar equipos
    const sedes: Record<Sede, any> = {
      'CANTON': { titulares: [], suplentes: [] },
      'SM': { titulares: [], suplentes: [] },
      'PUERTOS': { titulares: [], suplentes: [] }
    };

    const noAsignados: Inscripcion[] = [];
    let ordenConvocatoria = 1;

    for (const inscripcion of jugadoresValidos) {
      const sedePref = inscripcion.sede_preferida as Sede;
      let asignado = false;

      // Intentar asignar a sede preferida
      if (sedes[sedePref].titulares.length < capacidades[sedePref]) {
        sedes[sedePref].titulares.push(inscripcion);
        asignado = true;
      }
      // Si es flexible, buscar otra sede
      else if (inscripcion.flexible) {
        for (const sede of ['CANTON', 'SM', 'PUERTOS'] as Sede[]) {
          if (sedes[sede].titulares.length < capacidades[sede]) {
            sedes[sede].titulares.push(inscripcion);
            asignado = true;
            break;
          }
        }
      }

      // Si no asignó como titular, va a suplentes
      if (!asignado) {
        const sedeParaSuplente = inscripcion.flexible
          ? Object.keys(sedes)[0] as Sede
          : sedePref;
        sedes[sedeParaSuplente].suplentes.push(inscripcion);
      }

      if (!asignado && !inscripcion.flexible) {
        noAsignados.push(inscripcion);
      }
    }

    // 7. Guardar en BD
    const equiposGuardados: Map<Sede, { titulares: EquipoAsignado[]; suplentes: EquipoAsignado[] }> = new Map();

    for (const [sede, grupo] of Object.entries(sedes)) {
      const titularesGuardados: EquipoAsignado[] = [];
      const suplentesGuardados: EquipoAsignado[] = [];

      // Guardar titulares
      for (const insc of grupo.titulares) {
        const { data, error } = await supabase
          .from('equipos_asignados')
          .insert([
            {
              convocatoria_id: convocatoriaId,
              sede_id: sede,
              jugador_id: insc.jugador_id,
              tipo_asignacion: 'TITULAR',
              orden_convocatoria: ordenConvocatoria++
            }
          ])
          .select()
          .single();

        if (!error) titularesGuardados.push(data);
      }

      // Guardar suplentes
      for (const insc of grupo.suplentes) {
        const { data, error } = await supabase
          .from('equipos_asignados')
          .insert([
            {
              convocatoria_id: convocatoriaId,
              sede_id: sede,
              jugador_id: insc.jugador_id,
              tipo_asignacion: 'SUPLENTE',
              orden_convocatoria: ordenConvocatoria++
            }
          ])
          .select()
          .single();

        if (!error) suplentesGuardados.push(data);
      }

      equiposGuardados.set(sede as Sede, {
        titulares: titularesGuardados,
        suplentes: suplentesGuardados
      });
    }

    return {
      equipos: equiposGuardados,
      noAsignados
    };
  },

  // Obtener equipos armados
  async obtenerEquipos(convocatoriaId: string): Promise<Map<Sede, { titulares: EquipoAsignado[]; suplentes: EquipoAsignado[] }>> {
    const { data, error } = await supabase
      .from('equipos_asignados')
      .select(`
        *,
        jugador:jugadores(*)
      `)
      .eq('convocatoria_id', convocatoriaId)
      .order('sede_id', { ascending: true })
      .order('tipo_asignacion', { ascending: true })
      .order('orden_convocatoria', { ascending: true });

    if (error) throw error;

    const equipos: Map<Sede, { titulares: EquipoAsignado[]; suplentes: EquipoAsignado[] }> = new Map();

    for (const sede of ['CANTON', 'SM', 'PUERTOS'] as Sede[]) {
      equipos.set(sede, {
        titulares: (data || []).filter((e: any) => e.sede_id === sede && e.tipo_asignacion === 'TITULAR'),
        suplentes: (data || []).filter((e: any) => e.sede_id === sede && e.tipo_asignacion === 'SUPLENTE')
      });
    }

    return equipos;
  }
};
