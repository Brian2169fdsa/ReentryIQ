import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        blue: {
          brand: '#4A90E2',
          dark: '#2E6CB8',
          deep: '#1B4178',
          100: '#EAF2FC',
          300: '#A8C9F0',
          500: '#4A90E2',
          700: '#2E6CB8',
          900: '#1B4178',
        },
      },
      fontFamily: {
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
}

export default config
