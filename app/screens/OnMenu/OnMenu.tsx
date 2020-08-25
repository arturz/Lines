import React, { useEffect } from "react";
import { View, StyleSheet, Linking } from "react-native";
import Title from "./Title";
import { Colors } from "../../styles";
import { ButtonThatOpensModal } from "../../components/organisms";
import { MenuScreenNavigationProp } from "../../navigations";
import { Paragraph } from "../../components/atoms";
import { withPortalHost } from "../../hocs";
import { ModalButton } from "../../components/molecules";
import LocalMultiplayerModalButton from "./LocalMultiplayerModalButton";
import NetworkHostMultiplayerModalButton from "./NetworkHostMultiplayerModalButton";
import { MapSize } from "../../constants";

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

export default withPortalHost<Props>(({ navigation }: Props) => {
  const navigate = (url) => {
    const route = url.replace(/.*?:\/\//g, "");
    const id = route.match(/\/([^\/]+)\/?$/)[1];
    const routeName = route.split("/")[0];

    if (routeName === "join") {
      navigation.navigate("NetworkMultiplayerGame", { id, isHost: false });
    }
  };

  const handleOpenURL = (event) => navigate(event.url);

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url === null) return;

      navigate(url);
    });

    Linking.addEventListener("url", handleOpenURL);

    return () => Linking.removeEventListener("url", handleOpenURL);
  }, []);

  return (
    <View style={styles.container}>
      <Title />
      <View style={styles.buttons}>
        <LocalMultiplayerModalButton
          goToGame={(mapSize: MapSize) =>
            navigation.navigate("LocalMultiplayerGame", mapSize)
          }
        />
        <NetworkHostMultiplayerModalButton
          goToGame={(mapSize: MapSize) =>
            navigation.navigate("NetworkMultiplayerGame", {
              ...mapSize,
              isHost: true,
            })
          }
        />
      </View>
    </View>
  );
});
