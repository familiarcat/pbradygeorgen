import React, { useRef, useEffect } from "react"
import { View, StyleSheet } from "react-native"
import LottieView from "lottie-react-native"

const PingPongAnimation = () => {
  const animation = useRef<LottieView>(null)
  let direction = useRef(1)

  useEffect(() => {
    const handleAnimationComplete = () => {
      direction.current *= -1 // Reverse direction
      animation.current?.setDirection(direction.current)
      animation.current?.play()
    }

    animation.current?.play()
    animation.current?.addListener("end", handleAnimationComplete)

    return () => {
      animation.current?.removeListener("end", handleAnimationComplete)
    }
  }, [])

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        source={require("./path/to/your/data.json")}
        autoPlay
        loop={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default PingPongAnimation
