import React, { useEffect, useRef, useState } from "react"
import { Platform, TouchableOpacity, View, StyleSheet } from "react-native"
import LottieView from "lottie-react-native"
// import AnimatedLottieView from "lottie-react-native"
import { Player } from "@lottiefiles/react-lottie-player"
import { colors, typography } from "app/theme"
import hexToRgba from "hex-to-rgba"

interface AnimatedButton {
  animationSource: any // Adjust based on how you import Lottie files
  onPress: () => void
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
  // Recursive function to change colors
  function changeLayerColors(layers: any[], newColor?: string) {
    newColor = hexToRgba("000") // [255, 0, 255, 0.5]
    console.log("layers; ", layers)
    return
    layers.forEach((layer) => {
      if (layer.ty === "sh" || layer.ty === 4) {
        // Shape layers or precomps
        if (layer.shapes) {
          layer.shapes.forEach((shape: any) => {
            if (shape.it) {
              changeLayerColors(shape.it, newColor) // Recurse into shapes
            }
          })
        }
      } else if (layer.ty === "gr") {
        // Group items
        changeLayerColors(layer.it, newColor)
      }

      if (layer.c && layer.c.k) {
        // If layer has a color property
        layer.c.k = newColor // Convert RGB to RGBA
      }
    })
  }

  // function updateAllFillColors(animationData: any) {
  //   // Recursively search for fill objects and update their color
  //   const rgbaArrayColor = hexToRgba("000") // [255, 0, 255, 0.5]
  //   console.log("hex to rgba color", rgbaArrayColor) //
  //   const searchAndUpdate = (obj: any) => {
  //     if (Array.isArray(obj)) {
  //       obj.forEach((item) => searchAndUpdate(item))
  //     } else if (obj && typeof obj === "object") {
  //       // Check for fill property and update color
  //       if (obj.ty === "fl" && obj.c) {
  //         // console.log("obj.c", obj.c) //
  //         // console.log("\n\n\nc.k = ", obj.c.k)

  //         obj.c.k = rgbaArrayColor // Assuming newColor is an RGBA array, e.g., [1, 0, 0, 1] for red
  //       }
  //       // Continue searching in child objects
  //       Object.values(obj).forEach((val) => {
  //         if (typeof val === "object") {
  //           searchAndUpdate(val)
  //         }
  //       })
  //     }
  //   }

  //   // Clone the original JSON to avoid mutating the input
  //   const clonedData = JSON.parse(JSON.stringify(animationData))
  //   clonedData.layers.forEach((layer: any) => searchAndUpdate(layer))
  //   console.log("clonedData", clonedData) //
  //   return clonedData
  // }

  const defaultFontFamily = typography.fonts.spaceGrotesk.bold // Example default font

  function modifyFontFamilyInLottieJson(json: any): any {
    const modifyLayers = (layers: any[]) => {
      layers.forEach((layer) => {
        if (layer.t && layer.t.d && layer.t.d.k) {
          // Found a text layer
          if (layer.nm === "text" && dynamicText) {
            layer.t.d.k[0].s.t = dynamicText
          }
          layer.t.d.k.forEach((textData: any) => {
            if (textData.s) {
              textData.s.f = defaultFontFamily // Change font family
              console.log("setting to default font family: " + textData.s.f)
            }
          })
        }
        changeLayerColors(json)

        if (layer.layers) {
          modifyLayers(layer.layers) // Recursively modify sublayers
        }
      })
    }

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
    const updatedAnimationData = modifyFontFamilyInLottieJson(animationSource)
    setModifiedAnimationData(updatedAnimationData)
  }, [animationSource, dynamicText, colors, typography])

  if (Platform.OS === "web") {
    return (
      <TouchableOpacity onPress={handlePress} style={{ width: width }}>
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
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      {/* Set a specific size for the animation container */}
      <View>
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
