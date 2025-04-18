// RootNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { observer } from "mobx-react-lite";
import ResumePDFScreen from "../screens/ResumePDFScreen";
import { AppStackParamList } from "./AppNavigator";

// Create a separate stack for the PDF screen only
const PDFStack = createNativeStackNavigator<Pick<AppStackParamList, "ResumePDFScreen">>();

export const RootNavigator = observer(function RootNavigator() {
  console.log('RootNavigator rendering - showing only PDF screen');

  return (
    <PDFStack.Navigator screenOptions={{ headerShown: false }}>
      <PDFStack.Screen
        name="ResumePDFScreen"
        component={ResumePDFScreen}
      />
    </PDFStack.Navigator>
  );
});
