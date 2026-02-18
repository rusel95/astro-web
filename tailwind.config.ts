import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          900: '#0a0a1a',
          800: '#12122a',
          700: '#1a1a3e',
          600: '#1a0a2e',
          500: '#16213e',
        },
        zorya: {
          gold: '#d4af37',
          'gold-light': '#E6B34D',
          'gold-dim': '#b8922e',
          purple: '#664DCC',
          violet: '#9966E6',
          blue: '#4D80E6',
          'blue-dark': '#2d5fc7',
          success: '#4DB380',
          error: '#dc2626',
        },
        primary: {
          50: 'rgba(108, 60, 225, 0.08)',
          100: 'rgba(108, 60, 225, 0.15)',
          200: 'rgba(108, 60, 225, 0.25)',
          300: 'rgba(108, 60, 225, 0.4)',
          400: '#9966E6',
          500: '#7C4DFF',
          600: '#6C3CE1',
          700: '#5A2DC5',
          800: '#4820A0',
          900: '#2D1570',
        },
        surface: {
          50: '#0a0a1a',
          100: '#12122a',
          200: '#1a1a3e',
        },
        text: {
          primary: '#e8e8f0',
          secondary: 'rgba(255,255,255,0.7)',
          muted: 'rgba(255,255,255,0.45)',
        },
        accent: {
          gold: '#d4af37',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(102, 77, 204, 0.2)',
        'glow': '0 0 20px rgba(102, 77, 204, 0.3), 0 0 60px rgba(102, 77, 204, 0.1)',
        'glow-lg': '0 0 30px rgba(102, 77, 204, 0.4), 0 0 80px rgba(153, 102, 230, 0.15)',
        'card': '0 2px 16px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'button': '0 4px 20px rgba(108, 60, 225, 0.4)',
      },
    },
  },
  plugins: [],
};
export default config;
