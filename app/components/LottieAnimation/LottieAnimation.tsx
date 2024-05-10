import React, { useEffect, useRef, useState } from "react"
import { Platform, TouchableOpacity, View, StyleSheet } from "react-native"
import LottieView from "lottie-react-native"
import { Player } from "@lottiefiles/react-lottie-player"
import { colors } from "app/theme"
import hexToRgba from "hex-to-rgba"
import _ from "lodash"

interface LottieAnimationProps {
  animationSource: any // Adjust based on how you import Lottie files
  onPress?: () => void
  loop?: boolean | false
  autoPlay?: boolean | true
  dynamicText?: string // Text to inject dynamically
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationSource,
  onPress,
  loop,
  autoPlay,
  dynamicText = "Default Text",
}) => {
  const playerRef = useRef<Player>(null)
  const lottieRef = useRef<LottieView>(null)
  dynamicText = dynamicText || "Default Text"
  onPress = onPress || _.noop // Default to a no-op function if no onPress prop is provided

  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    setAnimationData(animationSource)
  }, [animationSource, dynamicText])

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      console.warn("onPress has no passed value")
    }
  }

  if (Platform.OS === "web" && !!animationData) {
    console.log("Web animation in button", animationData)
    return (
      <TouchableOpacity onPress={handlePress} style={[styles.button, { borderRadius: 0 }]}>
        {/* Set a specific size for the animation container */}
        <Player
          ref={playerRef}
          autoplay={true}
          loop={true}
          renderer={"svg"}
          src={animationData} // Adjust the path as necessary
          style={styles.webAnimation} // Adjust scaling via CSS for web
        />
      </TouchableOpacity>
    )
  } else if (animationData) {
    console.log("Native animation in button", animationData)
    return (
      <TouchableOpacity onPress={handlePress}>
        {/* Set a specific size for the animation container */}
        <LottieView
          style={{ width: "100%" }}
          ref={lottieRef}
          source={animationData} // Adjust the path as necessary
          autoPlay={true}
          loop={true}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: "-5%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    minHeight: 56,
    borderRadius: 0,
    // justifyContent: "center",
    // alignItems: "center",
    // flexDirection: "column",
    // /* padding: 12px; */
    // overflow: "hidden",
    borderWidth: 0,
  },

  nativeAnimation: {
    width: "auto", // Make the LottieView component fill the container
  },
  webAnimation: {
    // width: "100%", // Adjust according to your needs
    // height: "auto", // Adjust according to your needs
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default LottieAnimation
