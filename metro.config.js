// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config")
const exclusionList = require("metro-config/src/defaults/exclusionList")

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)
const filePathRegex = /^amplify\/#current-cloud-backend\/function\/openAI\/src\/package\.json$/

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
})
config.resolver.blacklistRE = /amplify\/#current-cloud-backend\/.*/
module.exports = config
