import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";

type GameParam = {
  width: number;
  height: number;
};

export type RootStackParamList = {
  Menu: undefined;
  LocalMultiplayerGame: GameParam;
  NetworkMultiplayerGame: GameParam;
};

export const Stack = createStackNavigator<RootStackParamList>();

export type MenuScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Menu"
>;

export type LocalMultiplayerGameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LocalMultiplayerGame"
>;

export type NetworkMultiplayerGameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NetworkMultiplayerGame"
>;
