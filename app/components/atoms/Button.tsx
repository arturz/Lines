import React, {
  ReactNode,
  useRef,
  forwardRef,
  MutableRefObject,
  useImperativeHandle,
} from "react";
import { Text, StyleSheet, View } from "react-native";
import { Colors, Sizes } from "../../styles";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import TouchableScale from "../wrappers/TouchableScale";

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

    return (
      <TouchableScale onPress={onPress}>
        <View style={[styles.container, style]} ref={button}>
          <Text style={[styles.text, textStyle]} ref={text}>
            {children}
          </Text>
        </View>
      </TouchableScale>
    )
  }
);
