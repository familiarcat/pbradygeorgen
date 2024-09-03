const createExpoWebpackConfigAsync = require("@expo/webpack-config")

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      // Optionally turn on/off HMR
      hot: true,
    },
    argv,
  )
  // Customize the config before returning it.
  return config
}
