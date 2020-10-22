import React, { forwardRef, ForwardRefRenderFunction } from "react";
import { StyleSheet } from "react-native";
import Button, {
  ButtonHandles,
  ButtonHandlesRef,
  ButtonOwnProps,
} from "../atoms/Button";
import { Colors, Sizes } from "../../styles";

const styles = StyleSheet.create({
  menuButton: {
    height: Sizes.MENU_BUTTON_HEIGHT,
    backgroundColor: Colors.BLUE,
  },
  menuButtonTextStyle: {
    color: Colors.YELLOW,
  },
});

type ComponentProps = ComponentOwnProps & {
  forwardedRef?: ButtonHandlesRef;
};

type ComponentOwnProps = Omit<ButtonOwnProps, "style" | "textStyle">;

const Component: React.FC<ComponentProps> = ({ forwardedRef, ...props }) => (
  <Button
    ref={forwardedRef}
    {...props}
    style={styles.menuButton}
    textStyle={styles.menuButtonTextStyle}
  />
);

const ForwardedComponent: ForwardRefRenderFunction<
  ButtonHandles,
  React.PropsWithChildren<ComponentOwnProps>
> = (props, ref) => <Component {...props} forwardedRef={ref} />;

export default forwardRef(ForwardedComponent);
