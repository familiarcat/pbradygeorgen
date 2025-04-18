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
import ResumePDFScreen from "../screens/ResumePDFScreen"

export type AppStackParamList = {
  ResumeScreen: undefined
  ResumeWizardNavigator: undefined
  LoginScreen: undefined
  ResumePDFScreen: { uri: string } | undefined
}

const Stack = createNativeStackNavigator<AppStackParamList>()

interface AppNavigatorProps extends Partial<NavigationContainerProps> {
  linking?: any;
  initialState?: any;
  onStateChange?: (state: any) => void;
} // Ensure props are extendable from NavigationContainerProps

const AppStack = observer(function AppStack() {
  console.log('App rendering - showing content without authentication');

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ResumePDFScreen"
    >
      <Stack.Screen
        name="ResumePDFScreen"
        component={ResumePDFScreen}
        initialParams={{ uri: 'https://pbradygeorgen.com/resume.pdf' }}
      />
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
