// Tipos principales de la aplicación

export type Sede = 'CANTON' | 'SM' | 'PUERTOS';

export interface Jugador {
  id: string;
  email: string;
  nombre: string;
  apodo: string;
  fecha_registro: string;
  es_vip: boolean;
  estado_pago: 'AL_DÍA' | 'DEBE';
  puntaje_historico: number;
  asistencias_totales: number;
  no_apariciones: number;
  bajas_aviso: number;
  juega_con_lluvia: boolean;
  sede_preferida: Sede;
  flexible: boolean;
  activo: boolean;
}

export interface Inscripcion {
  id: string;
  convocatoria_id: string;
  jugador_id: string;
  jugador?: Jugador;
  sede_preferida: Sede;
  flexible: boolean;
  juega_con_lluvia: boolean;
  timestamp_inscripcion: string;
  estado: 'CONVOCADO' | 'SUPLENTE' | 'NO_ASIGNADO';
  motivo_no_asignacion?: string;
}

export interface Convocatoria {
  id: string;
  fecha: string;
  estado: 'PLANIFICADA' | 'ABIERTA' | 'CERRADA' | 'CANCELADA';
  suspension_lluvia: boolean;
  sedes_canceladas: Sede[];
  created_at: string;
  updated_at: string;
  inscripciones?: Inscripcion[];
}

export interface SedeInfo {
  id: string;
  nombre: string;
  horario: string;
  capacidad: number;
  ubicacion: string;
  activa: boolean;
}

export interface EquipoAsignado {
  id: string;
  convocatoria_id: string;
  sede_id: string;
  jugador_id: string;
  jugador?: Jugador;
  tipo_asignacion: 'TITULAR' | 'SUPLENTE';
  orden_convocatoria: number;
  asistio?: boolean;
  calificacion?: number;
}

export interface HistorialAsistencia {
  id: string;
  jugador_id: string;
  convocatoria_id: string;
  sede_id: string;
  asistio: boolean;
  estado: 'ASISTIÓ' | 'SE_BAJÓ' | 'NO_APARECIÓ';
  motivo?: string;
  timestamp: string;
}

export interface ConfiguracionPanel {
  id: string;
  lluvia_suspension: string;
  suspension_extra_1?: string;
  suspension_extra_2?: string;
  columna_pagos?: string;
  puertos_10vs10: boolean;
  updated_at: string;
}

export interface EstadisticasJugador {
  total_convocatorias: number;
  asistencias: number;
  ausencias: number;
  bajas: number;
  porcentaje_asistencia: number;
  puntaje_promedio: number;
}
