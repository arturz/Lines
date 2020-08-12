import React, {
  ReactNode,
  useRef,
  forwardRef,
  MutableRefObject,
  useImperativeHandle,
} from "react";
import { Text, StyleSheet, Animated, Easing } from "react-native";
import { Colors, Sizes } from "../../styles";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    height: Sizes.BUTTON_HEIGHT,
    width: Sizes.BUTTON_WIDTH,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Math.max(Sizes.BUTTON_HEIGHT, Sizes.BUTTON_WIDTH),
    textTransform: "uppercase",
    marginBottom: 15,
  },
  text: {
    fontFamily: "Barlow-Medium",
    fontSize: 25,
    color: Colors.BLUE,
    textTransform: "uppercase",
    textAlign: "center",
  },
});

interface Props {
  children: ReactNode;
  style?: Object;
  textStyle?: Object;
  onPress: () => void;
}

export default forwardRef<TouchableWithoutFeedback, Props>(
  (
    { children, style = {}, textStyle = {}, onPress }: Props,
    forwardedRef: MutableRefObject<any>
  ) => {
    const button = useRef(null);
    const text = useRef(null);

    useImperativeHandle(forwardedRef, () => ({
      get button() {
        return button.current;
      },
      get text() {
        return text.current;
      },
    }));

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
          outputRange: [1, 0.95],
        }),
      },
    ];

    return (
      <TouchableWithoutFeedback
        onPressIn={pressIn}
        onPress={onPress}
        onPressOut={pressOut}
      >
        <Animated.View
          style={[styles.container, style, { transform }]}
          ref={button}
        >
          <Text style={[styles.text, textStyle]} ref={text}>
            {children}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
);
