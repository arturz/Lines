import React, { ReactNode } from "react";
import { StyleSheet } from "react-native";
import Button from "../atoms/Button";
import { Colors } from "../../styles";

const styles = StyleSheet.create({
  modalButton: {
    height: 60,
    backgroundColor: Colors.YELLOW_DARK,
  },
  modalButtonTextStyle: {
    color: Colors.BLUE,
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
    style={styles.modalButton}
    textStyle={styles.modalButtonTextStyle}
    children={children}
    onPress={onPress}
  />
);
