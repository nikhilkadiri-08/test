/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#07090e',
          800: '#0f131a',
          700: '#1b202c',
          600: '#2b3244',
        },
        requirement: {
          mandatory: '#ef4444', // Red
          recommended: '#eab308', // Yellow/Gold
          bonus: '#22c55e', // Green
        }
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-size': '24px 24px',
      },
    },
  },
  plugins: [],
}
