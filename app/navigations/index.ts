import { createStackNavigator } from "@react-navigation/stack";

export type RootStackParamList = {
  Menu: undefined;
  Game: {
    width: number;
    height: number;
  };
};

export const Stack = createStackNavigator<RootStackParamList>();
