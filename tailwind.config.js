/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        studio: {
          bg: 'rgb(5 5 6 / <alpha-value>)',
          surface: 'rgb(12 12 14 / <alpha-value>)',
          card: 'rgb(17 17 19 / <alpha-value>)',
          muted: 'rgb(58 58 60 / <alpha-value>)',
          gray: 'rgb(99 99 102 / <alpha-value>)',
          silver: 'rgb(142 142 147 / <alpha-value>)',
          light: 'rgb(174 174 178 / <alpha-value>)',
          cream: 'rgb(229 229 234 / <alpha-value>)',
          white: 'rgb(245 245 247 / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}
