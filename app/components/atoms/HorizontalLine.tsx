import React from "react";
import { View, Text } from "react-native";
import { Colors, EStyleSheet, Sizes } from "../../styles";

const styles = EStyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.SPACING,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.GRAY,
  },
  text: {
    fontFamily: "Barlow-Medium",
    fontSize: Sizes.PARAGRAPH.FONT_SIZE,
    color: Colors.GRAY,
    paddingLeft: Sizes.SPACING,
    paddingRight: Sizes.SPACING,
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
