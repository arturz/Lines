import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { Colors, EStyleSheet, Sizes } from "../../styles";
import {
  animateXButton,
  reverseAnimateXButton,
} from "../../greensock/X-Button";
import { TouchableScaleRotate } from "../wrappers/touchables";
import { useDynamicValue } from "react-native-dynamic";

const styles = EStyleSheet.create({
  container: {
    position: "relative",
    width: Sizes.X_BUTTON.WIDTH,
    aspectRatio: 1,
    backgroundColor: Colors.GRAY,
    borderRadius: Sizes.X_BUTTON.WIDTH,
  },
  lineContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  line: {
    height: EStyleSheet.value(Sizes.X_BUTTON.WIDTH) * 0.75,
    width: EStyleSheet.value(Sizes.X_BUTTON.WIDTH) * 0.2,
    backgroundColor: Colors.BACKGROUND,
    borderRadius: EStyleSheet.value(Sizes.X_BUTTON.WIDTH) * 0.75,
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

  const containerBackgroundColor = useDynamicValue(
    Colors.X_BUTTON.CONTAINER_DYNAMIC
  );
  const linesBackgroundColor = useDynamicValue(Colors.X_BUTTON.LINES_DYNAMIC);

  return (
    <TouchableScaleRotate onPress={onPress}>
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: containerBackgroundColor },
        ]}
      >
        <View style={[StyleSheet.absoluteFill, styles.lineContainer]}>
          <View
            ref={firstLine}
            style={[styles.line, { backgroundColor: linesBackgroundColor }]}
          />
        </View>
        <View style={[StyleSheet.absoluteFill, styles.lineContainer]}>
          <View
            ref={secondLine}
            style={[styles.line, { backgroundColor: linesBackgroundColor }]}
          />
        </View>
      </Animated.View>
    </TouchableScaleRotate>
  );
};
