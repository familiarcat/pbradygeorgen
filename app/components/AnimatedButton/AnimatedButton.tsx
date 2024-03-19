import React, { useEffect, useRef, useState } from "react"
import { Platform, TouchableOpacity, View, StyleSheet } from "react-native"
import LottieView from "lottie-react-native"
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
  function changeLayerColors(layers: any[], newColor: string) {
    // console.log("changing layer colors", newColor)
    newColor = hexToRgba("#777") || hexToRgba(newColor) // [255, 0, 255, 0.5]
    console.log("newColor: " + newColor)
    const rgbaToArray = (newColor: any): string => {
      const newColorArrayString = newColor
        .slice(5, -1)
        .split(",")
        .map((num: any) => parseInt(num.trim()))
      return `[${newColorArrayString}]`
    }

    // console.log("numbers: ", rgbaToArray(newColor))
    // console.log("layers; ", layers)
    layers.forEach((layer) => {
      if (layer.ty === "sh" || layer.ty === 4) {
        // Shape layers or precomps
        if (layer.shapes) {
          layer.shapes.forEach((shape: any) => {
            if (shape.it) {
              // console.log("shape.it ", shape.it)
              const fills = shape.it.map((item: any) => {
                // console.log("shape array item", item)
                item.ty === "fl" && console.log("we got a fill! " + item.ty, "\n", item.c.k)
                return item
              })
              console.log("fills: ", fills)
              // changeLayerColors(shape.it, newColor) // Recurse into shapes
            }
          })
        }
      } else if (layer.ty === "gr") {
        // Group items
        console.log("changing group colors", rgbaToArray(newColor))
        changeLayerColors(layer.it, rgbaToArray(newColor))
      }

      if (layer.c && layer.c.k) {
        // If layer has a color property
        console.log("changing layer color property: ", rgbaToArray(newColor))
        layer.c.k = rgbaToArray(newColor) // Convert RGB to RGBA
      }
    })
  }

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
        // console.log("modifyLayers, ", layers)
        changeLayerColors(layers, "#777")

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
    const updatedAnimationData = modifyFontFamilyInLottieJson(animationDataCopy)
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
