import React from "react";
import { Text, StyleSheet } from "react-native";
import { Colors } from "../../styles";

const styles = StyleSheet.create({
  title: {
    fontFamily: "Barlow-Medium",
    fontSize: 30,
    color: Colors.YELLOW,
    marginLeft: 15,
  },
});

export default ({ children }: { children: string }) => (
  <Text style={styles.title}>{children}</Text>
);
