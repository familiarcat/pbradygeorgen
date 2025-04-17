import App from "./app/app"
import React, { useEffect } from "react"
import * as SplashScreen from "expo-splash-screen"

// Prevent splash screen from auto-hiding
try {
  SplashScreen.preventAutoHideAsync()
} catch (e) {
  console.log('SplashScreen error:', e)
}

function IgniteApp() {
  useEffect(() => {
    console.log("App initialized - April 2025 update")

    // Hide splash screen with a delay to ensure UI is ready
    const hideSplash = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        await SplashScreen.hideAsync()
      } catch (e) {
        console.log('Error hiding splash screen:', e)
      }
    }

    hideSplash()
  }, [])

  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default IgniteApp
