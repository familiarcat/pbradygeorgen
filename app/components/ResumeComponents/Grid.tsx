import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Surface, Text } from "react-native-paper";

const { width: screenWidth } = Dimensions.get("window");
const calculateColumns = () => (screenWidth > 800 ? 3 : screenWidth > 400 ? 2 : 1);

export default function ResponsiveGrid() {
  const columns = calculateColumns();

  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Surface
          key={index}
          style={[
            styles.gridItem,
            { width: `${100 / columns}%` }, // Dynamically adjust width
          ]}
        >
          <Text>Item {index + 1}</Text>
        </Surface>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    padding: 10,
    margin: 5,
    elevation: 2,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderRadius: 5,
  },
});
