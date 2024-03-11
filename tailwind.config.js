import daisyui from 'daisyui';
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        'xl': '1441px',
        'xxl': '1921px',
        // autres breakpoints
      },
      colors: {
        'primary': '#add8e6',         // Bleu pastel doux
        'primary-dark': '#8be9fd',    // Émeraude foncée
        'secondary': '#96cda5',       // Corail doux
        'secondary-dark': '#ff79c6',  // Violet lavande
        'background': '#e5e7eb',      // Blanc cassé
        'background-dark': '#282a36', // Bleu marine foncé
        'textColor': '#333333',            // Gris foncé
        'textColor-dark': '#E7E7E7',       // Gris clair
        'border': '#DDDDDD',          // Gris clair
        'border-dark': '#4C5C68',     // Gris foncé
      },

      animation:{
        "navArrow": 'squish 1.5s linear infinite',
        
      },
      keyframes:{
        squish: {
          '0%,100%':{transform: 'translateY(-50%) scale(1)'},
          '50%': {transform: 'translateY(-50%) scale(0.8)'}
        },
        
      },
    },
  },
  daisyui: {
    themes: []
  },
  plugins: [daisyui],
}