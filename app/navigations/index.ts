import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { MapSize } from "../constants";

export type NetworkHostProp = MapSize & { isHost: true };
export type NetworkGuestProp = { id: string; isHost: false };

export type RootStackParamList = {
  Menu: undefined;
  LocalMultiplayerGame: MapSize;
  NetworkMultiplayerGame: NetworkHostProp | NetworkGuestProp;
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
