import React from "react";
import Alert from "./Alert";
import { Paragraph } from "../atoms";
import { ModalButton } from "../molecules";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  buttons: {
    display: "flex",
    alignItems: "center",
  },
});

export default ({
  isOpen,
  goToMenu,
}: {
  isOpen: boolean;
  goToMenu: () => void;
}) => (
  <Alert title="Oooops!" isOpen={isOpen}>
    <Paragraph>Link has been expired.</Paragraph>
    <View style={styles.buttons}>
      <ModalButton onPress={goToMenu}>Go to menu</ModalButton>
    </View>
  </Alert>
);
