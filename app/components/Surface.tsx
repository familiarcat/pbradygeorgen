import React from "react";
import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";

export default function ResponsiveSurface() {
  return (
    <Surface style={styles.surface}>
      <Text>Responsive Surface Content</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    padding: 20,
    elevation: 4,
    borderRadius: 10,
    width: "90%", // Responsive width
    alignSelf: "center", // Center align in parent
  },
});