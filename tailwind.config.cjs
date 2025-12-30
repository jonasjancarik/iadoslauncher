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
          'bg-dark': '#0f0f1a',
          'bg-surface': '#1a1a2e',
          'bg-elevated': '#252542',
          'bg-hover': '#2d2d4a',
          'accent': '#6366f1',
          'accent-light': '#818cf8',
          'accent-dark': '#4f46e5',
          'success': '#22c55e',
          'warning': '#f59e0b',
          'error': '#ef4444',
          'text-primary': '#f1f5f9',
          'text-secondary': '#94a3b8',
          'text-muted': '#64748b',
          'border': '#334155',
          'border-light': '#475569',
        }
      },
      fontFamily: {
        dos: ['Fixedsys', 'monospace'],
        modern: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    }
  },
  plugins: []
}

