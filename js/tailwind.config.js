tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#1D4ED8', light: '#3B82F6', dark: '#1E3A8A' },
        accent:    '#60A5FA',
        midnight:  '#0F172A',
        sky:       '#E0F2FE',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'float':     'float 3s ease-in-out infinite',
        'fade-up':   'fadeUp 0.6s ease forwards',
        'pulse-slow':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        fadeUp:  { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
};
