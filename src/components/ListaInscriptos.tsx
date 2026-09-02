import { useState } from 'react';
import { Search, Filter, Users } from 'lucide-react';
import { Jugador } from '../services/sheetsService';

interface ListaInscriptosProps {
  inscriptos: Jugador[];
}

export default function ListaInscriptos({ inscriptos }: ListaInscriptosProps) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'TODOS' | 'VIP' | 'GENERAL'>('TODOS');
  const [filtroSede, setFiltroSede] = useState<string>('TODOS');

  const filtered = inscriptos.filter((j) => {
    const coincideBusqueda = j.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                             j.email.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtroTipo === 'TODOS' || j.tipo === filtroTipo;
    const coincideSede = filtroSede === 'TODOS' || j.sede_pref === filtroSede;
    return coincideBusqueda && coincideTipo && coincideSede;
  });

  const sedes = [...new Set(inscriptos.map((j) => j.sede_pref).filter(Boolean))];
  const stats = {
    total: inscriptos.length,
    vip: inscriptos.filter((j) => j.tipo === 'VIP').length,
    general: inscriptos.filter((j) => j.tipo === 'GENERAL').length,
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Inscriptos</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">VIP</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.vip}</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">General</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.general}</p>
        </div>
        <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Sedes</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{sedes.length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros y Búsqueda
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              🔍 Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              👥 Tipo
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TODOS">Todos</option>
              <option value="VIP">⭐ VIP</option>
              <option value="GENERAL">👤 General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              🏟️ Sede Preferida
            </label>
            <select
              value={filtroSede}
              onChange={(e) => setFiltroSede(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="TODOS">Todas</option>
              {sedes.map((sede) => (
                <option key={sede} value={sede}>
                  {sede}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Inscriptos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Inscriptos ({filtered.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Sede Pref
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Flexible
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Lluvia
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.length > 0 ? (
                filtered.map((jugador, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800 dark:text-white">
                      {jugador.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{jugador.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          jugador.tipo === 'VIP'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}
                      >
                        {jugador.tipo === 'VIP' ? '⭐' : '👤'} {jugador.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {jugador.sede_pref || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={jugador.flexible ? 'text-green-600 font-bold' : 'text-gray-400'}>
                        {jugador.flexible ? '✅' : '❌'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={jugador.juega_lluvia ? 'text-green-600 font-bold' : 'text-gray-400'}>
                        {jugador.juega_lluvia ? '✅' : '❌'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron inscriptos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
