import React from "react";
import { View, StyleSheet } from "react-native";
import Title from "./Title";
import { SelectMapSize } from "./localMultiplayer";
import { Colors } from "../../styles";
import { ButtonThatOpensModal } from "../../components/organisms";
import { MenuScreenNavigationProp } from "../../navigations";
import { Paragraph } from "../../components/atoms";
import { withPortalHost } from "../../hocs";
import { ModalButton } from "../../components/molecules";
import LocalMultiplayerModalButton from "./localMultiplayer/LocalMultiplayerModalButton";
import NetworkMultiplayerModalButton from "./networkMultiplayer/NetworkMultiplayerModalButton";

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

type Props = {
  navigation: MenuScreenNavigationProp;
};

export default withPortalHost<Props>(({ navigation }: Props) => (
  <View style={styles.container}>
    <Title />
    <View style={styles.buttons}>
      <LocalMultiplayerModalButton navigation={navigation} />
      <NetworkMultiplayerModalButton navigation={navigation} />
    </View>
  </View>
));
