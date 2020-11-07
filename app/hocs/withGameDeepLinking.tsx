import React from "react";
import { AnyScreenNavigationProp } from "../navigations";
import { Linking } from "react-native";

type Props = {
  navigation: AnyScreenNavigationProp;
};

export default <P extends Props>(WrappedComponent: React.ComponentType<P>) =>
  class WithDeepLinking extends React.Component<P> {
    private navigate(url: string) {
      const route = url.replace(/.*?:\/\//g, "");
      const id = route?.match(/\/([^\/]+)\/?$/)?.[1];
      const routeName = route.split("/")[0];

      if (id !== null && id !== undefined)
        if (routeName === "join") {
          this.props.navigation.navigate("NetworkMultiplayerGame", {
            id,
            isHost: false,
          });
        }
    }

    private handleOpenURL = (event: { url: string }) => {
      this.navigate(event.url);
    };

    componentDidMount() {
      Linking.getInitialURL().then((url) => {
        if (url === null) return;

        this.navigate(url);
      });

      Linking.addEventListener("url", this.handleOpenURL);
    }

    componentWillUnmount() {
      Linking.removeEventListener("url", this.handleOpenURL);
    }

    render() {
      return <WrappedComponent {...(this.props as P)} />;
    }
  };
