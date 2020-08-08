//Dimensions.get("window").height includes status bar on Android

import React, { ReactNode, useState } from "react";
import { View, StyleSheet } from "react-native";

interface Props {
  widthPx: number;
  heightPx: number;
}

const styles = StyleSheet.create({
  dimensions: {
    width: "100%",
    height: "100%",
  },
});

export default ({ render }: { render: (Props) => ReactNode }) => {
  const [dimensions, setDimensions] = useState<Props>(null);

  return (
    <View
      style={[StyleSheet.absoluteFill, styles.dimensions]}
      onLayout={({
        nativeEvent: {
          layout: { width, height },
        },
      }) => setDimensions({ widthPx: width, heightPx: height })}
    >
      {dimensions ? render(dimensions) : null}
    </View>
  );
};
