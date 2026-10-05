/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#f2f9f3',
          100: '#e1f2e4',
          200: '#c5e5cb',
          300: '#99d1a3',
          400: '#67b575',
          500: '#439953',
          600: '#327c40',
          700: '#2a6335',
          800: '#254f2d',
          900: '#204227',
          950: '#0d2413',
        },
        earth: {
          50: '#faf6f0',
          100: '#f3ece0',
          200: '#e7d8bf',
          300: '#d7bc97',
          400: '#c59d6e',
          500: '#b7834e',
          600: '#a36d40',
          700: '#845336',
          800: '#6c4331',
          900: '#59392b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
