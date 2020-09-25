import React, { useEffect } from "react";
import { View, StyleSheet, Linking } from "react-native";
import Title from "./Title";
import { Colors } from "../../styles";
import { ButtonThatOpensModal } from "../../components/organisms";
import { MenuScreenNavigationProp } from "../../navigations";
import { Paragraph } from "../../components/atoms";
import { withPortalHost, withGameDeepLinking } from "../../hocs";
import { ModalButton } from "../../components/molecules";
import LocalMultiplayerModalButton from "./LocalMultiplayerModalButton";
import NetworkHostMultiplayerModalButton from "./NetworkHostMultiplayerModalButton";
import { pipe } from "lodash/fp";
import { GameSize } from "../../constants";

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

export default withGameDeepLinking<Props>(
  withPortalHost(({ navigation }) => {
    return (
      <View style={styles.container}>
        <Title />
        <View style={styles.buttons}>
          <LocalMultiplayerModalButton
            goToGame={(gameSize: GameSize) =>
              navigation.navigate("LocalMultiplayerGame", { gameSize })
            }
          />
          <NetworkHostMultiplayerModalButton
            goToGame={(gameSize: GameSize) =>
              navigation.navigate("NetworkMultiplayerGame", {
                gameSize,
                isHost: true,
              })
            }
          />
        </View>
      </View>
    );
  })
);
