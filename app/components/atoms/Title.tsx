import React, { ReactNode } from "react";
import { Text } from "react-native";
import { useDynamicValue } from "react-native-dynamic";
import { Colors, EStyleSheet, Sizes } from "../../styles";

const styles = EStyleSheet.create({
  title: {
    fontFamily: "FredokaOne-Regular",
    fontSize: Sizes.TITLE.FONT_SIZE,
    marginLeft: Sizes.SPACING,
  },
});

export default ({ children }: { children: ReactNode }) => {
  const color = useDynamicValue(Colors.TITLE_DYNAMIC);
  return <Text style={[styles.title, { color }]}>{children}</Text>;
};
