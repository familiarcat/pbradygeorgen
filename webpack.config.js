const createExpoWebpackConfigAsync = require("@expo/webpack-config")
const path = require('path')
const webpack = require('webpack')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Optionally turn on/off HMR
      hot: true,
    },
    argv,
  )

  // Add support for AWS Amplify
  config.resolve.alias = {
    ...config.resolve.alias,
    '@aws-amplify/core': path.resolve(__dirname, 'node_modules/@aws-amplify/core'),
    'aws-amplify': path.resolve(__dirname, 'node_modules/aws-amplify'),
  }

  // Fix for crypto modules in webpack 5
  if (!config.resolve.fallback) {
    config.resolve.fallback = {}
  }

  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    'process/browser': require.resolve('process/browser'),
  }

  // Add polyfills
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
