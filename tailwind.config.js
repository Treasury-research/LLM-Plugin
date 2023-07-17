const { fontFamily } = require('tailwindcss/defaultTheme')


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: 'Inter',
        eurostile: 'Eurostile',
        stretchPro: 'StretchPro',
        swis721BT: 'Swis721BT',
        swis721hv: 'Swis721hv'
      }
    },
    animation: {
      'home-gradient': 'home-gradient 11s linear infinite',
      'flash': 'flash 1s linear 1 forwards',
    },
    screens:{
      'mobile': '300px',

      'tablet': '640px',

      'md': '800px',
      
      'laptop': '1024px',

      'desktop': '1280px',
    },
    colors:{
      black: "#000",
      white: "#fff",
      green:{
        DEFAULT:'#D5F95F'
      },
    },
  },
  plugins: [
    
  ],
}