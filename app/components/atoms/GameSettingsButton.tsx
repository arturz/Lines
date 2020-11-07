import React from "react";
import SettingsIcon from "../../assets/images/settings.svg";
import { View } from "react-native";
import { Colors, EStyleSheet, Sizes } from "../../styles";
import { TouchableScaleRotate } from "../wrappers/touchables";
import { useDynamicValue } from "react-native-dynamic";

const styles = EStyleSheet.create({
  container: {
    width: Sizes.GAME_HEADER.HEIGHT,
    height: Sizes.GAME_HEADER.HEIGHT,
    padding: Sizes.SPACING,
  },
});

export type SettingsGameButtonProps = {
  onPress: () => void;
};

export default ({ onPress }: SettingsGameButtonProps) => {
  const color = useDynamicValue(Colors.GAME_SETTINGS_BUTTON_DYNAMIC);
  return (
    <View style={styles.container}>
      <TouchableScaleRotate minimumScale={0.9} onPress={onPress}>
        <SettingsIcon fill={color} width="100%" height="100%" />
      </TouchableScaleRotate>
    </View>
  );
};
