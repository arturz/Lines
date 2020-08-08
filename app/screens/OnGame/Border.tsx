import React, { memo } from "react";
import { GameSizes, Point } from "../../types";
import { Line } from "react-native-svg";
import { Colors } from "../../constants";

export default memo(({ width, height, cellPx, offset }: GameSizes) => {
  //first and last point
  const closurePoint = { x: offset.width, y: offset.height };
  const points: Point[] = [
    { x: width * cellPx + offset.width, y: offset.height },
    { x: width * cellPx + offset.width, y: height * cellPx + offset.height },
    { x: offset.width, y: height * cellPx + offset.height },
    closurePoint,
  ];

  const [elements] = points.reduce(
    ([elements, lastPoint], point, index) => [
      elements.concat(
        <Line
          key={index}
          x1={lastPoint.x}
          y1={lastPoint.y}
          x2={point.x}
          y2={point.y}
          stroke={Colors.yellowDark}
          strokeWidth={6}
          strokeLinecap="round"
        />
      ),
      point,
    ],
    [[], closurePoint]
  );

  return <>{elements}</>;
});
