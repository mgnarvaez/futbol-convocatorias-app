import React, { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { Sede } from '../../types';
import { supabase } from '../../services/supabaseClient';
import { CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export const InscripcionForm: React.FC = () => {
  const { darkMode, setError } = useAppStore();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    sede_preferida: 'CANTON' as Sede,
    flexible: false,
    juega_con_lluvia: false
  });

  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setLocalError(null);

    try {
      // Validar formulario
      if (!formData.nombre.trim() || !formData.email.trim()) {
        throw new Error('Por favor completa nombre y email');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Email inválido');
      }

      // 1. Crear o actualizar jugador
      const { data: jugador, error: errorJugador } = await supabase
        .from('jugadores')
        .upsert([
          {
            email: formData.email.toLowerCase(),
            nombre: formData.nombre,
            apodo: formData.nombre,
            sede_preferida: formData.sede_preferida,
            flexible: formData.flexible,
            juega_con_lluvia: formData.juega_con_lluvia,
            activo: true
          }
        ], { onConflict: 'email' })
        .select()
        .single();

      if (errorJugador) throw errorJugador;

      // 2. Obtener convocatoria de hoy
      const hoy = new Date().toISOString().split('T')[0];
      const { data: convocatoria, error: errorConv } = await supabase
        .from('convocatorias')
        .select('id')
        .eq('fecha', hoy)
        .single();

      if (errorConv) {
        throw new Error('No hay convocatoria abierta para hoy');
      }

      // 3. Crear inscripción
      const { error: errorInsc } = await supabase
        .from('inscripciones')
        .insert([
          {
            convocatoria_id: convocatoria.id,
            jugador_id: jugador.id,
            sede_preferida: formData.sede_preferida,
            flexible: formData.flexible,
            juega_con_lluvia: formData.juega_con_lluvia,
            timestamp_inscripcion: new Date().toISOString(),
            estado: 'NO_ASIGNADO'
          }
        ]);

      if (errorInsc) throw errorInsc;

      setEnviado(true);
      setFormData({
        nombre: '',
        email: '',
        sede_preferida: 'CANTON',
        flexible: false,
        juega_con_lluvia: false
      });

      // Reset mensaje de éxito después de 5 segundos
      setTimeout(() => setEnviado(false), 5000);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al inscribirse';
      setLocalError(mensaje);
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-300',
      darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    )}>
      <div className='max-w-md mx-auto px-4 py-12 sm:px-6 lg:px-8'>
        <div className={clsx(
          'rounded-lg shadow-lg p-8',
          darkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <h1 className='text-3xl font-bold text-center mb-2'>⚽ Inscripción</h1>
          <p className='text-center text-sm mb-6 opacity-75'>
            Completa el formulario para inscribirte en la convocatoria
          </p>

          {enviado && (
            <div className='mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex gap-3'>
              <CheckCircle className='w-5 h-5 flex-shrink-0' />
              <div>
                <p className='font-bold'>¡Inscripción exitosa!</p>
                <p className='text-sm'>Espera a que se armen los equipos</p>
              </div>
            </div>
          )}

          {localError && (
            <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex gap-3'>
              <AlertCircle className='w-5 h-5 flex-shrink-0' />
              <span>{localError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Nombre */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Nombre / Apodo *
              </label>
              <input
                type='text'
                name='nombre'
                value={formData.nombre}
                onChange={handleChange}
                placeholder='ej: Juan o "El Pelado"'
                className={clsx(
                  'w-full px-4 py-3 rounded-lg border-2 transition-colors',
                  darkMode
                    ? 'bg-gray-700 border-gray-600 focus:border-futbol-green text-white'
                    : 'bg-white border-gray-300 focus:border-futbol-green'
                )}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                Email *
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='tu@email.com'
                className={clsx(
                  'w-full px-4 py-3 rounded-lg border-2 transition-colors',
                  darkMode
                    ? 'bg-gray-700 border-gray-600 focus:border-futbol-green text-white'
                    : 'bg-white border-gray-300 focus:border-futbol-green'
                )}
                required
              />
            </div>

            {/* Sede Preferida */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                🏟️ Sede Preferida *
              </label>
              <select
                name='sede_preferida'
                value={formData.sede_preferida}
                onChange={handleChange}
                className={clsx(
                  'w-full px-4 py-3 rounded-lg border-2 font-medium transition-colors',
                  darkMode
                    ? 'bg-gray-700 border-gray-600 focus:border-futbol-green text-white'
                    : 'bg-white border-gray-300 focus:border-futbol-green'
                )}
              >
                <option value='CANTON'>20:00 hs - CANTÓN</option>
                <option value='SM'>20:00 hs - SAN MATÍAS (SM)</option>
                <option value='PUERTOS'>21:15 hs - PUERTOS</option>
              </select>
              <p className='text-xs mt-2 opacity-60'>
                Selecciona dónde prefieres jugar
              </p>
            </div>

            {/* Flexible */}
            <div className='space-y-3'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  name='flexible'
                  checked={formData.flexible}
                  onChange={handleChange}
                  className='w-5 h-5 rounded'
                />
                <span className='text-sm font-medium'>
                  ¿Eres flexible de sede?
                </span>
              </label>
              <p className='text-xs opacity-60 ml-8'>
                Si marcas sí, podrás jugar en otra sede si no hay lugar en tu preferida
              </p>
            </div>

            {/* Juega con lluvia */}
            <div className='space-y-3'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  name='juega_con_lluvia'
                  checked={formData.juega_con_lluvia}
                  onChange={handleChange}
                  className='w-5 h-5 rounded'
                />
                <span className='text-sm font-medium'>
                  🌧️ Juego aunque llueva
                </span>
              </label>
              <p className='text-xs opacity-60 ml-8'>
                Si no marcas, no entrarás si se suspende por lluvia
              </p>
            </div>

            {/* Botón Submit */}
            <button
              type='submit'
              disabled={cargando}
              className={clsx(
                'w-full px-6 py-4 rounded-lg font-bold text-lg transition-colors',
                cargando
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-futbol-green hover:bg-green-600 text-white'
              )}
            >
              {cargando ? '⏳ Inscribiendo...' : '✅ INSCRIBIRSE'}
            </button>

            <p className='text-xs text-center opacity-60'>
              Tu inscripción se procesará cuando el admin arme los equipos
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
