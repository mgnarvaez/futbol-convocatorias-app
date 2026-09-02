// Servicio para comunicarse con Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxrnsy5Nnc3NhuaiMDQttchV96qtNqVuS8DVP8gZePhdt8FJ0V5AD9aAO-MSVIPkGVT/exec';

export interface Jugador {
  nombre: string;
  email: string;
  tipo: 'GENERAL' | 'VIP';
  sede_pref: string;
  flexible: boolean;
  juega_lluvia: boolean;
  timestamp?: number;
}

export interface JugadorConvocado extends Jugador {
  estado: 'CONVOCADO' | 'SUPLENTE';
  sede: string;
}

export interface ConfigPanel {
  lluvia: string;
  suspension1: string;
  suspension2: string;
  pagos_columna: string;
  puertos_10vs10: boolean;
  asistencias_activo: boolean;
  bajas: Array<{ nombre: string; motivo: string }>;
}

export interface RespuestaScript {
  success: boolean;
  error?: string;
  solapas?: {
    SM: { players: any[]; isSuspended: boolean };
    canton: { players: any[]; isSuspended: boolean };
    puertos: { players: any[]; isSuspended: boolean };
  };
}

// Obtener datos de inscriptos
export async function obtenerInscriptos(): Promise<Jugador[]> {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=read_solapas`);
    const data: RespuestaScript = await response.json();

    if (!data.success) throw new Error(data.error);

    const jugadores: Jugador[] = [];

    // Procesar General
    if (data.solapas?.respuestas_4?.players) {
      data.solapas.respuestas_4.players.forEach((p: any) => {
        jugadores.push({
          nombre: p.apodo,
          email: p.email,
          tipo: 'GENERAL',
          sede_pref: p.rawPref || '',
          flexible: p.rawFlex || false,
          juega_lluvia: p.rawPlayIfRains || false,
          timestamp: p.rawTimestamp,
        });
      });
    }

    // Procesar VIP
    if (data.solapas?.respuestas_vip?.players) {
      data.solapas.respuestas_vip.players.forEach((p: any) => {
        jugadores.push({
          nombre: p.apodo,
          email: p.email,
          tipo: 'VIP',
          sede_pref: p.rawPref || '',
          flexible: p.rawFlex || false,
          juega_lluvia: p.rawPlayIfRains || false,
          timestamp: p.rawTimestamp,
        });
      });
    }

    return jugadores;
  } catch (error) {
    console.error('Error obteniendo inscriptos:', error);
    throw error;
  }
}

// Obtener datos de sedes
export async function obtenerSedes(): Promise<{ [key: string]: { players: JugadorConvocado[]; suspended: boolean } }> {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=read_solapas`);
    const data: RespuestaScript = await response.json();

    if (!data.success) throw new Error(data.error);

    const sedes: any = {};

    // Mapear sedes
    const sedeMap = {
      SM: data.solapas?.SM || { players: [], isSuspended: false },
      CANTON: data.solapas?.canton || { players: [], isSuspended: false },
      PUERTOS: data.solapas?.puertos || { players: [], isSuspended: false },
    };

    Object.entries(sedeMap).forEach(([nombre, data]: [string, any]) => {
      sedes[nombre] = {
        players: data.players?.map((p: any) => ({
          nombre: p.apodo,
          email: p.email,
          tipo: p.tipo || 'GENERAL',
          sede_pref: nombre,
          flexible: false,
          juega_lluvia: false,
          estado: p.estado,
          sede: nombre,
        })) || [],
        suspended: data.isSuspended,
      };
    });

    return sedes;
  } catch (error) {
    console.error('Error obteniendo sedes:', error);
    throw error;
  }
}

// Ejecutar armado de equipos
export async function ejecutarArmado(config: Partial<ConfigPanel>): Promise<RespuestaScript> {
  try {
    const payload = {
      action: 'select_players',
      params: {
        suspensionLluvia: config.lluvia || 'SOL',
        suspensionOtra: config.suspension1 || 'NINGUNA',
      },
    };

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const data: RespuestaScript = await response.json();
    return data;
  } catch (error) {
    console.error('Error ejecutando armado:', error);
    throw error;
  }
}

// Actualizar configuración del panel
export async function actualizarConfigPanel(config: Partial<ConfigPanel>): Promise<void> {
  try {
    await ejecutarArmado(config);
  } catch (error) {
    console.error('Error actualizando config:', error);
    throw error;
  }
}
