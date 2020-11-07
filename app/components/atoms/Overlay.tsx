import { identity } from "lodash";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

type ComponentProps = ComponentOwnProps;
type ComponentOwnProps = {
  isVisible: boolean;
  duration?: number;
  onPress?: () => void;
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "black",
  },
  touchable: {
    width: "100%",
    height: "100%",
  },
});

const Overlay: React.FC<ComponentProps> = ({
  isVisible,
  duration = 1000,
  onPress = identity,
}) => {
  const overlayAnimation = useRef(new Animated.Value(0)).current;

  function showOverlay() {
    Animated.timing(overlayAnimation, {
      toValue: 1,
      duration,
      easing: Easing.bezier(0, 0.6, 0.8, 1),
      useNativeDriver: true,
    }).start();
  }

  function hideOverlay() {
    Animated.timing(overlayAnimation, {
      toValue: 0,
      duration,
      easing: Easing.bezier(0, 0.6, 0.8, 1),
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (isVisible) showOverlay();
    else hideOverlay();
  }, [isVisible]);

  return (
    <>
      <Animated.View
        pointerEvents={isVisible ? "auto" : "none"}
        style={[
          StyleSheet.absoluteFill,
          styles.overlay,
          {
            opacity: overlayAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={onPress} style={styles.touchable} />
      </Animated.View>
    </>
  );
};

export default Overlay;
