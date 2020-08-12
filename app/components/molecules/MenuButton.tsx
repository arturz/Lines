import React, { ReactNode, forwardRef, MutableRefObject } from "react";
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

export default forwardRef(
  (
    {
      children,
      onPress,
    }: {
      children: ReactNode;
      onPress: () => void;
    },
    ref: MutableRefObject<any>
  ) => (
    <Button
      style={styles.menuButton}
      textStyle={styles.menuButtonTextStyle}
      children={children}
      onPress={onPress}
      ref={ref}
    />
  )
);
