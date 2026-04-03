import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#F6F1E7',
        'on-background': '#2F3A4A',
        primary: '#7A9CB6',
        secondary: '#E7E1D6',
        outline: '#D8CEC0',
        surface: '#FBF7F0',
        accent: '#98AB7B',
        'surface-variant': '#EEE7DC',
        'on-surface-variant': '#5B6672'
      },
      fontFamily: {
        headline: ['Cormorant Garamond', 'serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
        chinese: ['LXGW WenKai', 'serif']
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem'
      }
    }
  }
} satisfies Config
