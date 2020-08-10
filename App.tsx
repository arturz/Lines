import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { PortalProvider } from "react-native-portal";
import { Provider } from "react-redux";
import { OnMenu, OnGame } from "./app/screens";
import { store } from "./app/store";
import { Stack } from "./app/navigations";

export default () => (
  <Provider store={store}>
    <PortalProvider>
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
    </PortalProvider>
  </Provider>
);
