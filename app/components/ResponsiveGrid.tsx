import React from "react"
import { ScrollView, View, StyleSheet, Dimensions } from "react-native"
import PropTypes from "prop-types"

const { width: screenWidth } = Dimensions.get("window")

const calculateItemWidth = (columns: number) => {
  const gutter = 10
  return (screenWidth - gutter * (columns + 1)) / columns
}

const ResponsiveGrid = ({ children }: { children: React.ReactNode }) => {
  const columns = screenWidth > 1600 ? 4 : screenWidth > 1200 ? 3 : screenWidth > 800 ? 2 : 1
  const itemWidth = calculateItemWidth(columns)

  return (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      {React.Children.map(children, (child) => (
        <View style={[styles.gridItem, { width: itemWidth }]}>{child}</View>
      ))}
    </ScrollView>
  )
}

ResponsiveGrid.propTypes = {
  children: PropTypes.node.isRequired,
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 5,
  },
  gridItem: {
    margin: 5,
    overflow: "hidden",
  },
})

export default ResponsiveGrid
