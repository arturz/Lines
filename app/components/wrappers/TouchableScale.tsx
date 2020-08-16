import React, { useRef, ReactNode } from 'react'
import { TouchableWithoutFeedback, ContainedTouchableProperties } from 'react-native-gesture-handler'
import { Animated, Easing } from 'react-native';

type Props = Exclude<React.ComponentProps<typeof TouchableWithoutFeedback>, ContainedTouchableProperties> & {
  children: ReactNode
  minimumScale?: number
}

export default ({ children, minimumScale = 0.95, ...props }: Props) => {
  const pressAnimatiom = useRef(new Animated.Value(0)).current

  const onPressIn = (evt) => {
    props.onPressIn && props.onPressIn(evt)

    Animated.timing(pressAnimatiom, {
      toValue: 1,
      duration: 200,
      easing: Easing.bezier(0, 0.6, 0.8, 1),
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = (evt) => {
    props.onPressOut && props.onPressOut(evt)

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

  return <TouchableWithoutFeedback {...props} onPressIn={onPressIn} onPressOut={onPressOut}>
    <Animated.View style={{ transform }}>
      {children}
    </Animated.View>
  </TouchableWithoutFeedback>
}