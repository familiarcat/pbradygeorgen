// AppNavigator.tsx
import { NavigationContainer, NavigationContainerProps } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { useColorScheme } from "react-native"
import { DarkTheme, DefaultTheme } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { ResumeScreen } from "../screens/ResumeScreen"
import { ResumeWizardNavigator } from "./ResumeWizardNavigator"
import { LoginScreen } from "../screens"

export type AppStackParamList = {
  ResumeScreen: undefined
  ResumeWizardNavigator: undefined
  LoginScreen: undefined
}

const Stack = createNativeStackNavigator<AppStackParamList>()

interface AppNavigatorProps extends Partial<NavigationContainerProps> {} // Ensure props are extendable from NavigationContainerProps

const AppStack = observer(function AppStack() {
  console.log('App rendering - showing content without authentication');

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ResumeScreen" component={ResumeScreen} />
      <Stack.Screen name="ResumeWizardNavigator" component={ResumeWizardNavigator} />
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
