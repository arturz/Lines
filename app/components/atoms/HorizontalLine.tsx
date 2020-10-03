import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Colors } from "../../styles";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.YELLOW,
  },
  text: {
    fontFamily: "Barlow-Medium",
    fontSize: 25,
    color: Colors.YELLOW,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

const HorizontalLine: React.FC = ({ children }) => (
  <View style={styles.container}>
    <View style={styles.line} />
    <View>
      <Text style={styles.text}>{children}</Text>
    </View>
    <View style={styles.line} />
  </View>
);

export default HorizontalLine;
