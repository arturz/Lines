import React from "react";
import { View, StyleSheet } from "react-native";
import { ModalButton } from "../molecules";
import { GameSize } from "../../constants";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
  },
});

type ComponentProps = ComponentOwnProps;
type ComponentOwnProps = {
  onSelect: (size: GameSize) => void;
};

const SelectMapSize: React.FC<ComponentProps> = ({ onSelect }) => (
  <View style={styles.container}>
    <ModalButton onPress={() => onSelect(GameSize.SMALL)}>Small</ModalButton>
    <ModalButton onPress={() => onSelect(GameSize.MEDIUM)}>Medium</ModalButton>
    <ModalButton onPress={() => onSelect(GameSize.LARGE)}>Large</ModalButton>
  </View>
);

export default SelectMapSize;
