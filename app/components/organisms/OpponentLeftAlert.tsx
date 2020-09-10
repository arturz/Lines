import React from "react";
import { StyleSheet, View } from "react-native";
import Alert from "./Alert";
import { Paragraph } from "../atoms";
import { ModalButton } from "../molecules";

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
    <Paragraph>Opponent left the game</Paragraph>
    <View style={styles.buttons}>
      <ModalButton onPress={goToMenu}>Go to menu</ModalButton>
    </View>
  </Alert>
);
