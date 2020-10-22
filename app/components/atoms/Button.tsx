import React, {
  ReactNode,
  useRef,
  forwardRef,
  MutableRefObject,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from "react";
import { Text, StyleSheet, View } from "react-native";
import { Colors, Sizes } from "../../styles";
import { TouchableScale } from "../wrappers/touchables";

const styles = StyleSheet.create({
  button: {
    height: Sizes.BUTTON_HEIGHT,
    width: Sizes.BUTTON_WIDTH,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Math.max(Sizes.BUTTON_HEIGHT, Sizes.BUTTON_WIDTH),
    textTransform: "uppercase",
  },
  margin: {
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

type ComponentProps = ComponentOwnProps & {
  forwardedRef?: Ref;
};

export { ComponentProps as ButtonProps };

type ComponentOwnProps = {
  style?: Object;
  textStyle?: Object;
  withoutMargin?: boolean;
  onPress: () => void;
  ref?: Ref;
};

export { ComponentOwnProps as ButtonOwnProps };

export type ButtonHandles = {
  button: View | null;
  text: Text | null;
};

type Ref =
  | ((instance: ButtonHandles | null) => void)
  | MutableRefObject<ButtonHandles | null>
  | null;

export { Ref as ButtonHandlesRef };

const Button: React.FC<ComponentProps> = ({
  children,
  forwardedRef,
  onPress,
  withoutMargin,
  style = {},
  textStyle = {},
}) => {
  const button = useRef<View>(null);
  const text = useRef<Text>(null);

  useImperativeHandle(forwardedRef, () => ({
    get button() {
      return button.current;
    },
    get text() {
      return text.current;
    },
  }));

  return (
    <View style={withoutMargin ? null : styles.margin}>
      <TouchableScale onPress={onPress}>
        <View style={[styles.button, style]} ref={button}>
          <Text style={[styles.text, textStyle]} ref={text}>
            {children}
          </Text>
        </View>
      </TouchableScale>
    </View>
  );
};

const ForwardedButton: ForwardRefRenderFunction<
  ButtonHandles,
  React.PropsWithChildren<ComponentOwnProps>
> = (props, ref) => <Button {...props} forwardedRef={ref} />;

export default forwardRef(ForwardedButton);
