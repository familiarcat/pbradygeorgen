// Import the default configuration from Expo
const { getDefaultConfig } = require("expo/metro-config")

// Importing exclusionList to maintain custom blacklist functionality
const exclusionList = require("metro-config/src/defaults/exclusionList")

// Load the default Expo Metro configuration based on your project's location
const config = getDefaultConfig(__dirname)

// Custom blacklist regex pattern for files to be ignored by Metro
const amplifyPattern = /amplify\/#current-cloud-backend\/.*/

// Adding JSON file support and maintaining other configurations
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
  babelTransformerPath: require.resolve("metro-react-native-babel-transformer"),
}

// Update resolver to include JSON in the source extensions
config.resolver = {
  ...config.resolver,
  blacklistRE: exclusionList([amplifyPattern]),
  assetExsts: [...config.resolver.assetExts, "json"], // Include JSON files
  sourceExts: [...config.resolver.sourceExts, "json", "mjs", "cjs"], // Include JSON files,
  extraNodeModules: require("node-libs-react-native"),
}

// Export the modified config
module.exports = config

// const { getDefaultConfig } = require("metro-config")

// module.exports = (async () => {
//   const {
//     resolver: { sourceExts, assetExts },
//   } = await getDefaultConfig()
//   return {
//     transformer: {
//       babelTransformerPath: require.resolve("react-native-svg-transformer"),
//     },
//     resolver: {
//       assetExts: assetExts.filter((ext) => ext !== "svg"),
//       sourceExts: [...sourceExts, "json", "svg"], // ensure 'json' is listed here
//     },
//   }
// })()
