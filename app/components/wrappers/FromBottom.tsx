import React, { ReactElement } from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  box: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
});

export default ({ children }: { children: ReactElement }) => (
  <View style={styles.container}>
    <View style={styles.box}>{children}</View>
  </View>
);
