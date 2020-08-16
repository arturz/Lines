import React, { useRef, ReactNode } from "react";
import {
  TouchableWithoutFeedback,
  ContainedTouchableProperties,
} from "react-native-gesture-handler";
import { Animated, Easing } from "react-native";
import { pipe, identity } from "lodash/fp";

export type TouchableProps = Exclude<
  React.ComponentProps<typeof TouchableWithoutFeedback>,
  ContainedTouchableProperties
> & {
  children: ReactNode;
};

type TouchableBaseProps = TouchableProps & {
  extend: {
    [property: string]: {
      outputRange: number[] | string[];
    };
  };
};

export default ({
  children,
  extend = {},
  onPressIn = identity,
  onPressOut = identity,
  ...props
}: TouchableBaseProps) => {
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

  const style = {
    transform: Object.entries(extend).map(([property, { outputRange }]) => ({
      [property]: pressAnimatiom.interpolate({
        inputRange: [0, 1],
        outputRange,
      }),
    })),
  };

  return (
    <TouchableWithoutFeedback
      {...props}
      onPressIn={pipe(pressIn, onPressIn)}
      onPressOut={pipe(pressOut, onPressOut)}
    >
      <Animated.View style={style}>{children}</Animated.View>
    </TouchableWithoutFeedback>
  );
};
