/* eslint-disable react/jsx-key */
import React from "react"
import {
  ImageStyle,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
  StyleSheet,
  Dimensions,
} from "react-native"
import { Button, Icon, LottieAnimation, Text } from "../../../components"
import { colors, typography } from "../../../theme"
import { Demo } from "../DemoShowroomScreen"
import { DemoDivider } from "../DemoDivider"
import { DemoUseCase } from "../DemoUseCase"
import LottieView from "lottie-react-native"
import PingPongAnimation from "app/components/PingPong"
import CardComponentOnCanvas from "app/components/CardComponentOnCanvas"
import Standardcard from "app/components/StandardCard"
import Actioncard from "app/components/ActionCard"
import Itemcard from "app/components/ItemCard"
import Productcard from "app/components/ProductCard"
import Reviewcard from "app/components/ReviewCard"

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

const { width: screenWidth } = Dimensions.get("window")

const calculateItemWidth = (columns: number) => {
  const gutter = 10
  return (screenWidth - gutter * (columns + 1)) / columns
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Items float left
    padding: 5, // Minimum gutter
  },
  gridItem: {
    margin: 5, // Minimum gutter
    overflow: "hidden", // Hide content that overflows the bounds
  },
})

const ResponsiveGrid = () => {
  const columns = screenWidth > 1600 ? 4 : screenWidth > 1200 ? 3 : 2
  const itemWidth = calculateItemWidth(columns)

  return (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      <View style={[styles.gridItem, { width: itemWidth }]}>
        <CardComponentOnCanvas />
      </View>
      <View style={[styles.gridItem, { width: itemWidth }]}>
        <Standardcard />
      </View>
      <View style={[styles.gridItem, { width: itemWidth }]}>
        <Actioncard />
      </View>
      <View style={[styles.gridItem, { width: itemWidth }]}>
        <Itemcard />
      </View>
      <View style={[styles.gridItem, { width: itemWidth }]}>
        <Productcard />
      </View>
      <View style={[styles.gridItem, { width: itemWidth }]}>
        <Reviewcard />
      </View>
      {/* Add more grid items here */}
    </ScrollView>
  )
}

