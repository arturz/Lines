import React from "react";
import { View, StyleSheet } from "react-native";
import {
  LeaveGameButton,
  CurrentPlayerIndicator,
  ConfigGameButton,
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
  onConfigGameButtonPress?: () => void;
};

const GameHeader: React.FC<ComponentProps> = ({
  playerAText,
  playerBText,
  onLeaveGameButtonPress = identity,
  onConfigGameButtonPress = identity,
}) => (
  <View style={styles.header}>
    <LeaveGameButton onPress={onLeaveGameButtonPress} />
    <CurrentPlayerIndicator
      playerAText={playerAText}
      playerBText={playerBText}
    />
    <ConfigGameButton onPress={onConfigGameButtonPress} />
  </View>
);
export default GameHeader;
