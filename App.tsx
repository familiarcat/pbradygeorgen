import App from "./app/app"
import React, { useEffect } from "react"
import * as SplashScreen from "expo-splash-screen"
import { configureAmplify } from "./app/config/amplify-config"

// Initialize Amplify
configureAmplify()

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  useEffect(() => {
    console.log("new push to prod - April 2025 update")
  }, [])

  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default IgniteApp
