import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WhitePortal } from "react-native-portal";
import Title from "./Title";
import { yellow, yellowDark } from "../../constants/colors";
import { ModalButton } from "../../components";
import MapSizeButtons from "./MapSizeButtons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";

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

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, "Menu">;

export default ({
  navigation: { navigate },
}: {
  navigation: MenuScreenNavigationProp;
}) => (
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
