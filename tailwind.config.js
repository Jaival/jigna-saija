/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
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
        "blue-dark": "#001B29",
        "light-periwinkle": "#C3C9E9",
        "black": "#00171F",
        "earth-yellow": "#E9B872",
        "cg-blue": "#407899",
        "amaranth-purple": "#A40E4C",
        "dogwood-rose": "#BC1058",
        "aquamarine": "#264653",
        "sandy-brown": "#F4A261",
        "eton-blue": "#82C09A",
        "dark-sea-green": "#92C8A7",
        "star-command-blue": "#0E79B2",
        "magic-mint": "#B2FFD6",
        "gray-dark": "#8e9aaf",
        "gray-light": "#cbc0d3",
        "gray": "#adb5bd",
        "white-dark": "#E7F0FF", // Alice blue
        "text-holder": "#C2D8FF", //Periwinkle Crayola
        "white": "#F2F5FF",
      },
      transitionDuration: {
        0: "0ms",
        2000: "2000ms",
        4000: "4000ms",
      },
    },
  },
  plugins: [],
}
