/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      // Shared type scale — derived from the clamp() values already established
      // per-heading across the site, formalized so new sections (Fase B) draw
      // from the same rhythm instead of inventing their own sizes.
      fontSize: {
        display:  ['clamp(2.4rem, 5.6vw, 6.5rem)',  { lineHeight: '0.88', letterSpacing: '-0.025em' }],
        h1:       ['clamp(2.2rem, 5vw, 4.5rem)',    { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        h2:       ['clamp(1.9rem, 4vw, 3.6rem)',    { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        h3:       ['clamp(1.15rem, 2vw, 1.5rem)',   { lineHeight: '1.2' }],
        'body-lg':['clamp(0.95rem, 1.1vw, 1.05rem)',{ lineHeight: '1.8' }],
        body:     ['0.85rem',                        { lineHeight: '1.75' }],
        label:    ['0.625rem',                       { lineHeight: '1', letterSpacing: '0.32em' }],
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
        // Browser-chrome signature section — the studio's own Instagram
        // carousel identity (real browser-window framing), reused here.
        // Kept scoped to that one section; the emerald accent elsewhere
        // still owns "availability/status" so the two never compete.
        chrome: {
          canvas: '#050505',
          bar: '#17171a',
          pill: '#232326',
          accent: '#C2793E',
        },
      },
    },
  },
  plugins: [],
}
