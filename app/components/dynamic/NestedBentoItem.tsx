import React from "react";
import { StyleSheet, View, Text } from "react-native";

interface NestedBentoItemProps {
  title: string;
  color: string;
  children?: React.ReactNode;
}

const NestedBentoItem: React.FC<NestedBentoItemProps> = ({ title, color, children }) => {
  if (!title || !color) {
    console.error("NestedBentoItem: Missing required props.");
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    padding: 12,
    borderRadius: 8,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "left",
    color: "#fff",
    marginBottom: 8,
  },
  childrenContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
});

export default NestedBentoItem;
