const webpackMerge = require('webpack-merge')
const [web, server] = require('./webpack/webpack.common')

if (process.env.NODE_ENV === 'server') {
  module.exports = server
} else {
  /* eslint-disable-next-line global-require,import/no-dynamic-require */
  const envConfig = require(`./webpack/webpack.${process.env.NODE_ENV}.js`)

  module.exports = [webpackMerge(web, envConfig), server]
}
