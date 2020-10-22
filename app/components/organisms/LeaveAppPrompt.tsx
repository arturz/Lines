import React from "react";
import { StyleSheet, View } from "react-native";
import Alert from "./Alert";
import { Paragraph } from "../atoms";
import { ModalButton, ModalExitButton } from "../molecules";

const styles = StyleSheet.create({
  buttons: {
    display: "flex",
    alignItems: "center",
  },
});

export default ({
  isOpen,
  onLeave,
  onResume,
}: {
  isOpen: boolean;
  onLeave: () => void;
  onResume: () => void;
}) => (
  <Alert isOpen={isOpen} title="Exit game" onClose={onResume}>
    <Paragraph>Do you want to exit?</Paragraph>
    <View style={styles.buttons}>
      <ModalButton onPress={onResume}>No</ModalButton>
      <ModalExitButton onPress={onLeave}>Yes</ModalExitButton>
    </View>
  </Alert>
);
