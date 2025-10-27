/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          50: '#f6f7f9',
          900: '#0b0f14',
        },
        accent: {
          DEFAULT: '#10B981',
          600: '#0EA271',
          700: '#0A8A60',
        },
        glass: 'rgba(255,255,255,0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 8px 40px rgba(16, 185, 129, 0.25)',
      },
    },
  },
  plugins: [],
}