import React, { useEffect, useRef, useState } from "react"
import { Platform, TouchableOpacity, View, StyleSheet } from "react-native"
import { Text } from "../../components"
import LottieView from "lottie-react-native"
import { Player } from "@lottiefiles/react-lottie-player"
import { colors, typography } from "app/theme"
import hexToRgba from "hex-to-rgba"
import _ from "lodash"

import tinycolor from "tinycolor2"
import LottieAnimation from "../LottieAnimation/LottieAnimation"

interface AnimatedButton {
  animationSource: any // Adjust based on how you import Lottie files
  onPress?: any
  dynamicText?: string // Text to inject dynamically
  width?: number // Optional width
  height?: number // Optional height
}

export const AnimatedButton: React.FC<AnimatedButton> = ({
  animationSource,
  onPress,
  dynamicText,
  width,
  height,
}) => {
  const playerRef = useRef<Player>(null)
  const lottieRef = useRef<LottieView>(null)
  dynamicText = dynamicText || "Default Text"
  onPress = onPress || _.noop // Default to a no-op function if no onPress prop is provided
  animationSource = require("./AnimatedButton.json") // Adjust the path as necessary
  const handlePress = () => {
    // Play the animation once upon pressing the button
    if (Platform.OS === "web") {
      console.log("web handleClick,\n", playerRef.current)
      onPress()
      playerRef.current && playerRef.current.play()
    } else {
      console.log("native handleClick")
      lottieRef.current && lottieRef.current.play()
    }
  }

  const updateFontFamily = (obj: { [x: string]: any }, newFontFamily: any) => {
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        updateFontFamily(obj[key], newFontFamily) // Recursive call for nested objects
      } else if (key === "f" && typeof obj[key] === "string") {
        obj[key] = newFontFamily // 'f' key holds the font family in some Lottie structures
      }
    }
  }

  const defaultFontFamily = typography.fonts.spaceGrotesk.bold // Example default font
  const modifyLayers = (layers: any[]) => {
    layers.forEach((layer) => {
      if (layer.t && layer.t.d && layer.t.d.k) {
        // Found a text layer
        if (layer.nm === "text" && dynamicText) {
          layer.t.d.k[0].s.t = dynamicText
          layer.t.d.k[0].s.fc = rgbaToArray(textColor)
          // Set dynamic font
          layer.t.d.k.forEach((textData: any) => {
            if (textData.s) {
              textData.s.f = defaultFontFamily // Change font family
              console.log("setting to default font family: " + textData.s.f)
            }
          })
        }
      }
      if (layer.nm === "button_shape") {
        layer.shapes.forEach((shape: any) => {
          const strokeToFill = _.find(shape?.it, { ty: "st" })
          strokeToFill.c.k = rgbaToArray(accentColor)
        })
        //found a button shape layer
      }
      if (layer.ty === "sh" || layer.ty === 4) {
        if (layer.shapes) {
          layer.shapes.forEach((shape: any) => {
            if (shape.it) {
              shape.it.forEach((item: any) => {
                if (item.ty === "fl" && item.c && item.c.k) {
                  // console.log("got a fill layer, trying to fill with: ", rgbaToArray(newColor))
                  item.c.k = rgbaToArray(backgroundColor)
                }
              })
            }
          })
        }
      } else if (layer.ty === "gr") {
        console.log("got a group shape")
        // layer.it = updateLayers(layer.it)
      }

      if (layer.c && layer.c.k) {
        console.log("got a layer with color")
        // layer.c.k = rgbaToArray(newColor)
      }

      if (layer.layers) {
        modifyLayers(layer.layers) // Recursively modify sublayers
      }
    })
  }
  const rgbaToArray = (color: string): number[] => {
    const colorArray = color
      .slice(5, -1)
      .split(",")
      .map((num: string, index: number) =>
        index < 3 ? parseInt(num.trim()) / 255 : parseInt(num.trim()),
      )
    return colorArray
  }

  const backgroundColor = hexToRgba(colors.palette.primary400)
  const textColor = hexToRgba(colors.palette.primary300)
  const accentColor = hexToRgba(colors.border)
  function applyPropsToLottie(json: any): any {
    const modifiedJson = JSON.parse(JSON.stringify(json)) // Deep clone to avoid mutating the original
    if (modifiedJson.layers) {
      modifyLayers(modifiedJson.layers)
    }
    return modifiedJson
  }

  const [modifiedAnimationData, setModifiedAnimationData] = useState<any>(null)
  useEffect(() => {
    const animationDataCopy = JSON.parse(JSON.stringify(animationSource)) // Deep copy to prevent direct mutation
    let updatedAnimationData = applyPropsToLottie(animationDataCopy)
    setModifiedAnimationData(updatedAnimationData)
  }, [animationSource, dynamicText, colors, typography])

  if (Platform.OS === "web" && !!modifiedAnimationData) {
    console.log("Web Platform in AnimatedButton", modifiedAnimationData)
    return (
      <TouchableOpacity onPress={handlePress} style={[styles.button, { borderRadius: 0 }]}>
        {/* Set a specific size for the animation container */}
        <Player
          ref={playerRef}
          autoplay={false}
          loop={false}
          renderer={"svg"}
          src={modifiedAnimationData} // Adjust the path as necessary
          style={styles.webAnimation} // Adjust scaling via CSS for web
        />
      </TouchableOpacity>
    )
  } else if (modifiedAnimationData) {
    console.log("Native animation in button")
    return (
      <TouchableOpacity onPress={handlePress} style={[styles.button, { borderRadius: 0 }]}>
        {/* Set a specific size for the animation container */}
        <LottieView
          ref={lottieRef}
          source={modifiedAnimationData} // Adjust the path as necessary
          autoPlay={false}
          loop={false}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    // flexDirection: "column",
    // /* padding: 12px; */
    // overflow: "hidden",
    borderWidth: 0,
  },

  nativeAnimation: {
    width: "auto", // Make the LottieView component fill the container
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webAnimation: {
    // width: "100%", // Adjust according to your needs
    // height: "auto", // Adjust according to your needs
    width: "auto", //"
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default AnimatedButton
