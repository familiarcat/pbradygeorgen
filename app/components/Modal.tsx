import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Modal, Portal, Button, Text } from "react-native-paper";

export default function ResponsiveModal() {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}
      >
        <Text>This is a responsive modal!</Text>
      </Modal>
      <Button onPress={showModal}>Show Modal</Button>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: "10%", // Responsive margin
    borderRadius: 8,
  },
});
