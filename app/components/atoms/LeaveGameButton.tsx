import React from "react";
import BackIcon from "../../assets/images/back.svg";
import { View } from "react-native";
import { Colors, EStyleSheet, Sizes } from "../../styles";
import { TouchableScale } from "../wrappers/touchables";
import { useDynamicValue } from "react-native-dynamic";

const styles = EStyleSheet.create({
  container: {
    width: Sizes.GAME_HEADER.HEIGHT,
    height: Sizes.GAME_HEADER.HEIGHT,
    padding: Sizes.SPACING,
  },
});

export type LeaveGameButtonProps = {
  onPress: () => void;
};

export default ({ onPress }: LeaveGameButtonProps) => {
  const color = useDynamicValue(Colors.LEAVE_GAME_BUTTON_DYNAMIC);
  return (
    <View style={styles.container}>
      <TouchableScale minimumScale={0.9} onPress={onPress}>
        <BackIcon fill={color} width="100%" height="100%" />
      </TouchableScale>
    </View>
  );
};
