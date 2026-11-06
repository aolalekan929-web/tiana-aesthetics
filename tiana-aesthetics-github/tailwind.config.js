/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        blush: '#fff0f5',
        rose: '#ff69b4',
        mauve: '#70465e',
        ink: '#333333'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['DM Sans', 'sans-serif']
      }
    }
  },
  plugins: []
};
