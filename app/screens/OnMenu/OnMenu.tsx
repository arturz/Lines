import React, { useEffect, useState } from "react";
import { View, StyleSheet, Linking, BackHandler, Text } from "react-native";
import Title from "./Title";
import { Colors } from "../../styles";
import {
  ButtonThatOpensModal,
  LeaveAppPrompt,
  MenuGameShowcase,
} from "../../components/organisms";
import { MenuScreenNavigationProp } from "../../navigations";
import { DarkModeSwitch, Paragraph } from "../../components/atoms";
import { withPortalHost, withGameDeepLinking } from "../../hocs";
import {
  MenuButton,
  MenuExitButton,
  ModalButton,
} from "../../components/molecules";
import LocalMultiplayerModalButton from "./LocalMultiplayerModalButton";
import NetworkHostMultiplayerModalButton from "./NetworkHostMultiplayerModalButton";
import { pipe } from "lodash/fp";
import { GameSize } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Portal } from "react-native-portalize";
import Background from "../../components/atoms/MenuBackground";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  buttons: {
    width: "100%",
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
      <>
        <SafeAreaView>
          <Background />
          <MenuGameShowcase />
          <ScrollView style={styles.container}>
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
              <View style={{ display: "flex", alignItems: "center" }}>
                <MenuExitButton onPress={() => setLeaveAppPrompt(true)}>
                  Exit game
                </MenuExitButton>
              </View>
              <Portal>
                <DarkModeSwitch />
                <LeaveAppPrompt
                  isOpen={leaveAppPrompt}
                  onLeave={() => BackHandler.exitApp()}
                  onResume={() => setLeaveAppPrompt(false)}
                />
              </Portal>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  })
);
