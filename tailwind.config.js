/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0F9',
          100: '#CCE0F4',
          200: '#99C2E9',
          300: '#66A3DE',
          400: '#3385D3',
          500: '#0066C8',
          600: '#0052A0',
          700: '#003D78',
          800: '#002950',
          900: '#001428',
        },
        secondary: {
          50: '#E6F7FF',
          100: '#CCF0FF',
          200: '#99E0FF',
          300: '#66D1FF',
          400: '#33C1FF',
          500: '#00B2FF',
          600: '#008ECC',
          700: '#006B99',
          800: '#004766',
          900: '#002433',
        },
        accent: {
          50: '#FFF4E6',
          100: '#FFE9CC',
          200: '#FFD399',
          300: '#FFBD66',
          400: '#FFA733',
          500: '#FF9100',
          600: '#CC7400',
          700: '#995700',
          800: '#663A00',
          900: '#331D00',
        },
        success: '#10B981',
        warning: '#FBBF24',
        error: '#EF4444',
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'card-hover': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
    extend: {},
  },
  plugins: [],
};
