import React, { forwardRef, ForwardRefRenderFunction } from "react";
import Button, {
  ButtonHandles,
  ButtonHandlesRef,
  ButtonOwnProps,
} from "../atoms/Button";
import { Colors, EStyleSheet, Sizes } from "../../styles";
import { useDynamicValue } from "react-native-dynamic";

const styles = EStyleSheet.create({
  menuButton: {
    width: Sizes.MENU_BUTTON.WIDTH,
    height:
      EStyleSheet.value(Sizes.MENU_BUTTON.WIDTH) /
      Sizes.MENU_BUTTON.ASPECT_RATIO,
  },
  menuButtonTextStyle: {
    fontSize: Sizes.MENU_BUTTON.FONT_SIZE,
  },
});

type ComponentProps = ComponentOwnProps & {
  forwardedRef?: ButtonHandlesRef;
};

type ComponentOwnProps = Omit<ButtonOwnProps, "style" | "textStyle">;

const Component: React.FC<ComponentProps> = ({ forwardedRef, ...props }) => {
  const backgroundColor = useDynamicValue(Colors.PRIMARY_DYNAMIC);
  const color = useDynamicValue(Colors.PRIMARY_TEXT_DYNAMIC);

  return (
    <Button
      ref={forwardedRef}
      {...props}
      style={[styles.menuButton, { backgroundColor }]}
      textStyle={[styles.menuButtonTextStyle, { color }]}
    />
  );
};

const ForwardedComponent: ForwardRefRenderFunction<
  ButtonHandles,
  React.PropsWithChildren<ComponentOwnProps>
> = (props, ref) => <Component {...props} forwardedRef={ref} />;

export default forwardRef(ForwardedComponent);
