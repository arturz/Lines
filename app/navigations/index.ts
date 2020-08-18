import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";

export type RootStackParamList = {
  Menu: undefined;
  Game: {
    width: number;
    height: number;
  };
};

export const Stack = createStackNavigator<RootStackParamList>();

export type MenuScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Menu"
>;

export type GameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Menu"
>;
