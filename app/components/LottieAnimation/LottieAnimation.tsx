import React, { useEffect, useRef, useState } from "react"
import { Platform, TouchableOpacity, View, StyleSheet } from "react-native"
import LottieView from "lottie-react-native"
import { Player } from "@lottiefiles/react-lottie-player"
import { colors } from "app/theme"
import hexToRgba from "hex-to-rgba"

interface LottieAnimationProps {
  animationSource: any // Adjust based on how you import Lottie files
  onPress?: () => void
  dynamicText?: string // Text to inject dynamically
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationSource,
  onPress = () => {},
  dynamicText = "Default Text",
}) => {
  const [animationData, setAnimationData] = useState<any>(null)

  useEffect(() => {
    setAnimationData(animationSource)
  }, [animationSource, dynamicText])

  const handlePress = () => {
    onPress()
  }

  if (Platform.OS === "web") {
    console.log("loading Web Lottie Animation")
    return (
      <TouchableOpacity onPress={handlePress} style={styles.button}>
        <Player
          autoplay
          loop={true}
          renderer="svg"
          src={animationData}
          style={styles.webAnimation}
          keepLastFrame={true}
        />
      </TouchableOpacity>
    )
  } else {
    console.log("loading Native Lottie Animation", animationData)
    return null
    // <TouchableOpacity onPress={handlePress} style={styles.button}>
    //   <LottieView
    //     source={animationData}
    //     autoPlay={true}
    //     loop={false}
    //     style={styles.nativeAnimation}
    //     onAnimationFinish={() => {
    //       console.log("Animation Completed on Native")
    //     }}
    //   />
    // </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    minHeight: 56,
  },
  nativeAnimation: {
    width: "100%", // Adjust width as needed
    height: 300, // Set a specific height
  },
  webAnimation: {
    width: "100%", // Adjust width as needed
    height: 300, // Set a specific height
  },
})

export default LottieAnimation
