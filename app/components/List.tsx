import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { List } from "react-native-paper";

export default function ResponsiveList() {
  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Item title="Item 1" description="Description 1" />
        <List.Item title="Item 2" description="Description 2" />
        <List.Item title="Item 3" description="Description 3" />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
