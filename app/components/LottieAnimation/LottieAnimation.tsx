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
  const AnimatedLottieView = Animated.createAnimatedComponent(LottieView)
  const animationProgress = useRef(new Animated.Value(0))
  const [animationData, setAnimationData] = useState<any>(null)
  const [isForward, setIsForward] = useState(true)

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      console.warn("onPress has no passed value in LottieAnimation")
    }
  }

  useEffect(() => {
    !animationData ? setAnimationData(animationSource) : _.noop
    console.log("first use effect called")
  }, [])

  useEffect(() => {
    //Web Player
    const player = playerRef.current
    if (player && pingPong) {
      player.setPlayerDirection(isForward ? 1 : -1)
      player.play()
    }
    // Native LottieView
    const lottie = lottieRef.current
    if (lottie && pingPong) {
      console.log("isForward in Lottie useEffect to ping pong", isForward)
      Animated.timing(animationProgress.current, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start()
    }
  }, [isForward])

  const [lottieWebPlayer, setLottieWebPlayer] = useState<any>()
  if (Platform.OS === "web" && !!animationData) {
    return (
      <TouchableOpacity onPress={handlePress} style={[styles.button, { borderRadius: 0 }]}>
        <Player
          lottieRef={(instance) => (!instance ? setLottieWebPlayer(instance) : lottieWebPlayer)}
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
              setIsForward(!isForward)
            }
          }}
        />
      </TouchableOpacity>
    )
  } else if (animationData) {
    return (
      <TouchableOpacity onPress={handlePress} style={[styles.button, { borderRadius: 0 }]}>
        <LottieView
          ref={lottieRef}
          autoPlay={autoPlay}
          loop={loop}
          speed={speed}
          onAnimationFinish={() => {
            console.log("animation finished in Native")
            setIsForward(!isForward)
          }}
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
