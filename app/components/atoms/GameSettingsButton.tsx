import React from "react";
import SettingsIcon from "../../assets/images/settings.svg";
import { View, StyleSheet } from "react-native";
import { Colors } from "../../styles";
import { GAME_HEADER_HEIGHT } from "../../styles/sizes";
import { TouchableScaleRotate } from "../wrappers/touchables";

const styles = StyleSheet.create({
  container: {
    width: GAME_HEADER_HEIGHT * 1.2,
    height: GAME_HEADER_HEIGHT,
    padding: 10,
  },
});

export type SettingsGameButtonProps = {
  onPress: () => void;
};

export default ({ onPress }: SettingsGameButtonProps) => {
  return (
    <View style={styles.container}>
      <TouchableScaleRotate minimumScale={0.9} onPress={onPress}>
        <SettingsIcon
          fill={Colors.GAME_HEADER_CONTROLS}
          width="100%"
          height="100%"
        />
      </TouchableScaleRotate>
    </View>
  );
};
