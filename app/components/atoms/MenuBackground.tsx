import React, { useEffect } from "react";
import { Dimensions, Easing, Animated, View, StyleSheet } from "react-native";
import { useColorSchemeContext } from "react-native-dynamic";
import { Colors } from "../../styles";

const { width, height } = Dimensions.get("window");
const size = Math.hypot(width, height) * 2;
const halfSize = size / 2;

type ComponentProps = ComponentOwnProps;
type ComponentOwnProps = {};

const CircleTransition: React.FC<ComponentProps> = () => {
  const animation = new Animated.Value(1);

  const mode = useColorSchemeContext();
  useEffect(() => {
    animation.setValue(1);
    Animated.timing(animation, {
      duration: 300,
      toValue: 0,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [mode]);

  const light = Colors.BACKGROUND;
  const dark = Colors.BACKGROUND_DARK;
  const backgroundColor = mode === "dark" ? dark : light;
  const toggledBackgroundColor = mode === "dark" ? light : dark;

  return (
    <>
      <View style={[StyleSheet.absoluteFill, { backgroundColor }]} />
      <Animated.View
        style={{
          position: "absolute",
          bottom: -halfSize,
          left: -halfSize,
          backgroundColor: toggledBackgroundColor,
          width: size,
          height: size,
          borderRadius: size,
          transform: [
            {
              scale: animation,
            },
          ],
        }}
      />
    </>
  );
};

export default CircleTransition;
