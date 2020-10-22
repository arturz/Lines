import React, {
  ReactNode,
  forwardRef,
  MutableRefObject,
  ForwardRefRenderFunction,
} from "react";
import { StyleSheet } from "react-native";
import Button, { ButtonHandles, ButtonHandlesRef } from "../atoms/Button";
import { Colors } from "../../styles";

const styles = StyleSheet.create({
  modalButton: {
    height: 60,
    backgroundColor: Colors.YELLOW_DARK,
  },
  modalButtonTextStyle: {
    color: Colors.BLUE,
  },
});

type ComponentProps = ComponentOwnProps & {
  forwardedRef?: ButtonHandlesRef;
};

type ComponentOwnProps = {
  onPress: () => void;
  ref?: ButtonHandlesRef;
};

const Component: React.FC<ComponentProps> = ({ forwardedRef, ...props }) => (
  <Button
    ref={forwardedRef}
    {...props}
    style={styles.modalButton}
    textStyle={styles.modalButtonTextStyle}
  />
);

const ForwardedComponent: ForwardRefRenderFunction<
  ButtonHandles,
  React.PropsWithChildren<ComponentOwnProps>
> = (props, ref) => <Component {...props} forwardedRef={ref} />;

export default forwardRef(ForwardedComponent);
