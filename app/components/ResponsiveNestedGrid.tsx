import React from "react";
import { ScrollView, View, Text, StyleSheet, useWindowDimensions } from "react-native";

interface ResponsiveNestedGridProps {
  title?: string; // Optional title for the grid
  color?: string; // Optional background color for the grid
  children: React.ReactNode; // Nested child components
  containerWidth?: number; // Allow passing a specific width if needed
}

const calculateItemWidth = (columns: number, containerWidth: number): number => {
  const gutter = 10; // Space between grid items
  return (containerWidth - gutter * (columns + 1)) / columns;
};

const ResponsiveNestedGrid: React.FC<ResponsiveNestedGridProps> = ({
  title,
  color = "#ffffff", // Default color if none is provided
  children,
  containerWidth,
}) => {
  const { width: screenWidth } = useWindowDimensions(); // Use dynamic window dimensions
  const width = containerWidth || screenWidth; // Use passed containerWidth or screen width

  const columns = width > 1600 ? 4 : width > 1200 ? 3 : width > 800 ? 2 : 1;
  const itemWidth = calculateItemWidth(columns, width);

  return (
    <View style={styles.container}>
    <View style={[styles.gridContainer, { backgroundColor: color }]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {React.Children.map(children, (child, index) => (
          <View key={index} style={[styles.gridItem, { width: itemWidth }]}>
            {child}
          </View>
        ))}
      </ScrollView>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      width: '100%',
      backgroundColor: "#f5f5f5",
    },
    item: {
      width: 'auto',
      height: 'auto',
      backgroundColor: "#4a90e2",
      borderRadius: 8,
    },  
  gridContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    overflow: "hidden",
    alignItems: "stretch",
  },
  scrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    margin: 5,
    overflow: "hidden",
    borderRadius: 8,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Web shadow compatibility
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default ResponsiveNestedGrid;
