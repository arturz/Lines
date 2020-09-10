import React, { ReactNode, forwardRef, MutableRefObject } from "react";
import { StyleSheet } from "react-native";
import Button from "../atoms/Button";
import { Colors } from "../../styles";

const styles = StyleSheet.create({
  modalButton: {
    height: 60,
    backgroundColor: Colors.YELLOW_DARK,
  },
  modalButtonTextStyle: {
    color: Colors.RED,
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
      style={styles.modalButton}
      textStyle={styles.modalButtonTextStyle}
      children={children}
      onPress={onPress}
      ref={ref}
    />
  )
);
