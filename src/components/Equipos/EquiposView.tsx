import React, { useEffect, useState } from 'react';
import { armadorService } from '../../services/armadorService';
import { Sede, EquipoAsignado } from '../../types';
import { Users, Trophy } from 'lucide-react';
import clsx from 'clsx';

interface EquiposViewProps {
  convocatoriaId: string;
  darkMode: boolean;
}

export const EquiposView: React.FC<EquiposViewProps> = ({ convocatoriaId, darkMode }) => {
  const [equipos, setEquipos] = useState<Map<Sede, { titulares: EquipoAsignado[]; suplentes: EquipoAsignado[] }> | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await armadorService.obtenerEquipos(convocatoriaId);
        setEquipos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar equipos');
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [convocatoriaId]);

  if (cargando) {
    return (
      <div className={clsx(
        'p-8 text-center',
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      )}>
        <p>⏳ Cargando equipos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={clsx(
        'p-8 text-center text-red-600',
        darkMode ? 'bg-gray-800' : 'bg-white'
      )}>
        <p>❌ {error}</p>
      </div>
    );
  }

  if (!equipos) return null;

  const sedes: Sede[] = ['CANTON', 'SM', 'PUERTOS'];
  const horariosySedes: Record<Sede, string> = {
    'CANTON': '20:00 hs - CANTÓN',
    'SM': '20:00 hs - SAN MATÍAS',
    'PUERTOS': '21:15 hs - PUERTOS'
  };

  return (
    <div className='space-y-8'>
      {sedes.map(sede => {
        const grupo = equipos.get(sede);
        if (!grupo) return null;

        const { titulares, suplentes } = grupo;
        const total = titulares.length + suplentes.length;

        return (
          <div
            key={sede}
            className={clsx(
              'rounded-lg shadow-lg overflow-hidden',
              darkMode ? 'bg-gray-800' : 'bg-white'
            )}
          >
            {/* Header */}
            <div className={clsx(
              'px-6 py-4 border-b-2',
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
            )}>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Trophy className='w-6 h-6 text-futbol-green' />
                  <div>
                    <h2 className='text-xl font-bold'>{horariosySedes[sede]}</h2>
                    <p className='text-sm opacity-75'>
                      {titulares.length} titulares + {suplentes.length} suplentes
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold text-futbol-green'>{total}</p>
                  <p className='text-xs opacity-75'>jugadores</p>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className='p-6'>
              {/* Titulares */}
              {titulares.length > 0 && (
                <div className='mb-8'>
                  <h3 className='text-lg font-bold mb-4 flex items-center gap-2'>
                    <span className='text-2xl'>⭐</span>
                    Titulares ({titulares.length})
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {titulares.map((eq, idx) => (
                      <div
                        key={eq.id}
                        className={clsx(
                          'p-4 rounded-lg border-2 transition-colors',
                          darkMode
                            ? 'bg-green-900 border-green-700 hover:bg-green-800'
                            : 'bg-green-50 border-green-200 hover:bg-green-100'
                        )}
                      >
                        <div className='flex items-center justify-between'>
                          <div>
                            <p className='font-bold text-lg'>
                              {idx + 1}. {eq.jugador?.nombre || 'Jugador'}
                            </p>
                            <p className='text-sm opacity-75'>
                              {eq.jugador?.apodo}
                            </p>
                          </div>
                          <Users className='w-5 h-5 opacity-50' />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suplentes */}
              {suplentes.length > 0 && (
                <div>
                  <h3 className='text-lg font-bold mb-4 flex items-center gap-2'>
                    <span className='text-2xl'>🟡</span>
                    Suplentes ({suplentes.length})
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {suplentes.map((eq, idx) => (
                      <div
                        key={eq.id}
                        className={clsx(
                          'p-4 rounded-lg border-2 opacity-75 transition-colors',
                          darkMode
                            ? 'bg-yellow-900 border-yellow-700 hover:bg-yellow-800 hover:opacity-100'
                            : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:opacity-100'
                        )}
                      >
                        <div className='flex items-center justify-between'>
                          <div>
                            <p className='font-bold'>
                              S{idx + 1}. {eq.jugador?.nombre || 'Jugador'}
                            </p>
                            <p className='text-sm opacity-75'>
                              {eq.jugador?.apodo}
                            </p>
                          </div>
                          <Users className='w-5 h-5 opacity-50' />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {total === 0 && (
                <p className='text-center opacity-75'>No hay jugadores asignados</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
