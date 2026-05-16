/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1a1a1a',
          dark: '#0a0a0a',
        },
        accent: {
          DEFAULT: '#b8955a',
          light: '#d4b983',
          dim: 'rgba(184, 149, 90, 0.08)',
        },
        surface: {
          DEFAULT: '#ffffff',
          2: '#fafafa',
          3: '#f5f5f5',
        },
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.08)',
          2: 'rgba(0, 0, 0, 0.12)',
          3: 'rgba(0, 0, 0, 0.18)',
        },
        success: '#3a7d52',
        error: '#c0392b',
        info: '#2c6fad',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'Times New Roman', 'serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.06)',
        DEFAULT: '0 4px 16px rgba(0, 0, 0, 0.08)',
        'md': '0 6px 24px rgba(0, 0, 0, 0.1)',
        'lg': '0 12px 40px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.4s ease-in-out',
        'fadeUp': 'fadeUp 0.5s ease-out',
        'shimmer': 'shimmer 1.6s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
        'floatY': 'floatY 5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        toastIn: {
          'from': { transform: 'translateX(110%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        progressBar: {
          'from': { transform: 'scaleX(1)' },
          'to': { transform: 'scaleX(0)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
