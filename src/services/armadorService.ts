import { Jugador } from './sheetsService';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxrnsy5Nnc3NhuaiMDQttchV96qtNqVuS8DVP8gZePhdt8FJ0V5AD9aAO-MSVIPkGVT/exec';

export interface EquipoArmado {
  sede: string;
  titulares: Jugador[];
  suplentes: Jugador[];
  suspended: boolean;
  capacidad: number;
}

export interface ResultadoArmado {
  exitoso: boolean;
  mensaje: string;
  equipos: EquipoArmado[];
  timestamp: string;
}

/**
 * Ejecuta el armado de equipos con la configuración actual
 */
export async function armarEquipos(config: {
  lluvia: string;
  suspension1: string;
  suspension2: string;
  puertos_10vs10: boolean;
  bajas: Array<{ nombre: string; motivo: string }>;
}): Promise<ResultadoArmado> {
  try {
    const payload = {
      action: 'select_players',
      params: {
        suspensionLluvia: config.lluvia || 'SOL',
        suspensionOtra: config.suspension1 || 'NINGUNA',
        suspensionOtra2: config.suspension2 || 'NINGUNA',
        puertos10vs10: config.puertos_10vs10 || false,
        bajas: config.bajas || [],
      },
    };

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Error al armar equipos');
    }

    // Procesar respuesta
    const equipos: EquipoArmado[] = [];

    if (data.solapas) {
      const sedesMap = {
        SM: { nom: 'SM', cap: 16 },
        canton: { nom: 'CANTON', cap: 14 },
        puertos: { nom: 'PUERTOS', cap: config.puertos_10vs10 ? 20 : 14 },
      };

      Object.entries(sedesMap).forEach(([key, info]) => {
        const sedData = data.solapas[key as keyof typeof data.solapas];
        if (sedData) {
          const titulares: Jugador[] = [];
          const suplentes: Jugador[] = [];

          sedData.players?.forEach((p: any) => {
            const jug: Jugador = {
              nombre: p.apodo || '',
              email: p.email || '',
              tipo: p.tipo || 'GENERAL',
              sede_pref: info.nom,
              flexible: p.flexible || false,
              juega_lluvia: p.playIfRains || false,
            };

            if (p.estado?.includes('SUPLENTE')) {
              suplentes.push(jug);
            } else {
              titulares.push(jug);
            }
          });

          equipos.push({
            sede: info.nom,
            titulares,
            suplentes,
            suspended: sedData.isSuspended || false,
            capacidad: info.cap,
          });
        }
      });
    }

    return {
      exitoso: true,
      mensaje: '✅ Equipos armados exitosamente',
      equipos,
      timestamp: new Date().toLocaleTimeString('es-AR'),
    };
  } catch (error) {
    console.error('Error armando equipos:', error);
    return {
      exitoso: false,
      mensaje: error instanceof Error ? error.message : 'Error desconocido',
      equipos: [],
      timestamp: new Date().toLocaleTimeString('es-AR'),
    };
  }
}

/**
 * Registra las asistencias de los jugadores convocados
 */
export async function registrarAsistencias(): Promise<{
  exitoso: boolean;
  mensaje: string;
}> {
  try {
    const payload = {
      action: 'guardar_asistencias',
      params: {},
    };

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      return {
        exitoso: true,
        mensaje: '✅ Asistencias guardadas correctamente',
      };
    } else {
      throw new Error(data.error || 'Error guardando asistencias');
    }
  } catch (error) {
    console.error('Error registrando asistencias:', error);
    return {
      exitoso: false,
      mensaje: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Actualiza el desplegable de bajas con los jugadores inscriptos
 */
export async function actualizarDesplegableBajas(): Promise<{
  exitoso: boolean;
  mensaje: string;
}> {
  try {
    const payload = {
      action: 'actualizar_bajas',
      params: {},
    };

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      return {
        exitoso: true,
        mensaje: '✅ Desplegable de bajas actualizado',
      };
    } else {
      throw new Error(data.error || 'Error actualizando bajas');
    }
  } catch (error) {
    console.error('Error actualizando bajas:', error);
    return {
      exitoso: false,
      mensaje: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Limpia todos los datos del sistema (formularios, bajas, etc)
 */
export async function limpiarSistema(): Promise<{
  exitoso: boolean;
  mensaje: string;
}> {
  try {
    if (!confirm('⚠️ ¿Está seguro de que desea limpiar TODO el sistema? Esta acción no se puede deshacer.')) {
      return {
        exitoso: false,
        mensaje: 'Operación cancelada',
      };
    }

    const payload = {
      action: 'limpiar_sistema',
      params: {},
    };

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      return {
        exitoso: true,
        mensaje: '✅ Sistema limpiado correctamente',
      };
    } else {
      throw new Error(data.error || 'Error limpiando sistema');
    }
  } catch (error) {
    console.error('Error limpiando sistema:', error);
    return {
      exitoso: false,
      mensaje: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Registra una baja de un jugador
 */
export async function registrarBaja(nombre: string, motivo: string): Promise<{
  exitoso: boolean;
  mensaje: string;
}> {
  try {
    const payload = {
      action: 'registrar_baja',
      params: {
        nombre,
        motivo,
      },
    };

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      return {
        exitoso: true,
        mensaje: `✅ ${nombre} registrado como baja`,
      };
    } else {
      throw new Error(data.error || 'Error registrando baja');
    }
  } catch (error) {
    console.error('Error registrando baja:', error);
    return {
      exitoso: false,
      mensaje: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
