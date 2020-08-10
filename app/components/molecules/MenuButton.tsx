import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import Button from "../atoms/Button";
import { Colors } from "../../styles";

const styles = StyleSheet.create({
  menuButton: {
    height: 80,
    backgroundColor: Colors.BLUE,
  },
  menuButtonTextStyle: {
    color: Colors.YELLOW,
  },
});

export default ({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress: () => void;
}) => (
  <Button
    style={styles.menuButton}
    textStyle={styles.menuButtonTextStyle}
    children={children}
    onPress={onPress}
  />
);
