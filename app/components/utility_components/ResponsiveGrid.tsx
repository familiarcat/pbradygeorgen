import React from "react" // Import the 'React' module
import { Dimensions, ScrollView, View, StyleSheet } from "react-native"

const { width: screenWidth } = Dimensions.get("window")
const calculateItemWidth = (columns: number) => {
  const gutter = 10
  return (screenWidth - gutter * (columns + 1)) / columns
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // Items float left
    padding: 5, // Minimum gutter
  },
  gridItem: {
    margin: 5,
    padding: 5, // Minimum gutter
    overflow: "hidden", // Hide content that overflows the bounds
  },
})

export default function ResponsiveGrid({ children }: { children: React.ReactNode }): JSX.Element {
  const columns = screenWidth > 1600 ? 4 : screenWidth > 1200 ? 3 : screenWidth > 800 ? 2 : 1
  const itemWidth = calculateItemWidth(columns)

  return (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      {React.Children.map(children, (child) => (
        <View style={[styles.gridItem]}>{child}</View>
      ))}
    </ScrollView>
  )
}
