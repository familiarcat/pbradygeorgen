import React from "react"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import {
  ResumeWizardScreen,
  ContactInformationScreen,
  EducationScreen,
  ExperienceScreen,
  SkillScreen,
  AccomplishmentScreen,
  DegreeScreen,
  SummaryScreen,
  EngagementScreen,
} from "../screens"

export type ResumeWizardNavigatorParamList = {
  ResumeWizard: undefined
  ContactInformation: undefined
  Education: undefined
  Experience: undefined
  Skill: undefined
  Accomplishment: undefined
  Degree: undefined
  Summary: undefined
  Engagement: undefined
}

// Define the type for the screen props
export type ResumeWizardNavigatorScreenProps<T extends keyof ResumeWizardNavigatorParamList> =
  NativeStackScreenProps<ResumeWizardNavigatorParamList, T>

const Stack = createNativeStackNavigator<ResumeWizardNavigatorParamList>()

export const ResumeWizardNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ResumeWizard" component={ResumeWizardScreen} />
      {/* <Stack.Screen name="ContactInformation" component={ContactInformationScreen} /> */}
      {/* <Stack.Screen name="Education" component={EducationScreen} /> */}
      <Stack.Screen name="Experience" component={ExperienceScreen} />
      {/* <Stack.Screen name="Skill" component={SkillScreen} /> */}
      {/* <Stack.Screen name="Accomplishment" component={AccomplishmentScreen} /> */}
      {/* <Stack.Screen name="Degree" component={DegreeScreen} /> */}
      {/* <Stack.Screen name="Summary" component={SummaryScreen} /> */}
      {/* <Stack.Screen name="Engagement" component={EngagementScreen} /> */}
    </Stack.Navigator>
  )
}
