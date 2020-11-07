import React, {
  ReactNode,
  useRef,
  forwardRef,
  MutableRefObject,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from "react";
import { Text, View } from "react-native";
import { Colors, EStyleSheet, Sizes } from "../../styles";
import { TouchableScale } from "../wrappers/touchables";

const styles = EStyleSheet.create({
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Sizes.MENU_BUTTON.WIDTH,
    textTransform: "uppercase",
  },
  singleMargin: {
    marginBottom: Sizes.SPACING,
  },
  doubleMargin: {
    marginBottom: Sizes.SPACING_DOUBLE,
  },
  text: {
    fontFamily: "Barlow-Medium",
    color: Colors.BLUE,
    textTransform: "uppercase",
    textAlign: "center",
  },
});

type ComponentProps = ComponentOwnProps & {
  forwardedRef?: Ref;
};

export { ComponentProps as ButtonProps };

type Margin = "none" | "single" | "double";
type ComponentOwnProps = {
  style?: Object;
  textStyle?: Object;
  margin?: Margin;
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

const margins: { [type in Margin]: Object | null } = {
  single: styles.singleMargin,
  double: styles.doubleMargin,
  none: null,
};

const Button: React.FC<ComponentProps> = ({
  children,
  forwardedRef,
  onPress,
  margin,
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
    <View style={margins[margin || "single"]}>
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
