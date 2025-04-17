const createExpoWebpackConfigAsync = require("@expo/webpack-config")
const path = require('path')
const webpack = require('webpack')

module.exports = async function (env, argv) {
  // Use the default Expo webpack config
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Disable HMR for production builds
      hot: false,
    },
    argv,
  )

  // Add polyfills and fallbacks needed for AWS Amplify
  if (!config.resolve.fallback) {
    config.resolve.fallback = {}
  }

  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    process: require.resolve('process/browser'),
  }

  // Add required plugins
  if (!config.plugins) {
    config.plugins = []
  }

  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  )

  return config
}
