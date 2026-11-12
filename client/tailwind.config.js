/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C55D9',
          hover: '#5841C5',
          light: '#E9E5FA',
          50: '#F5F3FF',
          100: '#E9E5FA',
          200: '#D4CCF7',
          300: '#B4A5F0',
          400: '#8E77E7',
          500: '#6C55D9',
          600: '#5841C5',
          700: '#4632A3',
          800: '#382782',
          900: '#2E216B',
        },
        surface: {
          light: '#FFFFFF',
          muted: '#F7F5F1',
          border: '#EAEAEA',
          card: '#FFFFFF',
          dark: '#18181B',
          darkCard: '#27272A',
          sepia: '#F4ECD8',
          sepiaCard: '#EAE0C8',
        },
        content: {
          main: '#242424',
          secondary: '#777777',
          muted: '#A0A0A0',
          dark: '#E4E4E7',
          sepia: '#433422',
        }
      },
      fontFamily: {
        khmer: ['Battambang', 'Hanuman', 'system-ui', 'sans-serif'],
        khmerTitle: ['Hanuman', 'Battambang', 'serif'],
        sans: ['Inter', 'Battambang', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Hanuman', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(108, 85, 217, 0.08), 0 4px 16px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 30px -4px rgba(108, 85, 217, 0.15)',
      }
    },
  },
  plugins: [],
}
