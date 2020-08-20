import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { OnMenu, OnGame } from "./app/screens";
import { store } from "./app/redux";
import { Stack } from "./app/navigations";
import { Linking } from "react-native";
import { joinRoom } from "./app/firebase";

export default () => {
  const navigate = (url) => {
    const route = url.replace(/.*?:\/\//g, "");
    const id = route.match(/\/([^\/]+)\/?$/)[1];
    const routeName = route.split("/")[0];

    if (routeName === "join") {
      joinRoom(id);
    }
  };

  const handleOpenURL = (event) => {
    navigate(event.url);
  };

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url === null) return;

      navigate(url);
    });

    Linking.addEventListener("url", handleOpenURL);

    return () => Linking.removeEventListener("url", handleOpenURL);
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Menu"
            component={OnMenu}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Game"
            component={OnGame}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
