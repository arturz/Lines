import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WhitePortal } from "react-native-portal";
import Title from "./Title";
import { yellow, yellowDark } from "../../constants/colors";
import { ModalButton } from "../../components";
import MapSizeButtons from "./MapSizeButtons";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: yellow,
  },
  buttons: {
    display: "flex",
    alignItems: "center",
  },
});

export default ({ navigation: { navigate } }) => (
  <View style={styles.container}>
    <WhitePortal name="modal" />
    <Title />
    <View style={styles.buttons}>
      <ModalButton
        buttonTitle={"TWO PLAYERS\nONE DEVICE"}
        modalTitle="Map size"
      >
        <MapSizeButtons navigate={navigate} />
      </ModalButton>
    </View>
  </View>
);
