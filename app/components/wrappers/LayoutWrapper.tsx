// @refresh reset

import React, { ReactNode, useState } from "react";
import { View, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, //fill available space
  },
});

interface RenderProps {
  widthPx: number;
  heightPx: number;
  x: number;
  y: number;
}

export default ({ render }: { render: (RenderProps) => ReactNode }) => {
  const [layoutRectangle, setLayoutRectangle] = useState<RenderProps>(null);

  return (
    <View
      style={styles.container}
      onLayout={({
        nativeEvent: {
          layout: { width, height, x, y },
        },
      }) => setLayoutRectangle({ widthPx: width, heightPx: height, x, y })}
    >
      {layoutRectangle ? render(layoutRectangle) : null}
    </View>
  );
};
