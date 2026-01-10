/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#03AA77',
        secondary: '#D8A663',
      },
      fontFamily: {
        sans: ['The Year of Handicrafts', 'JannatLT', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
