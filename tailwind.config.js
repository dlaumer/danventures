module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        backgroundgray: '#e9e9e9',
        navyblue: '#001C6A',
        hoverblue: '#0045FF',
        basegreen: '#023E00',
        hovergreen: '#0F8600',
        hovergreenLight: '#14AF00',
        winered: '#580000',
        backgroundblue: '#C9ECFF',
        midgrey: '#e9e9e9',
        darkergrey: '#3c3c3c',
        infoPanel: '#ffd900',
        headergreen: '#8dac5665',
        projectgreen: '#A2C367',
        activeBlue: '#6c93ff8b',
        mainyellow: "#FFD37F",
        mainYellowLighter: "#FFE4A3",
        lighergray: "#f3f3f3",
        bordergrey: "#999999",
        waypoint: "#005CE6",
        car: '#73B2FF',
        truck: '#73DFFF',
        boat: '#FF7F7F',
        bus: '#A7C636',
        ferry: '#FFAA00',
        foot: '#C500FF',
        rentalCar: '#FFFF00',
        plane: '#000000',
        train: '#38a800',
        taxi: '#00e6a9',

      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
