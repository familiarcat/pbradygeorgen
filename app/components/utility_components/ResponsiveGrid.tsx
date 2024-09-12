import React from "react"
import { Dimensions, ScrollView, View, StyleSheet, ViewStyle } from "react-native"

interface ResponsiveGridProps {
  children: React.ReactNode
  width?: number | string // Allow width to be a number (pixels) or a percentage string
  align?: "left" | "center" | "right" // Allow alignment options
}

// Determine the number of columns based on screen width
const calculateColumns = (screenWidth: number) => {
  if (screenWidth >= 1200) return 5 // Five columns for desktop
  if (screenWidth >= 800) return 4 // Four columns for tablets
  return 1 // One column for mobile
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    flexGrow: 1, // Allow item to grow and fill space
    padding: "2.5%", // Set 2.5% padding around each grid item to create a 5% total gutter between items
  },
})

// Utility function to determine the alignment style
const getAlignmentStyle = (align: "left" | "center" | "right" | undefined): ViewStyle => {
  switch (align) {
    case "left":
      return { justifyContent: "flex-start" }
    case "right":
      return { justifyContent: "flex-end" }
    case "center":
    default:
      return { justifyContent: "center" }
  }
}

export default function ResponsiveGrid({
  children,
  width,
  align = "center", // Default alignment to center
}: ResponsiveGridProps): JSX.Element {
  const screenWidth = Dimensions.get("window").width
  const columns = calculateColumns(screenWidth)
  const defaultItemWidth = `${Math.floor(100 / columns) - 5}%` // Calculate width dynamically with a 5% gutter between columns

  return (
    <ScrollView contentContainerStyle={[styles.gridContainer, getAlignmentStyle(align)]}>
      {React.Children.map(children, (child) => (
        <View style={[styles.gridItem, { width: width || defaultItemWidth } as ViewStyle]}>
          {child}
        </View>
      ))}
    </ScrollView>
  )
}
