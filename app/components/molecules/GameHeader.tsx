import React from "react";
import { View, StyleSheet } from "react-native";
import {
  LeaveGameButton,
  CurrentPlayerIndicator,
  ConfigGameButton,
} from "../atoms";
import { CurrentPlayerIndicatorProps } from "../atoms/CurrentPlayerIndicator";
import { identity } from "lodash";

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
  },
});

type Props = CurrentPlayerIndicatorProps & {
  onLeaveGameButtonPress?: () => void;
  onConfigGameButtonPress?: () => void;
};

export default ({
  playerAText,
  playerBText,
  onLeaveGameButtonPress = identity,
  onConfigGameButtonPress = identity,
}: Props) => (
  <View style={styles.header}>
    <LeaveGameButton onPress={onLeaveGameButtonPress} />
    <CurrentPlayerIndicator
      playerAText={playerAText}
      playerBText={playerBText}
    />
    <ConfigGameButton onPress={onConfigGameButtonPress} />
  </View>
);
