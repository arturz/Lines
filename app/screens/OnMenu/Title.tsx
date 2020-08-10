import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../styles";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Dimensions.get("window").height * 0.5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 100,
    fontFamily: "Barlow-Regular",
    color: Colors.RED,
  },
});

export default () => (
  <View style={styles.container}>
    <Text style={styles.text}>LINES</Text>
  </View>
);
