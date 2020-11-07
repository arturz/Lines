import React from "react";
import { View, Text } from "react-native";
import { useDynamicValue } from "react-native-dynamic";
import { Colors, EStyleSheet, Sizes } from "../../styles";

const styles = EStyleSheet.create({
  container: {
    width: "100%",
    marginTop: Sizes.MENU_TITLE.MARGINS_Y,
    marginBottom: Sizes.MENU_TITLE.MARGINS_Y,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: Sizes.MENU_TITLE.FONT_SIZE,
    lineHeight: Sizes.MENU_TITLE.LINE_HEIGHT,
    fontFamily: "FredokaOne-Regular",
    letterSpacing: 9,
    textAlign: "center",
  },
});

export default () => {
  const color = useDynamicValue(Colors.MENU_TITLE_DYNAMICS);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color }]}>LINES{"\n"}GAME</Text>
    </View>
  );
};
