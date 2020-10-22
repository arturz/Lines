import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../styles";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 40,
    paddingBottom: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 90,
    fontFamily: "FredokaOne-Regular",
    color: Colors.RED,
    letterSpacing: 9,
    textAlign: "center",
    lineHeight: 90,
  },
});

export default () => (
  <View style={styles.container}>
    <Text style={styles.text}>LINES{"\n"}GAME</Text>
  </View>
);
