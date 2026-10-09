/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/historias/hu2/**/*.{js,jsx}'],

  important: '.hu2-scope',

  corePlugins: {
    preflight: false,
  },

  theme: {
    extend: {
      colors: {
        primary: '#8a1f35',
        'primary-dark': '#681426',
        fondo: '#faf8f6',
        borde: '#ded5d2',
        texto: '#241b1d',
        suave: '#6f6265',
      },
    },
  },

  plugins: [],
}