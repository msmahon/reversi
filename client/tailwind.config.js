/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{js,jsx,ts,tsx,css}",
  ],
  safelist: [
    {pattern: /grid-cols-.*/},
    {pattern: /grid-rows-.*/},
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '10': 'repeat(10, minmax(0, 1fr))',
        '11': 'repeat(11, minmax(0, 1fr))',
        '12': 'repeat(12, minmax(0, 1fr))',
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
        '17': 'repeat(17, minmax(0, 1fr))',
        '18': 'repeat(18, minmax(0, 1fr))',
        '19': 'repeat(19, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        '21': 'repeat(21, minmax(0, 1fr))',
        '22': 'repeat(22, minmax(0, 1fr))',
        '23': 'repeat(23, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
        '25': 'repeat(25, minmax(0, 1fr))',
        '26': 'repeat(26, minmax(0, 1fr))',
        '27': 'repeat(27, minmax(0, 1fr))',
        '28': 'repeat(28, minmax(0, 1fr))',
        '29': 'repeat(29, minmax(0, 1fr))',
        '30': 'repeat(30, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}
