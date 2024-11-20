/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cobalt: {
          // 50: '#f0f4fc',
          100: '#dbe3f7',
          200: '#bccbef',
          300: '#92a9e4',
          400: '#6682d7',
          500: '#4763ca',
          600: '#3649bc', // Main cobalt blue
          700: '#2f3d9e',
          800: '#2c3582',
          900: '#283169',
          950: '#1b1f40',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}