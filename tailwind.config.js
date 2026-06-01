/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          500: '#2b4cba',
          600: '#1e3a9f',
          700: '#162e85',
          800: '#0f2070',
          900: '#091659',
        }
      }
    }
  },
  plugins: []
}
