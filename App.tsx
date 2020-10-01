import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import {
  OnMenu,
  OnLocalMultiplayerGame,
  OnNetworkMultiplayerGame,
} from "./app/screens";
import { configureStore } from "./app/redux";
import { Stack } from "./app/navigations";

const store = configureStore();

export default () => {
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
            name="LocalMultiplayerGame"
            component={OnLocalMultiplayerGame}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NetworkMultiplayerGame"
            component={OnNetworkMultiplayerGame}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
