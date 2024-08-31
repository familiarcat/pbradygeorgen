/* eslint-disable react/jsx-key */
import React, { FC } from "react"
import {
  ImageStyle,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
  StyleSheet,
  Dimensions,
} from "react-native"
import { Button, Icon, LottieAnimation, Text, Screen } from "../components"
import { colors, typography } from "../theme"
import { createMockData, clearData } from "app/mock/mockData"

// import { Demo } from "../DemoShowroomScreen"
// import { DemoDivider } from "../DemoDivider"
// import { DemoUseCase } from "../DemoUseCase"
import LottieView from "lottie-react-native"
import PingPongAnimation from "app/components/PingPong"
import CardComponentOnCanvas from "app/components/CardComponentOnCanvas"
import Standardcard from "app/components/StandardCard"
import Actioncard from "app/components/ActionCard"
import Itemcard from "app/components/ItemCard"
import Productcard from "app/components/ProductCard"
import Reviewcard from "app/components/ReviewCard"
import Ampligram from "app/components/Ampligram"
import Commentcard from "app/components/CommentCard"
import Profilecard from "app/components/ProfileCard"
import Editprofilecard from "app/components/EditProfileCard"
import ResponsiveGrid from "app/components/utility_components/ResponsiveGrid"
import ResumeView from "app/components/ResumeComponents/ResumeView"
// import Summary from "app/components/ResumeComponents/resume/ResumeView"
import { AppStackScreenProps } from "app/navigators"
import { clear } from "console"

const $iconStyle: ImageStyle = { width: 30, height: 30 }
const $customButtonStyle: ViewStyle = { backgroundColor: colors.background, height: 100 }
const $customAnimatedButtonStyle: ViewStyle = {
  backgroundColor: colors.background,
  width: "auto",
  height: "auto",
}
const $customButtonPressedStyle: ViewStyle = { backgroundColor: colors.error }
const $customButtonTextStyle: TextStyle = {
  color: colors.error,
  fontFamily: typography.primary.bold,
  textDecorationLine: "underline",
  textDecorationColor: colors.error,
}
const $customButtonPressedTextStyle: TextStyle = { color: colors.palette.neutral100 }
const $customButtonRightAccessoryStyle: ViewStyle = {
  width: "53%",
  height: "200%",
  backgroundColor: colors.error,
  position: "absolute",
  top: 0,
  right: 0,
}
const $customButtonPressedRightAccessoryStyle: ImageStyle = { tintColor: colors.palette.neutral100 }

const $disabledOpacity: ViewStyle = { opacity: 0.5 }
const $disabledButtonTextStyle: TextStyle = {
  color: colors.palette.neutral100,
  textDecorationColor: colors.palette.neutral100,
}

interface ResumeScreenProps extends AppStackScreenProps<"Resume"> {}

export const ResumeScreen: FC<ResumeScreenProps> = () => {
  return (
    <Screen>
      <ResumeView />
      <ResponsiveGrid>
        <Productcard />
        <Actioncard />
        <Standardcard />
        <ResponsiveGrid>
          <Itemcard />
          <Itemcard />
          <Itemcard />
        </ResponsiveGrid>
        <ResponsiveGrid>
          <Standardcard />
          <Itemcard />
          <Itemcard />
        </ResponsiveGrid>
        <Reviewcard />
        <Ampligram />
        <Commentcard />
        <Productcard />
        <Profilecard />
        <Editprofilecard />
        <LottieAnimation
          animationSource={require("assets/animations/waves.json")}
          onPress={() => console.log("pressed at the lottie level")}
          speed={1}
          pingPong={true}
        />
      </ResponsiveGrid>
    </Screen>
  )
}
