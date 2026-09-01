import React, { useEffect } from 'react';
import { useAppStore } from './stores/appStore';import { AdminPanel } from './components/Dashboard/AdminPanel';
import { InscripcionForm } from './components/Convocatorias/InscripcionForm';
import { EquiposView } from './components/Equipos/EquiposView'; // Incluimos la vista de equipos
import clsx from 'clsx';

type AppView = 'admin' | 'inscripcion' | 'equipos';

export const App: React.FC = () => {
  const { darkMode, cargarJugadores } = useAppStore();
  const [currentView, setCurrentView] = React.useState<AppView>('admin');

  useEffect(() => {
    cargarJugadores();
  }, [cargarJugadores]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-300',
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'
    )}>
      {/* Botones de Navegación Flotantes */}
      <div className="fixed bottom-8 right-8 z-50 flex gap-3">
        {currentView !== 'admin' && (
          <button
            onClick={() => setCurrentView('admin')}
            className="px-5 py-3 rounded-lg font-bold bg-gray-800 hover:bg-gray-700 text-white shadow-lg flex items-center gap-2"
          >
            🎛️ Panel Admin
          </button>
        )}
        {currentView !== 'inscripcion' && (
          <button
            onClick={() => setCurrentView('inscripcion')}
            className="px-5 py-3 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center gap-2"
          >
            📝 Inscripción
          </button>
        )}
        {currentView !== 'equipos' && (
          <button
            onClick={() => setCurrentView('equipos')}
            className="px-5 py-3 rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg flex items-center gap-2"
          >
            ⚽ Equipos
          </button>
        )}
      </div>

      {/* Renders de Vistas */}
      <main className="p-4">
        {currentView === 'admin' && <AdminPanel />}
        {currentView === 'inscripcion' && <InscripcionForm />}
        {currentView === 'equipos' && <EquiposView />}
      </main>
    </div>
  );
};

export default App;
