// AppNavigator.tsx
import { NavigationContainer, NavigationContainerProps } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { useColorScheme } from "react-native"
import { DarkTheme, DefaultTheme } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { ResumeScreen } from "../screens/ResumeScreen"
import { ResumeWizardNavigator } from "./ResumeWizardNavigator"
import { useAuth } from "../components/AmplifyProvider"
import { LoginScreen } from "../screens"

export type AppStackParamList = {
  ResumeScreen: undefined
  ResumeWizardNavigator: undefined
  LoginScreen: undefined
}

const Stack = createNativeStackNavigator<AppStackParamList>()

interface AppNavigatorProps extends Partial<NavigationContainerProps> {} // Ensure props are extendable from NavigationContainerProps

const AppStack = observer(function AppStack() {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      </Stack.Navigator>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="ResumeScreen" component={ResumeScreen} />
          <Stack.Screen name="ResumeWizardNavigator" component={ResumeWizardNavigator} />
        </>
      ) : (
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
      )}
    </Stack.Navigator>
  )
})

export const AppNavigator = observer(function AppNavigator({
  linking,
  initialState,
  onStateChange,
}: AppNavigatorProps) {
  const colorScheme = useColorScheme()

  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      linking={linking} // Ensure linking is passed here
      initialState={initialState}
      onStateChange={onStateChange}
    >
      <AppStack />
    </NavigationContainer>
  )
})
