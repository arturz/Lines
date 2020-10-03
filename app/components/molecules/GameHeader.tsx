import React from "react";
import { View, StyleSheet } from "react-native";
import {
  LeaveGameButton,
  CurrentPlayerIndicator,
  GameSettingsButton,
} from "../atoms";
import { identity } from "lodash";

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
  },
});

type ComponentProps = ComponentOwnProps;
type ComponentOwnProps = {
  playerAText: string;
  playerBText: string;
  onLeaveGameButtonPress?: () => void;
  onGameSettingsButtonPress?: () => void;
};

const GameHeader: React.FC<ComponentProps> = ({
  playerAText,
  playerBText,
  onLeaveGameButtonPress = identity,
  onGameSettingsButtonPress = identity,
}) => (
  <View style={styles.header}>
    <LeaveGameButton onPress={onLeaveGameButtonPress} />
    <CurrentPlayerIndicator
      playerAText={playerAText}
      playerBText={playerBText}
    />
    <GameSettingsButton onPress={onGameSettingsButtonPress} />
  </View>
);
export default GameHeader;
