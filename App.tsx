import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import FlashMessage from "react-native-flash-message";
import {
  OnMenu,
  OnLocalMultiplayerGame,
  OnNetworkMultiplayerGame,
  OnTutorial,
} from "./app/screens";
import { configureStore } from "./app/redux";
import { MyTransition, Stack } from "./app/navigations";
import { DarkModeProvider } from "./app/components/wrappers";

const store = configureStore();

const screenOptions = {
  headerShown: false,
  ...MyTransition,
};

export default () => {
  return (
    <>
      <Provider store={store}>
        <DarkModeProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Menu"
                component={OnMenu}
                options={screenOptions}
              />
              <Stack.Screen
                name="Tutorial"
                component={OnTutorial}
                options={screenOptions}
              />
              <Stack.Screen
                name="LocalMultiplayerGame"
                component={OnLocalMultiplayerGame}
                options={screenOptions}
              />
              <Stack.Screen
                name="NetworkMultiplayerGame"
                component={OnNetworkMultiplayerGame}
                options={screenOptions}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </DarkModeProvider>
      </Provider>
      <FlashMessage position="top" />
    </>
  );
};
