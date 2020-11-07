import React from "react";
import { Text } from "react-native";
import { useDynamicValue } from "react-native-dynamic";
import { Colors, EStyleSheet, Sizes } from "../../styles";

const styles = EStyleSheet.create({
  paragraph: {
    fontSize: Sizes.PARAGRAPH.FONT_SIZE,
    fontFamily: "Barlow-Medium",
    marginBottom: Sizes.SPACING_DOUBLE,
  },
});

export default ({
  children,
  style = {},
}: {
  children: string;
  style?: Object;
}) => {
  const color = useDynamicValue(Colors.PARAGRAPH_DYNAMIC);
  return <Text style={[styles.paragraph, style, { color }]}>{children}</Text>;
};
