import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { yellowDark, blue } from "../constants/colors";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: yellowDark,
    borderRadius: 80,
    textTransform: "uppercase",
    marginBottom: 15,
  },
  text: {
    fontFamily: "Barlow-Medium",
    fontSize: 25,
    color: blue,
    textTransform: "uppercase",
  },
});

export default ({
  children,
  style = {},
  onPress,
}: {
  children: ReactNode;
  onPress: (any) => void;
  style?: Object;
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  </TouchableWithoutFeedback>
);
