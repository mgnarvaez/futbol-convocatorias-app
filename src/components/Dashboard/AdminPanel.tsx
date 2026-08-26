import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import {
  Play,
  Pause,
  Settings,
  Download,
  AlertCircle,
  Users,
  Zap,
  Cloud,
  Moon,
  Sun
} from 'lucide-react';
import { convocatoriaService } from '../../services/convocatoriaService';
import { armadorService } from '../../services/armadorService';
import { exportService } from '../../services/exportService';
import clsx from 'clsx';

export const AdminPanel: React.FC = () => {
  const {
    convocatoriaActual,
    jugadores,
    inscripciones,
    darkMode,
    toggleDarkMode,
    cargarConvocatoriaDelDia,
    abrirConvocatoria,
    cerrarConvocatoria,
    setError,
    error
  } = useAppStore();

  const [estadoLluvia, setEstadoLluvia] = useState('SOL');
  const [sedesCanceladas, setSedesCanceladas] = useState<string[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [equiposArmados, setEquiposArmados] = useState(false);

  useEffect(() => {
    cargarConvocatoriaDelDia();
  }, [cargarConvocatoriaDelDia]);

  const handleArmarEquipos = async () => {
    if (!convocatoriaActual) return;
    setProcesando(true);
    try {
      await armadorService.armarEquipos(convocatoriaActual.id);
      setEquiposArmados(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al armar equipos');
    } finally {
      setProcesando(false);
    }
  };

  const handleActualizarSuspensiones = async () => {
    if (!convocatoriaActual) return;
    try {
      await convocatoriaService.actualizarSuspensiones(
        convocatoriaActual.id,
        estadoLluvia !== 'SOL',
        sedesCanceladas
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar suspensiones');
    }
  };

  const handleExportarBackup = async () => {
    try {
      const datos = {
        convocatorias: convocatoriaActual ? [convocatoriaActual] : [],
        jugadores,
        inscripciones
      };
      const backup = await exportService.crearBackup(datos);
      const url = URL.createObjectURL(backup);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar');
    }
  };

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-300',
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    )}>
      {/* Header */}
      <header className={clsx(
        'shadow-lg',
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
        'border-b'
      )}>
        <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <Zap className='w-8 h-8 text-futbol-green' />
            <h1 className='text-3xl font-bold'>⚽ Panel de Control</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            )}
          >
            {darkMode ? <Sun className='w-5 h-5' /> : <Moon className='w-5 h-5' />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        {/* Error Alert */}
        {error && (
          <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex gap-3'>
            <AlertCircle className='w-5 h-5 flex-shrink-0' />
            <span>{error}</span>
          </div>
        )}

        {/* Estado actual */}
        {convocatoriaActual && (
          <div className={clsx(
            'mb-8 p-6 rounded-lg shadow-md',
            darkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <h2 className='text-xl font-bold mb-4'>📅 Convocatoria del Día</h2>
                <div className='space-y-2'>
                  <p className='text-sm'>
                    <strong>Fecha:</strong> {convocatoriaActual.fecha}
                  </p>
                  <p className='text-sm'>
                    <strong>Estado:</strong>
                    <span className={clsx(
                      'ml-2 px-3 py-1 rounded-full text-xs font-bold',
                      convocatoriaActual.estado === 'ABIERTA'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    )}>
                      {convocatoriaActual.estado}
                    </span>
                  </p>
                  <p className='text-sm'>
                    <strong>Inscriptos:</strong> {inscripciones.length}
                  </p>
                </div>
              </div>

              {/* Botones de control */}
              <div className='flex flex-col gap-3'>
                {convocatoriaActual.estado === 'PLANIFICADA' ? (
                  <button
                    onClick={abrirConvocatoria}
                    className='w-full px-6 py-3 bg-futbol-green text-white rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2'
                  >
                    <Play className='w-5 h-5' />
                    Abrir Convocatoria
                  </button>
                ) : (
                  <button
                    onClick={cerrarConvocatoria}
                    className='w-full px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2'
                  >
                    <Pause className='w-5 h-5' />
                    Cerrar Convocatoria
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Control de Suspensiones */}
        <div className={clsx(
          'mb-8 p-6 rounded-lg shadow-md',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <h2 className='text-xl font-bold mb-4'>🌦️ Control de Suspensiones</h2>
          
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Suspensión por lluvia</label>
              <select
                value={estadoLluvia}
                onChange={(e) => setEstadoLluvia(e.target.value)}
                className={clsx(
                  'w-full px-4 py-2 rounded-lg border-2 font-medium',
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                )}
              >
                <option value="SOL">☀️ SOL</option>
                <option value="CANTON">🏟️ CANTON</option>
                <option value="SM">🏟️ SM</option>
                <option value="PUERTOS">🏟️ PUERTOS</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>Sedes canceladas adicionales</label>
              <div className='space-y-2'>
                {['CANTON', 'SM', 'PUERTOS'].map(sede => (
                  <label key={sede} className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={sedesCanceladas.includes(sede)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSedesCanceladas([...sedesCanceladas, sede]);
                        } else {
                          setSedesCanceladas(sedesCanceladas.filter(s => s !== sede));
                        }
                      }}
                      className='w-4 h-4'
                    />
                    <span className='text-sm'>{sede}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleActualizarSuspensiones}
              className='w-full px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors'
            >
              Actualizar Suspensiones
            </button>
          </div>
        </div>

        {/* Armado de Equipos */}
        <div className={clsx(
          'mb-8 p-6 rounded-lg shadow-md border-2',
          equiposArmados
            ? darkMode
              ? 'bg-green-900 border-green-700'
              : 'bg-green-100 border-green-400'
            : darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        )}>
          <h2 className='text-xl font-bold mb-4'>⚙️ EJECUTAR ARMADO</h2>
          <p className={clsx(
            'text-sm mb-4',
            equiposArmados ? 'text-green-800' : ''
          )}>
            {equiposArmados
              ? '✅ Equipos armados correctamente'
              : 'Click en el botón para armar automáticamente'}
          </p>
          <button
            onClick={handleArmarEquipos}
            disabled={procesando || !convocatoriaActual}
            className={clsx(
              'w-full px-6 py-4 text-white rounded-lg font-bold text-lg transition-colors',
              procesando
                ? 'bg-gray-400 cursor-not-allowed'
                : equiposArmados
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-futbol-green hover:bg-green-600'
            )}
          >
            {procesando ? '⏳ Procesando...' : '▶️ ARMAR EQUIPOS AHORA'}
          </button>
        </div>

        {/* Estadísticas */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className={clsx(
            'p-6 rounded-lg shadow-md',
            darkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Total Jugadores</p>
                <p className='text-3xl font-bold'>{jugadores.length}</p>
              </div>
              <Users className='w-10 h-10 text-blue-500 opacity-20' />
            </div>
          </div>

          <div className={clsx(
            'p-6 rounded-lg shadow-md',
            darkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Inscriptos Hoy</p>
                <p className='text-3xl font-bold'>{inscripciones.length}</p>
              </div>
              <Zap className='w-10 h-10 text-yellow-500 opacity-20' />
            </div>
          </div>

          <div className={clsx(
            'p-6 rounded-lg shadow-md',
            darkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Equipos Armados</p>
                <p className='text-3xl font-bold'>{equiposArmados ? '✅' : '❌'}</p>
              </div>
              <Cloud className='w-10 h-10 text-green-500 opacity-20' />
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className='flex gap-4 flex-wrap'>
          <button
            onClick={handleExportarBackup}
            className={clsx(
              'px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2',
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            )}
          >
            <Download className='w-5 h-5' />
            Descargar Backup
          </button>

          <button
            className={clsx(
              'px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2',
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            )}
          >
            <Settings className='w-5 h-5' />
            Configuración
          </button>
        </div>
      </main>
    </div>
  );
};
