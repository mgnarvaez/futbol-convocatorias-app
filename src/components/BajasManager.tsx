import { useState } from 'react';
import { Trash2, Plus, AlertCircle } from 'lucide-react';

interface BajasManagerProps {
  bajas: Array<{ nombre: string; motivo: string }>;
  inscriptos: string[];
  onAgregarBaja: (nombre: string, motivo: string) => void;
  onEliminarBaja: (nombre: string) => void;
}

const MOTIVOS = ['Baja con aviso', 'No apareció (Grave)'];

export default function BajasManager({
  bajas,
  inscriptos,
  onAgregarBaja,
  onEliminarBaja,
}: BajasManagerProps) {
  const [nombreSeleccionado, setNombreSeleccionado] = useState('');
  const [motivoSeleccionado, setMotivoSeleccionado] = useState(MOTIVOS[0]);
  const [filtro, setFiltro] = useState('');

  const bajasPendientes = inscriptos.filter(
    (nombre) => !bajas.some((b) => b.nombre.toLowerCase() === nombre.toLowerCase())
  );

  const bajasFiltradas = bajasPendientes.filter((nombre) =>
    nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleAgregar = () => {
    if (nombreSeleccionado && motivoSeleccionado) {
      onAgregarBaja(nombreSeleccionado, motivoSeleccionado);
      setNombreSeleccionado('');
      setFiltro('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-500" />
        Registrar Baja
      </h3>

      {/* Formulario agregar baja */}
      <div className="space-y-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🔍 Selecciona Jugador
          </label>
          <input
            type="text"
            placeholder="Buscar jugador..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent mb-2"
          />
          {bajasFiltradas.length > 0 && (
            <div className="max-h-40 overflow-y-auto space-y-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700">
              {bajasFiltradas.slice(0, 10).map((nombre) => (
                <button
                  key={nombre}
                  onClick={() => {
                    setNombreSeleccionado(nombre);
                    setFiltro('');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-red-100 dark:hover:bg-red-800 rounded text-sm text-gray-800 dark:text-white transition"
                >
                  {nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        {nombreSeleccionado && (
          <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200 font-semibold">
              Seleccionado: <span className="text-red-600 dark:text-red-300">{nombreSeleccionado}</span>
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            📋 Motivo
          </label>
          <select
            value={motivoSeleccionado}
            onChange={(e) => setMotivoSeleccionado(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {MOTIVOS.map((motivo) => (
              <option key={motivo} value={motivo}>
                {motivo}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAgregar}
          disabled={!nombreSeleccionado || !motivoSeleccionado}
          className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Agregar Baja
        </button>
      </div>

      {/* Lista de bajas */}
      {bajas.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bajas registradas ({bajas.length}):</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {bajas.map((baja, idx) => (
              <div
                key={idx}
                className="p-3 bg-red-50 dark:bg-red-900 rounded-lg flex justify-between items-start border-l-4 border-red-500"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 dark:text-white truncate">{baja.nombre}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{baja.motivo}</p>
                </div>
                <button
                  onClick={() => onEliminarBaja(baja.nombre)}
                  className="ml-2 p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 hover:bg-red-100 dark:hover:bg-red-800 rounded transition"
                  title="Eliminar baja"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
