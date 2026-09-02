import { CheckCircle, AlertCircle, Zap, Users } from 'lucide-react';
import { ConfigPanel } from '../services/sheetsService';

interface PanelControlProps {
  config: Partial<ConfigPanel>;
  onConfigChange: (config: Partial<ConfigPanel>) => void;
  onEjecutar: () => void;
  loading: boolean;
  inscriptosCount: number;
}

const SEDES = ['CANTON', 'SM', 'PUERTOS'];
const MOTIVOS_BAJA = ['Baja con aviso', 'No apareció (Grave)'];

export default function PanelControl({
  config,
  onConfigChange,
  onEjecutar,
  loading,
  inscriptosCount,
}: PanelControlProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Panel Configuración */}
      <div className="lg:col-span-2 space-y-6">
        {/* Estado Sistema */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 border-green-500">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-green-500" />
            Estado del Sistema
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">Inscriptos Totales</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{inscriptosCount}</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">Estado</p>
              <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">✅ Listo</p>
            </div>
          </div>
        </div>

        {/* Suspensiones */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 border-yellow-500">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            Suspensiones
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🌦️ Suspensión por Lluvia
              </label>
              <select
                value={config.lluvia || 'SOL'}
                onChange={(e) => onConfigChange({ lluvia: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="SOL">☀️ Sin lluvia</option>
                <option value="CANTON">🌧️ CANTON</option>
                <option value="SM">🌧️ SM</option>
                <option value="PUERTOS">🌧️ PUERTOS</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  🚨 Suspensión 1
                </label>
                <select
                  value={config.suspension1 || 'NINGUNA'}
                  onChange={(e) => onConfigChange({ suspension1: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="NINGUNA">Ninguna</option>
                  {SEDES.map((sede) => (
                    <option key={sede} value={sede}>
                      {sede}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  🚨 Suspensión 2
                </label>
                <select
                  value={config.suspension2 || 'NINGUNA'}
                  onChange={(e) => onConfigChange({ suspension2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="NINGUNA">Ninguna</option>
                  {SEDES.map((sede) => (
                    <option key={sede} value={sede}>
                      {sede}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Opciones Extra */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">⚙️ Opciones</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 transition">
              <input
                type="checkbox"
                checked={config.puertos_10vs10 || false}
                onChange={(e) => onConfigChange({ puertos_10vs10: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300 font-semibold">🏟️ Puertos 10vs10</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900 rounded-lg cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-800 transition">
              <input
                type="checkbox"
                checked={config.asistencias_activo || false}
                onChange={(e) => onConfigChange({ asistencias_activo: e.target.checked })}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-gray-700 dark:text-gray-300 font-semibold">📋 Guardar Asistencias</span>
            </label>
          </div>
        </div>

        {/* Bajas del Día */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 border-red-500">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🚨 Bajas del Día</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {config.bajas && config.bajas.length > 0 ? (
              config.bajas.map((baja, idx) => (
                <div key={idx} className="p-3 bg-red-50 dark:bg-red-900 rounded-lg flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white">{baja.nombre}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{baja.motivo}</p>
                  </div>
                  <button
                    onClick={() =>
                      onConfigChange({
                        bajas: config.bajas!.filter((_, i) => i !== idx),
                      })
                    }
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Sin bajas registradas</p>
            )}
          </div>
        </div>
      </div>

      {/* Botón Ejecutar (Sidebar) */}
      <div className="flex flex-col gap-4">
        <button
          onClick={onEjecutar}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-bold py-6 px-6 rounded-lg shadow-xl flex items-center justify-center gap-3 text-lg transition transform hover:scale-105 h-24"
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Zap className="w-7 h-7" />
              <span>EJECUTAR AHORA</span>
            </>
          )}
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4 border-l-4 border-green-500">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Resumen
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Inscriptos:</span>
              <span className="font-bold text-gray-800 dark:text-white">{inscriptosCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Lluvia:</span>
              <span className="font-bold text-gray-800 dark:text-white">{config.lluvia || 'SOL'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Suspensiones:</span>
              <span className="font-bold text-gray-800 dark:text-white">
                {[config.suspension1, config.suspension2].filter((s) => s && s !== 'NINGUNA').length || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Bajas:</span>
              <span className="font-bold text-red-600 dark:text-red-400">{config.bajas?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
