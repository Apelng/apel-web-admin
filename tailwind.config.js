/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        sidebar: {
          bg:      '#0F172A',
          hover:   '#1E293B',
          border:  '#1E293B',
          text:    '#94A3B8',
          active:  '#6366F1',
        },
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
      },
      keyframes: {
        'slide-up':   { from: { opacity: '0', transform: 'translateY(6px)' },  to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in':    { from: { opacity: '0' },                                 to: { opacity: '1' } },
        'scale-in':   { from: { opacity: '0', transform: 'scale(0.97)' },       to: { opacity: '1', transform: 'scale(1)' } },
      },
      animation: {
        'slide-up':  'slide-up 0.18s ease-out',
        'fade-in':   'fade-in 0.15s ease-out',
        'scale-in':  'scale-in 0.18s ease-out',
      },
      boxShadow: {
        card:  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        modal: '0 20px 60px -10px rgb(0 0 0 / 0.3)',
      },
    },
  },
  plugins: [],
}
