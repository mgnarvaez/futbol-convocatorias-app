# Futbol Convocatorias App

PWA para gestionar convocatorias de fútbol amateur.

## Características

- 📱 Progressive Web App
- 🎯 Panel de control administrativo
- ⚽ Inscripción de jugadores
- 🤖 Armado automático de equipos
- 🌦️ Control de suspensiones por lluvia
- 📊 Reportes y estadísticas
- 🌙 Modo oscuro
- 📲 Responsive Design

## Instalación

```bash
npm install
```

## Variables de Entorno

Crear archivo `.env.local`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── components/       # Componentes React
├── services/        # Servicios de datos
├── stores/          # Estado global (Zustand)
├── types/           # Tipos TypeScript
├── App.tsx          # Componente principal
├── main.tsx         # Entry point
└── index.css        # Estilos globales
```

## Tecnologías

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Zustand
- Lucide Icons

## Licencia

Privado
.
