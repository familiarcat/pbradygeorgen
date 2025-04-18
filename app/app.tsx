// App.tsx
import React from "react"
import { useFonts } from "expo-font"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import * as Linking from "expo-linking"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import * as storage from "./utils/storage"
import { customFontsToLoad } from "./theme"
import Config from "./config"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ViewStyle } from "react-native"
import { DemoShowroomScreen } from "./screens"
import { AmplifyProvider } from "./components/AmplifyProvider"

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

// Web linking configuration
const prefix = Linking.createURL("/")
const config = {
  screens: {
    // Define the root path to go to ResumePDFScreen
    ResumePDFScreen: {
      path: "",
    },
    ResumeScreen: "resume",
    ResumeWizardNavigator: "wizard",
    LoginScreen: "login",
    DemoShowroomScreen: "demo"
  },
}

interface AppProps {
  hideSplashScreen: () => Promise<boolean>
}

function App(props: AppProps) {
  const { hideSplashScreen } = props
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded] = useFonts(customFontsToLoad)

  const linking = {
    prefixes: [prefix],
    config,
  }

  if (!isNavigationStateRestored || !areFontsLoaded) return null

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AmplifyProvider>
          <GestureHandlerRootView style={$container}>
            <AppNavigator
              linking={linking} // Pass linking configuration here
              initialState={initialNavigationState} // Pass initial navigation state
              onStateChange={onNavigationStateChange} // Handle state changes
            />
          </GestureHandlerRootView>
        </AmplifyProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  )
}

export default App

const $container: ViewStyle = {
  flex: 1,
}
