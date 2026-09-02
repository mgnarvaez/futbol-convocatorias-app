import { useState, useEffect } from 'react';
import { Users, Settings, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { obtenerInscriptos, obtenerSedes, ejecutarArmado, type Jugador, type ConfigPanel } from './services/sheetsService';
import PanelControl from './components/PanelControl';
import ListaInscriptos from './components/ListaInscriptos';
import VistaEquipos from './components/VistaEquipos';

type Tab = 'inscriptos' | 'equipos' | 'control';

export default function App() {
  const [tab, setTab] = useState<Tab>('inscriptos');
  const [inscriptos, setInscriptos] = useState<Jugador[]>([]);
  const [equipos, setEquipos] = useState<any>(null);
  const [config, setConfig] = useState<Partial<ConfigPanel>>({
    lluvia: 'SOL',
    suspension1: 'NINGUNA',
    suspension2: 'NINGUNA',
    puertos_10vs10: false,
    bajas: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cargar datos al iniciar
  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000); // Refrescar cada 30s
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    try {
      setError(null);
      const [jug, sed] = await Promise.all([
        obtenerInscriptos(),
        obtenerSedes(),
      ]);
      setInscriptos(jug);
      setEquipos(sed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    }
  };

  const handleEjecutarArmado = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const resultado = await ejecutarArmado(config);
      if (resultado.success) {
        setSuccess('✅ Equipos armados exitosamente!');
        setTimeout(() => cargarDatos(), 2000);
      } else {
        setError(resultado.error || 'Error al armar equipos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (nuevoConfig: Partial<ConfigPanel>) => {
    setConfig({ ...config, ...nuevoConfig });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b-4 border-green-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">⚽</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Convocatorias Fútbol</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Panel de control interactivo</p>
              </div>
            </div>
            <button
              onClick={cargarDatos}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 transition"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Actualizar
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          <button
            onClick={() => setTab('inscriptos')}
            className={`py-4 px-6 font-semibold flex items-center gap-2 border-b-2 transition ${
              tab === 'inscriptos'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="w-5 h-5" />
            Inscriptos
          </button>
          <button
            onClick={() => setTab('equipos')}
            className={`py-4 px-6 font-semibold flex items-center gap-2 border-b-2 transition ${
              tab === 'equipos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="w-5 h-5" />
            Equipos
          </button>
          <button
            onClick={() => setTab('control')}
            className={`py-4 px-6 font-semibold flex items-center gap-2 border-b-2 transition ${
              tab === 'control'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <Settings className="w-5 h-5" />
            Panel Control
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="max-w-7xl mx-auto px-4 mt-4 space-y-2">
        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {tab === 'inscriptos' && <ListaInscriptos inscriptos={inscriptos} />}
        {tab === 'equipos' && <VistaEquipos equipos={equipos} />}
        {tab === 'control' && (
          <PanelControl
            config={config}
            onConfigChange={handleConfigChange}
            onEjecutar={handleEjecutarArmado}
            loading={loading}
            inscriptosCount={inscriptos.length}
          />
        )}
      </main>
    </div>
  );
}
