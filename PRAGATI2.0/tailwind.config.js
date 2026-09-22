/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: '#070E1E',
          navy: {
            950: '#060D1D',
            900: '#0B1528',
            850: '#0F1C36',
            800: '#142546',
            700: '#1E3664',
            600: '#2A4B87',
            500: '#3B65B3',
          },
          blue: {
            700: '#0369A1',
            600: '#0284C7',
            500: '#0EA5E9',
            400: '#38BDF8',
            100: '#E0F2FE',
            50: '#F0F9FF',
          },
          accent: '#0284C7',
          gold: '#F59E0B',
          saffron: '#FF671F',
          green: '#046A38',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          surface: '#0F172A',
          card: '#1E293B',
          border: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gov-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'gov-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'gov-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'gov-glow': '0 0 20px -5px rgba(2, 132, 199, 0.3)',
      }
    },
  },
  plugins: [],
}
