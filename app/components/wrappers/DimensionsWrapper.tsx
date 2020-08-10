//Dimensions.get("window").height includes status bar on Android

import React, { ReactNode, useState } from "react";
import { View, StyleSheet } from "react-native";

interface Props {
  widthPx: number;
  heightPx: number;
}

export default ({ render }: { render: (Props) => ReactNode }) => {
  const [dimensions, setDimensions] = useState<Props>(null);

  return (
    <View
      style={StyleSheet.absoluteFill}
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
