/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1C1B19',
        paper: '#FAF8F4',
        panel: '#FFFFFF',
        line: '#E7E2D8',
        brand: {
          DEFAN: '#1F6F5C',
          50: '#EBF5F2',
          100: '#CFE7DF',
          300: '#7FBFA9',
          500: '#1F6F5C',
          600: '#185A4A',
          700: '#124538'
        },
        amber: {
          400: '#E3A21A',
          500: '#C88913'
        },
        danger: '#B5443A'
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      borderRadius: {
        card: '10px'
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,27,25,0.06), 0 1px 12px rgba(28,27,25,0.04)'
      }
    }
  },
  plugins: []
}
