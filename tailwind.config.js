/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#080b11',
          secondary: '#0f131a',
          tertiary:  '#171d26',
          card:      'rgba(15,19,26,0.75)',
          sidebar:   '#0a0d14',
          hover:     'rgba(255,255,255,0.04)',
        },
        accent: {
          primary:   '#6366f1',
          secondary: '#06b6d4',
          'primary-hover': '#818cf8',
        },
        income:  '#10b981',
        expense: '#f43f5e',
        danger:  '#f43f5e',
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          glow:    'rgba(99,102,241,0.15)',
          hover:   'rgba(255,255,255,0.10)',
        },
        text: {
          primary:   '#f8fafc',
          secondary: '#cbd5e1',
          muted:     '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        sm:  '6px',
        md:  '10px',
        lg:  '16px',
        xl:  '24px',
        '2xl': '32px',
      },
      boxShadow: {
        sm:          '0 2px 8px rgba(0,0,0,0.2)',
        md:          '0 8px 30px rgba(0,0,0,0.3)',
        lg:          '0 16px 40px rgba(0,0,0,0.4)',
        'glow':      '0 0 20px rgba(99,102,241,0.2)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.2)',
        'glow-income': '0 0 16px rgba(16,185,129,0.15)',
        'glow-expense': '0 0 16px rgba(244,63,94,0.15)',
        'card-hover': '0 16px 40px rgba(0,0,0,0.4), 0 0 20px rgba(99,102,241,0.2)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        'gradient-accent':  'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        'gradient-dark':    'linear-gradient(180deg, #0f131a 0%, #080b11 100%)',
        'gradient-card':    'linear-gradient(145deg, rgba(15,19,26,0.9) 0%, rgba(10,13,20,0.9) 100%)',
        'gradient-income':  'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-expense': 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
        'gradient-savings': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        'gradient-balance': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%':      { transform: 'translateY(-20px) scale(1.05)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      animation: {
        'float':     'float 8s ease-in-out infinite',
        'float-rev': 'float 6s ease-in-out infinite reverse',
        'float-lg':  'float 10s ease-in-out infinite',
        'fade-in':   'fade-in 0.25s cubic-bezier(0.4,0,0.2,1) both',
        'slide-up':  'slide-up 0.3s cubic-bezier(0.4,0,0.2,1) both',
        'spin-slow': 'spin-slow 1s linear infinite',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4,0,0.2,1)',
      },
      backdropBlur: {
        card: '12px',
      },
    },
  },
  plugins: [],
};
