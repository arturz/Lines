import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { PortalProvider } from "react-native-portal";
import { OnMenu, OnGame } from "./app/screens";

const Stack = createStackNavigator();

const App = () => (
  <PortalProvider>
    <NavigationContainer>
      <Stack.Navigator>
        {/*<Stack.Screen
          name="Menu"
          component={OnMenu}
          options={{ headerShown: false }}
        />*/}
        <Stack.Screen
          name="Game"
          component={OnGame}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </PortalProvider>
);

export default App;
