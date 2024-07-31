/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D1F2A',
        secondary: '#111111',
        light: '#EEEEEE',
      },
    },
  },
  plugins: [],
}