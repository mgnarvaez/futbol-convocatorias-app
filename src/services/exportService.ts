import { Convocatoria, Jugador, HistorialAsistencia, EquipoAsignado } from '../types';

export const exportService = {
  // Exportar a CSV
  exportarCSV(datos: any[], nombreArchivo: string): void {
    const headers = Object.keys(datos[0] || {});
    const csv = [
      headers.join(','),
      ...datos.map(row =>
        headers.map(h => {
          const valor = row[h];
          const esTexto = typeof valor === 'string' && valor.includes(',');
          return esTexto ? `"${valor}"` : valor;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombreArchivo}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Exportar a JSON
  exportarJSON(datos: any, nombreArchivo: string): void {
    const json = JSON.stringify(datos, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombreArchivo}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Generar reporte semanal
  generarReporteSemanal(
    convocatorias: Convocatoria[],
    jugadores: Jugador[],
    historial: HistorialAsistencia[]
  ): any {
    return {
      fecha_reporte: new Date().toISOString(),
      total_convocatorias: convocatorias.length,
      total_jugadores: jugadores.length,
      resumen_asistencias: historial.reduce((acc, h) => {
        acc[h.estado] = (acc[h.estado] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      datos_completos: {
        convocatorias,
        jugadores,
        historial
      }
    };
  },

  // Backup completo
  async crearBackup(datos: any): Promise<Blob> {
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      datos
    };

    return new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json'
    });
  }
};
