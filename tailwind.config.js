/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        transparent: 'transparent',
        'aquamarine': '#264653',
        'button-blue': '#1D6793',
        'honolulu-blue': '#2278AA', 
        'blue-dark': '#001B29',
        'light-periwinkle': '#C3C9E9',
        'black': '#00171F',
        'amaranth-purple': '#A40E4C',
        'dogwood-rose': '#BC1058',
        'white-dark': '#F6F6F1', // Alice blue
        'text-holder': '#C2D8FF', //Periwinkle Crayola
        'white': '#F2F5FF',
        'white-hover': '#94a3b8',
        'gold': '#fb923c'
      },
      transitionDuration: {
        0: '0ms',
        2000: '2000ms',
        4000: '4000ms',
      },
    },
  },
  plugins: [],
}
