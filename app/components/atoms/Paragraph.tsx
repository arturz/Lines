import React from "react";
import { StyleSheet, Text } from "react-native";
import { Colors } from "../../styles";

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 25,
    fontFamily: "Barlow-Medium",
    color: Colors.YELLOW,
    marginBottom: 15,
  },
});

export default ({
  children,
  style = {},
}: {
  children: string;
  style?: Object;
}) => <Text style={[styles.paragraph, style]}>{children}</Text>;
