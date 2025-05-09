/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
const colors = require('tailwindcss/colors');

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        rthin: ["roboto-thin", "sans-serif"],
        rlight: ["roboto-light", "sans-serif"],
        rmedium: ["roboto-medium", "sans-serif"],
        rbold: ["roboto-bold", "sans-serif"],
        rblack: ["roboto-black", "sans-serif"],
        satoshi: ['Satoshi', 'sans-serif'],
      },
      colors: {
        current: 'currentColor',
        transparent: 'transparent',
        white: '#FFFFFF',
        black: {
          ...colors.black,
          DEFAULT: '#1C2434',
          2: '#010101',
        },
        red: {
          ...colors.red,
          DEFAULT: '#FB5454',
        },
        body: '#64748B',
        bodydark: '#AEB7C0',
        bodydark1: '#DEE4EE',
        bodydark2: '#8A99AF',
        primary: '#3C50E0',
        secondary: '#80CAEE',
        stroke: '#E2E8F0',
        gray: {
          ...colors.gray,
          DEFAULT: '#EFF4FB',
          2: '#F7F9FC',
          3: '#FAFAFA',
        },
        graydark: '#333A48',
        whiten: '#F1F5F9',
        whiter: '#F5F7FD',
        boxdark: '#24303F',
        'boxdark-2': '#1A222C',
        strokedark: '#2E3A47',
        'form-strokedark': '#3d4d60',
        'form-input': '#1d2a39',
        meta: {
          1: '#DC3545',
          2: '#EFF2F7',
          3: '#10B981',
          4: '#313D4A',
          5: '#259AE6',
          6: '#FFBA00',
          7: '#FF6766',
          8: '#F0950C',
          9: '#E5E7EB',
          10: '#0FADCF',
        },
        success: '#219653',
        danger: '#D34053',
        warning: '#FFA70B',
      },
    },
  },
  plugins: [],
});
