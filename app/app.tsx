// App.tsx - PDF-only version
import React from "react"
import { useFonts } from "expo-font"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import { customFontsToLoad } from "./theme"
import Config from "./config"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ViewStyle } from "react-native"
import { AmplifyProvider } from "./components/AmplifyProvider"

// Import the appropriate PDF viewer based on platform
import StandalonePDFViewer from "./screens/StandalonePDFViewer"

interface AppProps {
  hideSplashScreen?: () => Promise<boolean>
}

function App(_props: AppProps) {
  const [areFontsLoaded] = useFonts(customFontsToLoad)

  if (!areFontsLoaded) return null

  // PDF-only version - no navigation, no routing, just the PDF viewer
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AmplifyProvider>
          <GestureHandlerRootView style={$container}>
            <StandalonePDFViewer />
          </GestureHandlerRootView>
        </AmplifyProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App

const $container: ViewStyle = {
  flex: 1,
  width: '100%',
  height: '100%',
}