export const DemoButton: Demo = {
  name: "Button",
  description:
    "A component that allows users to take actions and make choices. Wraps the Text component with a Pressable component.",
  data: [
    <DemoUseCase
      name="Presets"
      layout="column"
      description="There are a few presets that are pre-configured."
    >
      <ResponsiveGrid />
      <LottieAnimation
        animationSource={require("assets/animations/waves.json")}
        onPress={() => console.log("pressed at the lottie level")}
        speed={1}
        pingPong={true}
      />
      <Button
        text="From Props"
        onPress={() => {
          console.log("pressed at the button level")
        }}
        animatedContent={require("../../../components/AnimatedButton/AnimatedButton.json")}
        style={{ width: 200 }}
      >
        Default - Laboris In Labore
      </Button>
      <DemoDivider />

      <Button preset="filled">Filled - Laboris Ex</Button>
      <DemoDivider />

      <Button preset="reversed">Reversed - Ad Ipsum</Button>
      <CardComponentOnCanvas />
    </DemoUseCase>,

    <DemoUseCase
      name="Passing Content"
      description="There are a few different ways to pass content."
    >
      <Button text="Via `text` Prop - Billum In" />
      <DemoDivider />

      <Button tx="demoShowroomScreen.demoViaTxProp" />
      <DemoDivider />

      <Button>Children - Irure Reprehenderit</Button>
      <DemoDivider />

      <Button
        preset="filled"
        RightAccessory={(props) => (
          <Icon containerStyle={props.style} style={$iconStyle} icon="ladybug" />
        )}
      >
        RightAccessory - Duis Quis
      </Button>
      <DemoDivider />

      <Button
        preset="filled"
        LeftAccessory={(props) => (
          <Icon containerStyle={props.style} style={$iconStyle} icon="ladybug" />
        )}
      >
        LeftAccessory - Duis Proident
      </Button>
      <DemoDivider />

      <Button
        preset="filled"
        style={$customButtonStyle}
        animatedContent={require("../../../components/AnimatedButton/AnimatedButton.json")}
        text="Animated Button"
        LeftAccessory={(props) => (
          <Icon containerStyle={props.style} style={$iconStyle} icon="ladybug" />
        )}
      >
        LeftAccessory - DONE AFFIXED
      </Button>
      <DemoDivider />

      <Button>
        <Text>
          <Text preset="bold">Nested children - proident veniam.</Text>
          {` `}
          <Text preset="default">
            Ullamco cupidatat officia exercitation velit non ullamco nisi..
          </Text>
          {` `}
          <Text preset="bold">Occaecat aliqua irure proident veniam.</Text>
        </Text>
      </Button>
      <DemoDivider />

      <Button
        preset="reversed"
        RightAccessory={(props) => (
          <Icon containerStyle={props.style} style={$iconStyle} icon="ladybug" />
        )}
        LeftAccessory={(props) => (
          <Icon containerStyle={props.style} style={$iconStyle} icon="ladybug" />
        )}
      >
        Multiline - consequat veniam veniam reprehenderit. Fugiat id nisi quis duis sunt proident
        mollit dolor mollit adipisicing proident deserunt.
      </Button>
    </DemoUseCase>,

    <DemoUseCase name="Styling" description="The component can be styled easily.">
      <Button style={$customButtonStyle}>Style Container - Exercitation</Button>
      <DemoDivider />

      <Button preset="filled" textStyle={$customButtonTextStyle}>
        Style Text - Ea Anim
      </Button>
      <DemoDivider />

      <Button
        preset="reversed"
        RightAccessory={() => <View style={$customButtonRightAccessoryStyle} />}
      >
        Style Accessories - enim ea id fugiat anim ad.
      </Button>
      <DemoDivider />

      <Button
        pressedStyle={$customButtonPressedStyle}
        pressedTextStyle={$customButtonPressedTextStyle}
        RightAccessory={(props) => (
          <Icon
            containerStyle={props.style}
            style={[
              $iconStyle,
              props.pressableState.pressed && $customButtonPressedRightAccessoryStyle,
            ]}
            icon="ladybug"
          />
        )}
      >
        Style Pressed State - fugiat anim
      </Button>
    </DemoUseCase>,

    <DemoUseCase
      name="Disabling"
      description="The component can be disabled, and styled based on that. Press behavior will be disabled."
    >
      <Button
        disabled
        disabledStyle={$disabledOpacity}
        pressedStyle={$customButtonPressedStyle}
        pressedTextStyle={$customButtonPressedTextStyle}
      >
        Disabled - standard
      </Button>
      <DemoDivider />

      <Button
        disabled
        preset="filled"
        disabledStyle={$disabledOpacity}
        pressedStyle={$customButtonPressedStyle}
        pressedTextStyle={$customButtonPressedTextStyle}
      >
        Disabled - filled
      </Button>
      <DemoDivider />

      <Button
        disabled
        preset="reversed"
        disabledStyle={$disabledOpacity}
        pressedStyle={$customButtonPressedStyle}
        pressedTextStyle={$customButtonPressedTextStyle}
      >
        Disabled - reversed
      </Button>
      <DemoDivider />

      <Button
        disabled
        pressedStyle={$customButtonPressedStyle}
        pressedTextStyle={$customButtonPressedTextStyle}
        RightAccessory={(props) => (
          <View
            style={
              props.disabled
                ? [$customButtonRightAccessoryStyle, $disabledOpacity]
                : $customButtonPressedRightAccessoryStyle
            }
          />
        )}
      >
        Disabled accessory style
      </Button>
      <DemoDivider />

      <Button
        disabled
        preset="filled"
        disabledTextStyle={[$customButtonTextStyle, $disabledButtonTextStyle]}
        pressedStyle={$customButtonPressedStyle}
        pressedTextStyle={$customButtonPressedTextStyle}
      >
        Disabled text style
      </Button>
    </DemoUseCase>,
  ],
}
