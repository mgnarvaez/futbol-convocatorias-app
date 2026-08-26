import React, { useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import { AdminPanel } from './components/Dashboard/AdminPanel';
import { InscripcionForm } from './components/Convocatorias/InscripcionForm';
import clsx from 'clsx';

type AppView = 'admin' | 'inscripcion';

export const App: React.FC = () => {
  const { darkMode, cargarJugadores } = useAppStore();
  const [currentView, setCurrentView] = React.useState<AppView>('admin');

  useEffect(() => {
    cargarJugadores();
  }, [cargarJugadores]);

  // Aplicar dark mode al root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={clsx(
      'transition-colors duration-300',
      darkMode ? 'dark bg-gray-900' : 'bg-white'
    )}>
      {/* Navegación */}
      {currentView === 'admin' && (
        <div className={clsx(
          'fixed bottom-8 right-8 z-50',
          'flex gap-3'
        )}>
          <button
            onClick={() => setCurrentView('inscripcion')}
            className={clsx(
              'px-6 py-3 rounded-lg font-bold transition-all shadow-lg',
              'bg-futbol-blue hover:bg-blue-600 text-white',
              'flex items-center gap-2'
            )}
          >
            📝 Ir a Inscripción
          </button>
        </div>
      )}

      {currentView === 'inscripcion' && (
        <div className={clsx(
          'fixed bottom-8 right-8 z-50',
          'flex gap-3'
        )}>
          <button
            onClick={() => setCurrentView('admin')}
            className={clsx(
              'px-6 py-3 rounded-lg font-bold transition-all shadow-lg',
              'bg-futbol-green hover:bg-green-600 text-white',
              'flex items-center gap-2'
            )}
          >
            🎛️ Panel Admin
          </button>
        </div>
      )}

      {/* Contenido */}
      {currentView === 'admin' && <AdminPanel />}
      {currentView === 'inscripcion' && <InscripcionForm />}
    </div>
  );
};

export default App;
