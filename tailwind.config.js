/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
        'accent': 'var(--color-accent)',
        'background': 'var(--color-background)',
        'textPrimary': 'var(--color-text-primary)',
        'textSecondary': 'var(--color-text-secondary)',
        'border': 'var(--color-border)',
        'white': 'var(--color-white)',

        'brown-dark': 'var(--color-brown-dark)',
        'brown-mid': 'var(--color-brown-mid)',
        'brown-light': 'var(--color-brown-light)',
        'cream': 'var(--color-cream)',
        'cream-light': 'var(--color-cream-light)',
        'site-bg': 'var(--color-site-bg)',
        'card-bg': 'var(--color-card-bg)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted': 'var(--color-text-muted)',
        'site-border': 'var(--color-site-border)',
        'footer-bg': 'var(--color-footer-bg)',
        'section-hdr': 'var(--color-section-hdr)',
        'gold': 'var(--color-gold)',
      },
      fontFamily: {
        urdu: ["'Pyami Nastaliq'", "'Payami Nastaleeq'", "'Noto Nastaliq Urdu'", 'serif'],
      },
    },
  },
  plugins: [],
}
