import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WhitePortal } from "react-native-portal";
import Title from "./Title";
import { yellow, yellowDark } from "../../constants/colors";
import { ModalButton } from "../../components";
import Button from "../../components/Button";

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
    <Button onPress={() => navigate("Game", { width: 4, height: 8 })}>
      Small
    </Button>
    <Button onPress={() => navigate("Game", { width: 6, height: 12 })}>
      Medium
    </Button>
    <Button
      onPress={() => navigate("Game", { width: 8, height: 16 })}
      style={styles.lastButton}
    >
      Big
    </Button>
  </View>
);
