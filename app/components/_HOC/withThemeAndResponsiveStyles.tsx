import React, { ComponentType, useContext } from "react"
import { StyleSheet, useWindowDimensions, View } from "react-native"
import { useTheme } from "./ThemeContext" // import your useTheme hook

type WithThemeAndResponsiveProps = {
  baseHue?: number
}

function withThemeAndResponsiveStyles<T>(WrappedComponent: ComponentType<T>) {
  return (props: T & WithThemeAndResponsiveProps) => {
    const theme = useTheme()
    const { width: screenWidth } = useWindowDimensions()
    const { baseHue = 0 } = props

    const dynamicStyles = getDynamicStyles(screenWidth, baseHue, theme)

    return (
      <View style={[styles.globalStyle, { backgroundColor: theme.colors.background }]}>
        <WrappedComponent {...(props as T)} theme={theme} dynamicStyles={dynamicStyles} />
      </View>
    )
  }
}

function getDynamicStyles(screenWidth: number, baseHue: number, theme: any) {
  const baseFontSize = screenWidth < 600 ? 12 : screenWidth < 960 ? 14 : 16
  const textColor = {
    color: `hsl(${(baseHue + 30) % 360}, 70%, 50%)`,
  }

  return StyleSheet.create({
    text: {
      color: textColor.color,
      fontSize: baseFontSize,
      fontFamily: theme.typography.fontFamily,
    },
    container: {
      padding: theme.spacing[4],
    },
  })
}

const styles = StyleSheet.create({
  globalStyle: {
    flex: 1,
  },
})

export default withThemeAndResponsiveStyles
