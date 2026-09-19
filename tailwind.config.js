/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        goodspan: {
          bg: '#f3f2f2',
          panel: '#eeeeee',
          ink: '#201e1d',
          line: '#8f8c89',
          orange: '#ff5f00',
        },
      },
      fontFamily: {
        sans: ['Archivo', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
