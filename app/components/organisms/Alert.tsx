import React, { useRef, useEffect, ReactNode } from "react";
import { Animated, View, StyleSheet, Easing } from "react-native";
import { Colors } from "../../styles";
import { Header } from "../molecules";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 30,
  },
  alert: {
    backgroundColor: Colors.BLUE,
    borderRadius: 30,
    elevation: 10,
    width: "100%",
    maxWidth: 420,
    padding: 15,
  },
  main: {
    marginLeft: 15,
    marginRight: 15,
  },
});

interface Props {
  title: ReactNode;
  isOpen: boolean;
  children: React.ReactNode;
}

export default ({ isOpen, title, children }: Props) => {
  const animation = useRef(new Animated.Value(0)).current;

  const show = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 600,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  };

  const hide = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 600,
      easing: Easing.bezier(0, 0.6, 0.8, 1),
      useNativeDriver: true,
    }).start();
  };

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

  useEffect(() => {
    if (isOpen) {
      show();
      return;
    }

    hide();
  }, [isOpen]);

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.container]}
      pointerEvents={isOpen ? "auto" : "none"}
    >
      <Animated.View style={[styles.alert, animationStyle]}>
        <Header title={title} />
        <View style={styles.main}>{children}</View>
      </Animated.View>
    </View>
  );
};