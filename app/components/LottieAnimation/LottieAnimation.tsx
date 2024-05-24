import React, { useEffect, useRef, useState } from "react"
import { Platform, TouchableOpacity, View, StyleSheet, Animated, Easing } from "react-native"
import { Player, PlayerEvent, PlayerState, PlayerDirection } from "@lottiefiles/react-lottie-player"
import LottieView from "lottie-react-native"
import { colors } from "app/theme"
import hexToRgba from "hex-to-rgba"
import _ from "lodash"

interface LottieAnimationProps {
  animationSource: any // Adjust based on how you import Lottie files
  onPress?: () => void
  loop?: boolean
  autoPlay?: boolean
  speed?: number
  pingPong?: boolean
  direction?: 1 | -1
  dynamicText?: string // Text to inject dynamically
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationSource,
  onPress,
  loop,
  autoPlay,
  speed,
  pingPong,
  direction,
}) => {
  onPress = onPress || _.noop // Default to a no-op function if no onPress prop is provided
  loop = loop || false
  autoPlay = autoPlay || true
  speed = speed || 1
  pingPong = pingPong || false
  direction = direction || 1

  const playerRef = useRef<Player>(null)
  const lottieRef = useRef<LottieView>(null)
  const [animationData, setAnimationData] = useState<any>(null)
  const [isForward, setIsForward] = useState(true)

  useEffect(() => {
    !animationData ? setAnimationData(animationSource) : _.noop
    console.log("loop" + loop)
    const player = playerRef.current
    if (player && pingPong) {
      console.log("player in useEffect to ping pong", player)
      player.setPlayerDirection(isForward ? 1 : -1)
      player.play()
    }
    const lottie = lottieRef.current
    if (lottie && pingPong) {
      console.log("lottie in useEffect to ping pong", lottie)
      lottie.play()
    }
  }, [animationData, isForward])

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      console.warn("onPress has no passed value")
    }
  }

  const [playerLottie, setPlayerLottie] = useState<any>()
  if (Platform.OS === "web" && !!animationData) {
    // console.log("Web animationData in lottie animation", animationData)
    return (
      <TouchableOpacity onPress={handlePress} style={[styles.button, { borderRadius: 0 }]}>
        {/* Set a specific size for the animation container */}
        <Player
          lottieRef={(instance) => (!instance ? setPlayerLottie(instance) : playerLottie)}
          ref={playerRef}
          autoplay={autoPlay}
          loop={loop}
          renderer={"svg"}
          speed={speed}
          direction={direction}
          keepLastFrame={true}
          src={animationData} // Adjust the path as necessary
          style={styles.webAnimation}
          onEvent={(e: PlayerEvent) => {
            if (e === "complete") {
              console.log("animation complete")
              setIsForward(!isForward)
              // let tempLottie = JSON.parse(JSON.stringify(playerLottie))
              // playerRef.current?.setPlayerDirection(-1)
              // console.log("direction", playerRef.current)
              // playerLottie?.setDirection(-1)
              // tempLottie.goToAndPlay(40)
              // playerLottie?.goToAndPlay(0)
            }
          }}
        />
      </TouchableOpacity>
    )
  } else if (animationData) {
    console.log("Native animation in animated lottie animation playing")
    return (
      <TouchableOpacity onPress={handlePress} style={[styles.button, { borderRadius: 0 }]}>
        {/* Set a specific size for the animation container */}
        <LottieView
          ref={lottieRef}
          autoPlay={autoPlay}
          loop={loop}
          speed={speed}
          //direction={direction}
          source={animationData} // Adjust the path as necessary
          style={styles.nativeAnimation}
        />
      </TouchableOpacity>
    )
  }
  return null
}

const styles = StyleSheet.create({
  button: {
    minWidth: 100,
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
  },

  nativeAnimation: {
    width: "auto", // Make the LottieView component fill the container
    height: "auto", // Adjust according to your needs
    flex: 1,
  },
  webAnimation: {
    height: "auto", // Adjust according to your needs
    width: "auto", //
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default LottieAnimation
