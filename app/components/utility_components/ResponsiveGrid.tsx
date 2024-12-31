import React from "react"
import { Dimensions, ScrollView, View, StyleSheet, ViewStyle } from "react-native"
import { Card } from "react-native-paper"

interface ResponsiveGridProps {
  children: React.ReactNode
  width?: number | string // Allow width to be a number (pixels) or a percentage string
  align?: "left" | "center" | "right" // Allow alignment options
}

// Determine the number of columns based on screen width
const calculateColumns = (screenWidth: number) => {
  if (screenWidth >= 1200) return 4 // Five columns for desktop
  if (screenWidth >= 720) return 3 // Four columns for tablets
  return 1 // One column for mobile
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 5, // Optional padding around the grid container
  },
  gridItem: {
    flexWrap: 'wrap',
    padding: 5, // Padding around each grid item
    marginBottom: 5, // Space between rows
    backgroundColor: "rgba(255, 255, 255, 0)", // Optional background color
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
  align = "left", // Default alignment to left
}: ResponsiveGridProps): JSX.Element {
  const screenWidth = Dimensions.get("window").width
  const columns = calculateColumns(screenWidth)

  // Calculate gutter width (3%)
  const gutterWidth = screenWidth * 0.03
  const totalGutterSpace = gutterWidth * (columns - 1) // Total space occupied by all gutters in the row

  // Calculate the available width for items after accounting for gutters
  const availableWidth = screenWidth - totalGutterSpace - 40 // 20px padding (10px on each side)

  // Calculate the width of each grid item dynamically
  const itemWidth = availableWidth / columns

  return (
    <ScrollView contentContainerStyle={[styles.gridContainer, getAlignmentStyle(align)]}>
      {React.Children.map(children, (child, index) => (
        <Card
          key={index}
          style={[
            styles.gridItem,
            { width: width || itemWidth } as ViewStyle,
            {
              marginRight: align !== "right" && (index + 1) % columns !== 0 ? gutterWidth : 0,
              marginLeft: align !== "left" && (index + 1) % columns !== 0 ? gutterWidth : 0,
            },
          ]}
        >
          {child}
        </Card>
      ))}
    </ScrollView>
  )
}
