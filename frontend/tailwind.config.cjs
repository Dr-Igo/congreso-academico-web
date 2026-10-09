/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/historias/hu2/**/*.{js,jsx}',
    './src/Hu4App.jsx',
    './src/components/hu4/**/*.{js,jsx}',
    './src/pages/hu4/**/*.{js,jsx}',
  ],

  important: '.tailwind-scope',

  corePlugins: {
    preflight: false,
  },

  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        fondo: 'var(--fondo)',
        borde: 'var(--borde)',
        texto: 'var(--texto)',
        suave: 'var(--suave)',

        'primary-soft': 'var(--primary-soft)',
        accent: 'var(--accent)',
        bg: 'var(--background)',
        surface: 'var(--surface)',
        line: 'var(--border)',
        ink: 'var(--text)',
        muted: 'var(--text-muted)',
        success: 'var(--success)',
        'success-soft': 'var(--success-soft)',
        warning: 'var(--warning)',
        'warning-soft': 'var(--warning-soft)',
        danger: 'var(--danger)',
        'danger-soft': 'var(--danger-soft)',
        info: 'var(--info)',
        'info-soft': 'var(--info-soft)',
      },

      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },

      boxShadow: {
        modal: '0 10px 28px rgba(31, 26, 27, 0.2)',
      },
    },
  },

  plugins: [],
}