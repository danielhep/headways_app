// vue.config.js
module.exports = {
  // options...
  css: { extract: false },
  configureWebpack: {
    'sideEffects': ['*.css']
  }
}
