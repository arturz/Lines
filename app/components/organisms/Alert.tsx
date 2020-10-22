import React, { useRef, useEffect, ReactNode, useState } from "react";
import { Animated, View, StyleSheet, Easing } from "react-native";
import { Colors } from "../../styles";
import { Overlay } from "../atoms";
import { ModalHeader } from "../molecules";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  alert: {
    backgroundColor: Colors.BLUE,
    borderRadius: 30,
    elevation: 6,
    width: "100%",
    maxWidth: 420,
    padding: 15,
  },
  main: {
    marginLeft: 15,
    marginRight: 15,
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

  return (
    <>
      <Overlay isVisible={overlay} duration={300} onPress={onClose} />
      <View
        style={[StyleSheet.absoluteFill, styles.container]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <Animated.View style={[styles.alert, animationStyle]}>
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
