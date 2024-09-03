import React from "react"
import { Dimensions, ScrollView, View, StyleSheet } from "react-native"

// Determine the number of columns based on screen width
const calculateColumns = (screenWidth: number) => {
  if (screenWidth >= 1200) return 3 // Three columns for desktop
  if (screenWidth >= 800) return 2 // Two columns for tablets
  return 1 // One column for mobile
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Center items for a better aesthetic when there is extra space
    padding: 10,
  },
  gridItem: {
    minWidth: 225, // Minimum width for each item
    maxWidth: "26.7%", // Maximum width for each item
    width: "100%", // Allows flexing within minWidth and maxWidth constraints
    padding: 5,
    marginBottom: 5, // Space between rows
    marginRight: 10,
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
})

export default function ResponsiveGrid({ children }: { children: React.ReactNode }): JSX.Element {
  const screenWidth = Dimensions.get("window").width
  const columns = calculateColumns(screenWidth)
  const itemWidth = Math.max(200, Math.min(400, screenWidth / columns - 20)) // Calculate width dynamically

  return (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      {React.Children.map(children, (child) => (
        <View style={[styles.gridItem, { width: itemWidth }]}>{child}</View>
      ))}
    </ScrollView>
  )
}
