module.exports = {
  content: ['./src/renderer/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      colors: {
        dos: {
          blue: '#0000AA',
          gray: '#AAAAAA',
          white: '#FFFFFF',
          yellow: '#FFFF55',
          cyan: '#55FFFF',
          black: '#000000',
          'blue-bright': '#5555FF',
          'gray-bright': '#FFFFFF',
          'green': '#00AA00',
          'green-bright': '#55FF55',
          'red': '#AA0000',
          'red-bright': '#FF5555',
          'magenta': '#AA00AA',
          'magenta-bright': '#FF55FF',
          'brown': '#AA5500',
        },
        modern: {
          'bg-dark': '#0b0b14',
          'bg-surface': '#16162a',
          'bg-elevated': '#1f1f3a',
          'bg-hover': '#24244a',
          'accent': '#6366f1',
          'accent-light': '#818cf8',
          'accent-dark': '#4f46e5',
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444',
          'text-primary': '#f8fafc',
          'text-secondary': '#94a3b8',
          'text-muted': '#475569',
          'border': '#2d2d4d',
          'border-light': '#383863',
        }
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 20px -5px rgba(99, 102, 241, 0.1)',
        'premium-hover': '0 20px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px -5px rgba(99, 102, 241, 0.2)',
      },
      fontFamily: {
        dos: ['Fixedsys', 'monospace'],
        modern: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    }
  },
  plugins: []
}

