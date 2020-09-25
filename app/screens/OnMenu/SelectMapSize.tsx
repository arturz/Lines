import React from "react";
import { View, StyleSheet } from "react-native";
import { ModalButton } from "../../components/molecules";
import { GameSize } from "../../constants";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
  },
});

export default ({ onSelect }: { onSelect: (size: GameSize) => void }) => (
  <View style={styles.container}>
    <ModalButton onPress={() => onSelect(GameSize.SMALL)}>Small</ModalButton>
    <ModalButton onPress={() => onSelect(GameSize.MEDIUM)}>Medium</ModalButton>
    <ModalButton onPress={() => onSelect(GameSize.LARGE)}>Large</ModalButton>
  </View>
);
