import React, { useRef, ReactNode } from "react";
import {
  TouchableWithoutFeedback,
  ContainedTouchableProperties,
} from "react-native-gesture-handler";
import { Animated, Easing } from "react-native";
import { pipe, identity } from "lodash/fp";

type Props = Exclude<
  React.ComponentProps<typeof TouchableWithoutFeedback>,
  ContainedTouchableProperties
> & {
  children: ReactNode;
  minimumScale?: number;
};

export default ({
  children,
  minimumScale = 0.95,
  onPressIn = identity,
  onPressOut = identity,
  ...props
}: Props) => {
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
        outputRange: [1, minimumScale],
      }),
    },
  ];

  return (
    <TouchableWithoutFeedback
      {...props}
      onPressIn={pipe(pressIn, onPressIn)}
      onPressOut={pipe(pressOut, onPressOut)}
    >
      <Animated.View style={{ transform }}>{children}</Animated.View>
    </TouchableWithoutFeedback>
  );
};
