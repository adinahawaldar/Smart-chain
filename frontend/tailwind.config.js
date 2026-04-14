/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: '#4F46E5', light: '#818CF8', dark: '#3730A3' },
        teal:    { DEFAULT: '#0D9488', light: '#5EEAD4' },
        risk: {
          low:  '#6366F1',
          mid:  '#F59E0B',
          high: '#EF4444',
        },
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0,0,0,0.07)',
        float: '0 8px 32px rgba(79,70,229,0.15)',
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.28s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                        to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(10px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
