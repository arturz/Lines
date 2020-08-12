import React from "react";
import { View, StyleSheet } from "react-native";
import { WhitePortal } from "react-native-portal";
import Title from "./Title";
import SelectMapSize from "./SelectMapSize";
import { MenuScreenNavigationProp } from "./types/MenuScreenNavigationProp";
import { Colors } from "../../styles";
import { ButtonThatOpensModal } from "../../components/organisms";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.YELLOW,
  },
  buttons: {
    display: "flex",
    alignItems: "center",
  },
});

export default ({ navigation }: { navigation: MenuScreenNavigationProp }) => (
  <View style={styles.container}>
    <WhitePortal name="modal-portal" />
    <Title />
    <View style={styles.buttons}>
      <ButtonThatOpensModal
        buttonTitle={"TWO PLAYERS\nONE DEVICE"}
        modalTitle="Map size"
      >
        <SelectMapSize navigation={navigation} />
      </ButtonThatOpensModal>
    </View>
  </View>
);
