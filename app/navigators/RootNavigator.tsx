// RootNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import ResumePDFScreen from "../screens/ResumePDFScreen";
import { AppStackParamList } from "./AppNavigator";
import { useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

// Create a separate stack for the PDF screen only
const PDFStack = createNativeStackNavigator<Pick<AppStackParamList, "ResumePDFScreen">>();

const PDFStackNavigator = observer(function PDFStackNavigator() {
  console.log('PDFStackNavigator rendering - showing only PDF screen');

  return (
    <PDFStack.Navigator screenOptions={{ headerShown: false }}>
      <PDFStack.Screen
        name="ResumePDFScreen"
        component={ResumePDFScreen}
      />
    </PDFStack.Navigator>
  );
});

export const RootNavigator = observer(function RootNavigator() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <PDFStackNavigator />
    </NavigationContainer>
  );
});
