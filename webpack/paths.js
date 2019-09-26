const path = require('path')

module.exports = {
  root: path.resolve(__dirname, '../'),
  outputPath: path.resolve(__dirname, '../', 'build'),
  webOutputPath: path.resolve(__dirname, '../', 'build/web'),
  entryPath: path.resolve(__dirname, '../', 'src/index.jsx'),
  serverEntry: path.resolve(__dirname, '../', 'src/server.js'),
  templatePath: path.resolve(__dirname, '../', 'src/template.html'),
  faviconPath: path.resolve(__dirname, '../', 'src/assets/favicon.ico'),
  imagesFolder: 'images',
  fontsFolder: 'fonts',
  cssFolder: 'css',
  jsFolder: 'js',
}
