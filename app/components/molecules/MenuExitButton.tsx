import React, { forwardRef, ForwardRefRenderFunction } from "react";
import Button, { ButtonHandles, ButtonHandlesRef } from "../atoms/Button";
import { Colors, EStyleSheet, Sizes } from "../../styles";
import { useDynamicValue } from "react-native-dynamic";

const styles = EStyleSheet.create({
  modalButton: {
    width: Sizes.MENU_BUTTON_SECONDARY.WIDTH,
    aspectRatio: Sizes.MENU_BUTTON_SECONDARY.ASPECT_RATIO,
  },
  modalButtonTextStyle: {
    fontSize: Sizes.MENU_BUTTON_SECONDARY.FONT_SIZE,
  },
});

type ComponentProps = ComponentOwnProps & {
  forwardedRef?: ButtonHandlesRef;
};

type ComponentOwnProps = {
  onPress: () => void;
  ref?: ButtonHandlesRef;
};

const Component: React.FC<ComponentProps> = ({ forwardedRef, ...props }) => {
  const backgroundColor = useDynamicValue(Colors.SECONDARY_DYNAMIC);
  const color = useDynamicValue(Colors.SECONDARY_TEXT_DYNAMIC);

  return (
    <Button
      ref={forwardedRef}
      {...props}
      style={[styles.modalButton, { backgroundColor }]}
      textStyle={[styles.modalButtonTextStyle, { color }]}
    />
  );
};

const ForwardedComponent: ForwardRefRenderFunction<
  ButtonHandles,
  React.PropsWithChildren<ComponentOwnProps>
> = (props, ref) => <Component {...props} forwardedRef={ref} />;

export default forwardRef(ForwardedComponent);
