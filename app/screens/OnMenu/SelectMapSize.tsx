import React from "react";
import { View, StyleSheet } from "react-native";
import { ModalButton } from "../../components/molecules";
import { MenuScreenNavigationProp } from "./types/MenuScreenNavigationProp";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
  },
});

export default ({ navigation }: { navigation: MenuScreenNavigationProp }) => (
  <View style={styles.container}>
    <ModalButton
      onPress={() => navigation.navigate("Game", { width: 4, height: 8 })}
    >
      Small
    </ModalButton>
    <ModalButton
      onPress={() => navigation.navigate("Game", { width: 6, height: 12 })}
    >
      Medium
    </ModalButton>
    <ModalButton
      onPress={() => navigation.navigate("Game", { width: 8, height: 16 })}
    >
      Big
    </ModalButton>
  </View>
);
