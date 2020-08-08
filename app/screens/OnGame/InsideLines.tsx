import React, { memo } from "react";
import { GameSizes } from "../../types";
import { Line } from "react-native-svg";
import { Colors } from "../../constants";

export default memo(({ width, height, cellPx, offset }: GameSizes) => {
  const elements: JSX.Element[] = [];

  for (let y = 1; y < height; y++) {
    elements.push(
      <Line
        key={`y${y}`}
        x1={offset.width}
        y1={offset.height + y * cellPx}
        x2={offset.width + width * cellPx}
        y2={offset.height + y * cellPx}
        stroke={Colors.yellow}
        strokeWidth={4}
        strokeLinecap="round"
      />
    );
  }

  for (let x = 1; x < width; x++) {
    elements.push(
      <Line
        key={`x${x}`}
        x1={offset.width + x * cellPx}
        y1={offset.height}
        x2={offset.width + x * cellPx}
        y2={offset.height + height * cellPx}
        stroke={Colors.yellow}
        strokeWidth={4}
        strokeLinecap="round"
      />
    );
  }

  return <>{elements}</>;
});
