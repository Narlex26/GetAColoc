/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#273F6D',
        'orange': {
          '400': '#FFBD59',
        },
        'blue': {
          '100': 'rgba(39, 63, 109, 0.12)',
          '200': 'rgba(176, 196, 222, 0.23)',
          '300': '#B0C4DE',
          '400': '#78A7E4',
          '500': '#1976D2',
          '600': '#78CBE4',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
