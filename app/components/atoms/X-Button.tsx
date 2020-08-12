import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";
import { Colors } from "../../styles";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import {
  animateXButton,
  reverseAnimateXButton,
} from "../../greensock/X-Button";

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
    if (animate === null) return;

    //animate lines
    if (animate === true) animateXButton(firstLine.current, secondLine.current);
    else reverseAnimateXButton(firstLine.current, secondLine.current);
  }, [animate]);

  const pressAnimatiom = useRef(new Animated.Value(0)).current;

  const pressIn = () => {
    Animated.timing(pressAnimatiom, {
      toValue: 1,
      duration: 200,
      easing: Easing.bezier(0, 0.6, 0.8, 1),
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.timing(pressAnimatiom, {
      toValue: 0,
      duration: 200,
      easing: Easing.bezier(0, 0.6, 0.8, 1),
      useNativeDriver: true,
    }).start();
  };

  const transform = [
    {
      scale: pressAnimatiom.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.9],
      }),
    },
  ];

  return (
    <TouchableWithoutFeedback
      onPressIn={pressIn}
      onPress={onPress}
      onPressOut={pressOut}
    >
      <Animated.View style={[styles.container, { transform }]}>
        <View ref={firstLine} style={[styles.line]} />
        <View ref={secondLine} style={[styles.line]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
