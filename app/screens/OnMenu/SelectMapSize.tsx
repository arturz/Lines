import React from "react";
import { View, StyleSheet } from "react-native";
import { ModalButton } from "../../components/molecules";
import { MapSizes, MapSize } from "../../constants";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
  },
});

export default ({ onSelect }: { onSelect: (size: MapSize) => void }) => (
  <View style={styles.container}>
    <ModalButton onPress={() => onSelect(MapSizes.SMALL)}>Small</ModalButton>
    <ModalButton onPress={() => onSelect(MapSizes.MEDIUM)}>Medium</ModalButton>
    <ModalButton onPress={() => onSelect(MapSizes.BIG)}>Big</ModalButton>
  </View>
);
