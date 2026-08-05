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
      // Containers — exactly two. Every section width in the site derives
      // from one of these; nothing else is allowed to invent a measure.
      maxWidth: {
        wide: 'var(--container-wide)',
        text: 'var(--container-text)',
      },
      // Modular scale, ratio 1.25, floor at 12.8px. The two `display-*`
      // steps are fluid so type scales continuously instead of stepping
      // between breakpoints.
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        md: 'var(--text-md)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
        'display-hero': 'var(--display-hero)',
        'display-section': 'var(--display-section)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      spacing: {
        '2xs': 'var(--space-2xs)',
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        '4xl': 'var(--space-4xl)',
        gutter: 'var(--gutter)',
        tap: 'var(--tap-min)',
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        reveal: 'var(--dur-reveal)',
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
