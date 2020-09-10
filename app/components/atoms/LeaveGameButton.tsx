import React from "react";
import BackIcon from "../../assets/images/back.svg";
import { View, StyleSheet } from "react-native";
import { Colors } from "../../styles";
import { GAME_HEADER_HEIGHT } from "../../styles/sizes";
import { TouchableScale } from "../wrappers/touchables";

const styles = StyleSheet.create({
  container: {
    width: GAME_HEADER_HEIGHT * 1.2,
    height: GAME_HEADER_HEIGHT,
    padding: 10,
  },
});

export type LeaveGameButtonProps = {
  onPress: () => void;
};

export default ({ onPress }: LeaveGameButtonProps) => {
  return (
    <View style={styles.container}>
      <TouchableScale minimumScale={0.9} onPress={onPress}>
        <BackIcon
          fill={Colors.GAME_HEADER_CONTROLS}
          width="100%"
          height="100%"
        />
      </TouchableScale>
    </View>
  );
};
