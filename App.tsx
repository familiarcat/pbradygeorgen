import App from "./app/app"
import React, { useEffect } from "react"
import * as SplashScreen from "expo-splash-screen"

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  useEffect(() => {
    console.log("new push to prod")
  }, [])

  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default IgniteApp
