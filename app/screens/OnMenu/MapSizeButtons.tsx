import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WhitePortal } from "react-native-portal";
import Title from "./Title";
import { yellow, yellowDark } from "../../constants/colors";
import { ModalButton } from "../../components";
import Button from "../../components/Button";
import { MapSize } from "../../constants/MapSize";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
  },
  lastButton: {
    marginBottom: 0,
  },
});

export default ({ navigate }: { navigate: Function }) => (
  <View style={styles.container}>
    <Button onPress={() => navigate("Game", { size: MapSize.Small })}>
      Small
    </Button>
    <Button onPress={() => navigate("Game", { size: MapSize.Medium })}>
      Medium
    </Button>
    <Button
      onPress={() => navigate("Game", { size: MapSize.Big })}
      style={styles.lastButton}
    >
      Big
    </Button>
  </View>
);
