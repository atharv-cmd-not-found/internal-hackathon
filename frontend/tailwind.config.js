/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#0f1117',
        surface: '#1a1d27',
        success: '#22c55e',
        warning: '#eab308',
        danger: '#ef4444',
      }
    },
  },
  plugins: [],
}
