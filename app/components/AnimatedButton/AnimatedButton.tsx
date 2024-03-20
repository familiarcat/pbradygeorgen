import React, { useEffect, useRef, useState } from "react"
import { Platform, TouchableOpacity, View, StyleSheet } from "react-native"
import LottieView from "lottie-react-native"
import { Player } from "@lottiefiles/react-lottie-player"
import { colors, typography } from "app/theme"
import hexToRgba from "hex-to-rgba"
import _ from "lodash"

import tinycolor from "tinycolor2"

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
  const rgbaToArray = (color: string): number[] => {
    const colorArray = color
      .slice(5, -1)
      .split(",")
      .map((num: string, index: number) =>
        index < 3 ? parseInt(num.trim()) / 255 : parseInt(num.trim()),
      )
    return colorArray
  }

  const backgroundColor = hexToRgba(colors.palette.primary200)
  const textColor = hexToRgba(colors.palette.neutral500)
  const accentColor = hexToRgba(colors.palette.accent500)

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
        console.log("button shapes", layer.shapes)
        // _.find(myArray, { ty: 'fl' })
        layer.shapes.forEach((shape: any) => {
          console.log("shape: ", shape.it)
          // const shapeToFill = _.find(shape?.it, { ty: "fl" })
          const strokeToFill = _.find(shape?.it, { ty: "st" })
          console.log("strokeToFill: ", strokeToFill)
          // console.log("shapeToFill.c.k: ", shapeToFill.c.k)
          // shapeToFill.c.k = rgbaToArray(backgroundColor)
          strokeToFill.c.k = rgbaToArray(accentColor)
          // console.log("shapeToFill.c.k: ", shapeToFill.c.k)
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

      // console.log("modifyLayers, ", layers)

      if (layer.layers) {
        modifyLayers(layer.layers) // Recursively modify sublayers
      }
    })
  }
  function applyPropsToLottie(json: any): any {
    const modifiedJson = JSON.parse(JSON.stringify(json)) // Deep clone to avoid mutating the original
    if (modifiedJson.layers) {
      modifyLayers(modifiedJson.layers)
    }
    // console.log("modified json: " + JSON.stringify(modifiedJson, null, 2))
    return modifiedJson
  }

  const [modifiedAnimationData, setModifiedAnimationData] = useState<any>(null)
  useEffect(() => {
    const animationDataCopy = JSON.parse(JSON.stringify(animationSource)) // Deep copy to prevent direct mutation
    let updatedAnimationData = applyPropsToLottie(animationDataCopy)
    setModifiedAnimationData(updatedAnimationData)
  }, [animationSource, dynamicText, colors, typography])

  if (Platform.OS === "web") {
    return (
      <TouchableOpacity onPress={handlePress}>
        {/* Set a specific size for the animation container */}
        <View>
          <Player
            ref={playerRef}
            autoplay={false}
            loop={false}
            src={modifiedAnimationData} // Adjust the path as necessary
            style={styles.webAnimation} // Adjust scaling via CSS for web
          />
        </View>
      </TouchableOpacity>
    )
  }
  // console.log("playerRef", playerRef)

  return (
    <TouchableOpacity onPress={handlePress}>
      {/* Set a specific size for the animation container */}
      <View style={{ width: 100 }}>
        <LottieView
          ref={lottieRef}
          source={modifiedAnimationData} // Adjust the path as necessary
          autoPlay={false}
          loop={false}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  nativeAnimation: {
    width: "auto", // Make the LottieView component fill the container
  },
  webAnimation: {
    width: "auto", // Make the Player component fill the container
  },
})

export default AnimatedButton
