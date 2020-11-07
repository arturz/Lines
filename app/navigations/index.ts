import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { GameSize } from "../constants";

export type NetworkHostProp = { gameSize: GameSize } & { isHost: true };
export type NetworkGuestProp = { id: string; isHost: false };

export type NetworkHostGameProp = {
  gameSize: GameSize;
};
export type NetworkGuestGameProp = {
  id: string;
};

export type RootStackParamList = {
  Menu: undefined;
  Tutorial: undefined;
  LocalMultiplayerGame: {
    gameSize: GameSize;
  };
  NetworkMultiplayerGame: NetworkHostProp | NetworkGuestProp;
};

export const Stack = createStackNavigator<RootStackParamList>();

export type MenuScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Menu"
>;

export type TutorialScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Tutorial"
>;

export type LocalMultiplayerGameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "LocalMultiplayerGame"
>;

export type NetworkMultiplayerGameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NetworkMultiplayerGame"
>;

//for withGameDeepLinking - it should work on every screen
export type AnyScreenNavigationProp =
  | MenuScreenNavigationProp
  | TutorialScreenNavigationProp
  | LocalMultiplayerGameScreenNavigationProp
  | NetworkMultiplayerGameScreenNavigationProp;

export * from "./MyTransition";
