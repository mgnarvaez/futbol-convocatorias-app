import { defineConfig } from 'tailwindcss';

export default defineConfig({
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'futbol-green': '#10b981',
        'futbol-blue': '#3b82f6',
        'futbol-red': '#ef4444',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [],
});
