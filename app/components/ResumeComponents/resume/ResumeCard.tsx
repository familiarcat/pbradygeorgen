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
    padding: 10, // Added padding around the grid
  },
  gridItem: {
    minWidth: 225, // Minimum width for each item
    marginRight: "5%", // 5% margin between items
    marginBottom: 10, // Space between rows
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
})

// Utility function to determine the alignment style
const getAlignmentStyle = (align: "left" | "center" | "right" | undefined): ViewStyle => {
  switch (align) {
    case "left":
      return { justifyContent: "flex-start", alignItems: "flex-start" } // Keep items to the left
    case "right":
      return { justifyContent: "flex-end", alignItems: "flex-end" } // Align items to the right
    case "center":
    default:
      return { justifyContent: "center", alignItems: "center" } // Center the items by default
  }
}

export default function ResponsiveGrid({
  children,
  width,
  align = "center", // Default alignment to center
}: ResponsiveGridProps): JSX.Element {
  const screenWidth = Dimensions.get("window").width
  const columns = calculateColumns(screenWidth)
  const defaultItemWidth = Math.max(200, Math.min(400, (screenWidth * 0.95) / columns)) // Adjust width, considering 5% margin

  return (
    <ScrollView contentContainerStyle={[styles.gridContainer, getAlignmentStyle(align)]}>
      {React.Children.map(children, (child, index) => (
        <View
          key={index}
          style={[
            styles.gridItem,
            { width: width || defaultItemWidth } as ViewStyle,
            // Remove marginRight for the last item in a row
            { marginRight: (index + 1) % columns === 0 ? 0 : "5%" },
          ]}
        >
          {child}
        </View>
      ))}
    </ScrollView>
  )
}
