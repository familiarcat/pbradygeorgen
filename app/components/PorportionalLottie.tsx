import React, { useEffect, useRef } from "react"
import { View, StyleSheet, Platform } from "react-native"
import LottieView from "lottie-react-native"
import lottieWeb from "lottie-web"

const ProportionalLottie = () => {
  const animationContainer = useRef(null)

  useEffect(() => {
    if (Platform.OS === "web" && animationContainer.current) {
      const animationInstance = lottieWeb.loadAnimation({
        container: animationContainer.current, // the container element
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: require("./path/to/animation.json"), // the animation data
      })

      return () => animationInstance.destroy() // Cleanup animation instance on component unmount
    }
  }, [])

  if (Platform.OS === "web") {
    return <div ref={animationContainer} style={styles.container}></div>
  }

  return (
    <View style={styles.container}>
      <LottieView
        source={require("./path/to/animation.json")}
        resizeMode="contain" // This ensures the animation scales proportionately
        autoPlay
        loop
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

export default ProportionalLottie
