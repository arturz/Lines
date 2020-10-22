import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { Colors } from "../../styles";
import {
  animateXButton,
  reverseAnimateXButton,
} from "../../greensock/X-Button";
import { TouchableScaleRotate } from "../wrappers/touchables";

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: 40,
    height: 40,
    backgroundColor: Colors.RED,
    borderRadius: 40,
  },
  line: {
    position: "absolute",
    left: 16,
    top: 5,
    height: 30,
    width: 8,
    backgroundColor: Colors.YELLOW,
    borderRadius: 30,
  },
});

export default ({
  onPress = () => void 0,
  animate = false,
}: {
  onPress: () => void;
  animate?: boolean;
}) => {
  const firstLine = useRef<View>(null);
  const secondLine = useRef<View>(null);

  useEffect(() => {
    if (
      animate === null ||
      firstLine.current === null ||
      secondLine.current === null
    )
      return;

    //animate lines
    if (animate === true) animateXButton(firstLine.current, secondLine.current);
    else reverseAnimateXButton(firstLine.current, secondLine.current);
  }, [animate]);

  return (
    <TouchableScaleRotate onPress={onPress}>
      <Animated.View style={styles.container}>
        <View ref={firstLine} style={[styles.line]} />
        <View ref={secondLine} style={[styles.line]} />
      </Animated.View>
    </TouchableScaleRotate>
  );
};
