import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponderInstance,
} from "react-native";
import Canvas from "react-native-canvas";
import { MapSize } from "../../constants/MapSize";
import { Game } from "../../classes/Game";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  canvas: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
  },
});

export default ({
  route: {
    // params: { size },
  },
}: {
  route: {
    //params: { size: MapSize };
  };
}) => {
  const width = 10;
  const height = 10;
  const widthPx = Dimensions.get("window").width;
  const heightPx = Dimensions.get("window").height;

  const base = useRef(null);
  const animations = useRef(null);
  const overlay = useRef(null);
  const [panResponder, setPanResponder] = useState<PanResponderInstance>(null);

  useEffect(() => {
    base.current.width = widthPx;
    base.current.height = heightPx;
    animations.current.width = widthPx;
    animations.current.height = heightPx;
    overlay.current.width = widthPx;
    overlay.current.height = heightPx;
    const { panResponder } = new Game(
      width,
      height,
      base.current,
      animations.current,
      overlay.current
    );
    setPanResponder(panResponder);
  }, []);

  return (
    <View
      style={[styles.container, { width: widthPx, height: heightPx }]}
      {...(panResponder && panResponder.panHandlers)}
    >
      <Canvas width={widthPx} height={heightPx} style={styles.canvas} />
      <Canvas
        width={widthPx}
        height={heightPx}
        style={styles.canvas}
        ref={base}
      />
      <Canvas
        width={widthPx}
        height={heightPx}
        style={styles.canvas}
        ref={animations}
      />
      <Canvas
        width={widthPx}
        height={heightPx}
        style={styles.canvas}
        ref={overlay}
      />
    </View>
  );
};
