module.exports = {
  theme: {
    boxShadow: {
      outline: '0 0 0 3px rgba(62,48,92,0.5)'
    },
    fontFamily: {
      display: "'Open Sans', sans-serif"
    },
    extend: {
      colors: {
        'gray-850': '#374357',
        'gray-dark': '#121819',
        'gray-lighter': '#202829',
        'gray-light': '#4B5354',
        'accent-1': '#ff715b',
        'accent-2': '#700353',
        'textclr': '#dadada'
      }
    }
  },
  variants: {
    borderWidth: ['responsive', 'last', 'hover', 'focus']
  },
  plugins: []
}
