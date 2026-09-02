import { Users, Trophy, AlertCircle } from 'lucide-react';
import { JugadorConvocado } from '../services/sheetsService';

interface VistaEquiposProps {
  equipos: {
    [key: string]: {
      players: JugadorConvocado[];
      suspended: boolean;
    };
  } | null;
}

const SEDES_INFO = {
  SM: { emoji: '⚽', color: 'blue', capacidad: 16 },
  CANTON: { emoji: '🏟️', color: 'green', capacidad: 14 },
  PUERTOS: { emoji: '🌊', color: 'purple', capacidad: 14 },
};

export default function VistaEquipos({ equipos }: VistaEquiposProps) {
  if (!equipos || Object.keys(equipos).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">No hay datos de equipos disponibles</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Ejecuta el armado desde el Panel de Control</p>
      </div>
    );
  }

  const sedesOrdenadas = Object.keys(equipos).sort();

  return (
    <div className="space-y-6">
      {sedesOrdenadas.map((sedeName) => {
        const sede = equipos[sedeName];
        const info = SEDES_INFO[sedeName as keyof typeof SEDES_INFO] || { emoji: '🏟️', color: 'gray', capacidad: 14 };
        const convocados = sede.players.filter((p) => p.estado === 'CONVOCADO');
        const suplentes = sede.players.filter((p) => p.estado === 'SUPLENTE');
        const colorMap = {
          blue: 'bg-blue-50 dark:bg-blue-900 border-blue-500',
          green: 'bg-green-50 dark:bg-green-900 border-green-500',
          purple: 'bg-purple-50 dark:bg-purple-900 border-purple-500',
          gray: 'bg-gray-50 dark:bg-gray-700 border-gray-500',
        };

        return (
          <div
            key={sedeName}
            className={`rounded-lg shadow-lg border-l-4 overflow-hidden ${
              colorMap[info.color as keyof typeof colorMap]
            }`}
          >
            {/* Header */}
            <div className={`bg-${info.color}-100 dark:bg-${info.color}-800 px-6 py-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{info.emoji}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{sedeName}</h2>
                    {sede.suspended && (
                      <p className="text-sm text-red-600 dark:text-red-400 font-semibold">❌ SUSPENDIDA</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Capacidad</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {convocados.length}/{info.capacidad}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            {!sede.suspended ? (
              <div className="p-6 space-y-6">
                {/* Titulares */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Titulares ({convocados.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {convocados.length > 0 ? (
                      convocados.map((jugador, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white dark:bg-gray-700 rounded-lg border-l-4 border-green-500 shadow-sm hover:shadow-md transition"
                        >
                          <p className="font-bold text-gray-800 dark:text-white">{idx + 1}. {jugador.nombre}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{jugador.email}</p>
                          {jugador.tipo === 'VIP' && (
                            <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs font-bold">
                              ⭐ VIP
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 col-span-2 text-center py-4">Sin convocados</p>
                    )}
                  </div>
                </div>

                {/* Suplentes */}
                {suplentes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-500" />
                      Suplentes ({suplentes.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suplentes.map((jugador, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-orange-50 dark:bg-orange-900 rounded-lg border-l-4 border-orange-500 shadow-sm hover:shadow-md transition opacity-75"
                        >
                          <p className="font-bold text-gray-800 dark:text-white">{idx + 1}. {jugador.nombre}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{jugador.email}</p>
                          {jugador.tipo === 'VIP' && (
                            <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs font-bold">
                              ⭐ VIP
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-600 dark:text-red-400 font-bold text-lg">Esta sede ha sido suspendida</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
