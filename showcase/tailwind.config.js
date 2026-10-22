export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
      },
      boxShadow: {
        glow: '0 0 60px rgba(34, 211, 238, 0.18)',
      },
    },
  },
  plugins: [],
}
