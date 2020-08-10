import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Sizes } from "../../styles";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    height: Sizes.BUTTON_HEIGHT,
    width: Sizes.BUTTON_WIDTH,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Math.max(Sizes.BUTTON_HEIGHT, Sizes.BUTTON_WIDTH),
    textTransform: "uppercase",
    marginBottom: 15,
  },
  text: {
    fontFamily: "Barlow-Medium",
    fontSize: 25,
    color: Colors.BLUE,
    textTransform: "uppercase",
  },
});

export default ({
  children,
  style = {},
  textStyle = {},
  onPress,
}: {
  children: ReactNode;
  style?: Object;
  textStyle?: Object;
  onPress: () => void;
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </View>
  </TouchableWithoutFeedback>
);
