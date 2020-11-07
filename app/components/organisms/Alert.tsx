import React, { useRef, useEffect, ReactNode, useState } from "react";
import { Animated, View, StyleSheet, Easing } from "react-native";
import { useDynamicValue } from "react-native-dynamic";
import { Colors, EStyleSheet, Sizes } from "../../styles";
import { Overlay } from "../atoms";
import { ModalHeader } from "../molecules";

const styles = EStyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: Sizes.SPACING_DOUBLE,
  },
  alert: {
    borderRadius: Sizes.MODAL.BORDER_RADIUS,
    elevation: 6,
    width: "100%",
    padding: Sizes.MODAL.PADDING,
  },
  main: {
    marginLeft: Sizes.SPACING,
    marginRight: Sizes.SPACING,
  },
});

type ComponentProps = ComponentOwnProps;
type ComponentOwnProps = {
  title: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
};

const Alert: React.FC<ComponentProps> = ({
  isOpen,
  title,
  onClose,
  children,
}) => {
  const [overlay, setOverlay] = useState<boolean>(false);
  const animation = useRef(new Animated.Value(0)).current;

  const show = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.bezier(0, 0.6, 0.8, 1),
      useNativeDriver: true,
    }).start();
    setOverlay(true);
  };

  const hide = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      easing: Easing.bezier(0, 0.6, 0.8, 1),
      useNativeDriver: true,
    }).start();
    setOverlay(false);
  };

  useEffect(() => {
    if (isOpen) {
      show();
      return;
    }

    hide();
  }, [isOpen]);

  const animationStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: isOpen ? [200, 0] : [-200, 0],
        }),
      },
    ],
  };

  const backgroundColor = useDynamicValue(Colors.BACKGROUND_DYNAMIC);

  return (
    <>
      <Overlay isVisible={overlay} duration={300} onPress={onClose} />
      <View
        style={[StyleSheet.absoluteFill, styles.container]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <Animated.View
          style={[styles.alert, animationStyle, { backgroundColor }]}
        >
          <ModalHeader
            title={title}
            xButton={onClose ? { animate: true, onPress: onClose } : false}
          />
          <View style={styles.main}>{children}</View>
        </Animated.View>
      </View>
    </>
  );
};
export default Alert;
