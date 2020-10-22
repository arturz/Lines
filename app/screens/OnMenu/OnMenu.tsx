import React, { useEffect, useState } from "react";
import { View, StyleSheet, Linking, BackHandler, Text } from "react-native";
import Title from "./Title";
import { Colors } from "../../styles";
import {
  ButtonThatOpensModal,
  LeaveAppPrompt,
  Modal,
} from "../../components/organisms";
import { MenuScreenNavigationProp } from "../../navigations";
import { Paragraph } from "../../components/atoms";
import { withPortalHost, withGameDeepLinking } from "../../hocs";
import { MenuButton, ModalButton } from "../../components/molecules";
import LocalMultiplayerModalButton from "./LocalMultiplayerModalButton";
import NetworkHostMultiplayerModalButton from "./NetworkHostMultiplayerModalButton";
import { pipe } from "lodash/fp";
import { GameSize } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Portal } from "react-native-portalize";

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
    const [leaveAppPrompt, setLeaveAppPrompt] = useState(false);

    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          setLeaveAppPrompt(true);
          return true;
        }
      );

      return () => backHandler.remove();
    }, []);

    return (
      <SafeAreaView>
        <ScrollView style={styles.container}>
          <Title />
          <View style={styles.buttons}>
            <MenuButton onPress={() => navigation.navigate("Tutorial")}>
              How to play?
            </MenuButton>
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
            <MenuButton onPress={() => setLeaveAppPrompt(true)}>
              Exit game
            </MenuButton>
            <Portal>
              <LeaveAppPrompt
                isOpen={leaveAppPrompt}
                onLeave={() => BackHandler.exitApp()}
                onResume={() => setLeaveAppPrompt(false)}
              />
            </Portal>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  })
);
