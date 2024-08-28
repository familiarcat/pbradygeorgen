import React from "react"
import { Dimensions, ScrollView, View, StyleSheet } from "react-native"

// Get device screen width
const { width: screenWidth } = Dimensions.get("window")

// Function to calculate the width of each item based on the number of columns
const calculateItemWidth = (columns: number) => {
  const gutter = 10
  return (screenWidth - gutter * (columns + 1)) / columns
}

// Styles for the grid and grid items
const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "column", // Stack children vertically
    alignItems: "center", // Align children to center horizontally
  },
  gridItem: {
    margin: 5,
    padding: 5,
    width: "100%", // Take full width to align child component sizing responsibility
  },
})

export default function ResponsiveGrid({ children }: { children: React.ReactNode }): JSX.Element {
  // Decide on the number of columns based on screen width
  const columns = screenWidth > 1600 ? 4 : screenWidth > 1200 ? 3 : screenWidth > 800 ? 2 : 1
  // Calculate the item width
  const itemWidth = calculateItemWidth(columns)

  // Render children within the ScrollView, passing calculated width
  return (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      {React.Children.map(children, (child) => (
        <View style={[styles.gridItem, { width: itemWidth }]}>{child}</View>
      ))}
    </ScrollView>
  )
}
