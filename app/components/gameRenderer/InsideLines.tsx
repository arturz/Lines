import React, { memo } from "react";
import { connect } from "react-redux";
import { Line } from "react-native-svg";
import { GameSizes } from "../../types";
import { Sizes, Colors } from "../../styles";
import { shouldMapLayoutUpdate } from "../../utils";
import { RootState } from "../../redux";
import { useDynamicValue } from "react-native-dynamic";

type ComponentProps = ComponentOwnProps & ComponentStoreProps;
type ComponentOwnProps = GameSizes;
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({
  game: {
    map: { cells, seed },
  },
}: RootState) => ({
  cells,
  seed,
});

const InsideLines: React.FC<ComponentProps> = memo(
  ({ cells, width, height, cellPx, offset }) => {
    const elements = [];

    const insideLinesColor = useDynamicValue(Colors.INSIDE_LINES_DYNAMIC);

    //rows
    for (let y = 0; y < height; y++) {
      let startX = null;
      let endX = null;
      for (let x = 0; x < width; x++) {
        if (startX === null && cells[y][x]) {
          startX = x;
          continue;
        }

        if (startX !== null) {
          if (endX === null && !cells[y][x]) {
            endX = x;
          } else if (x === width - 1) {
            endX = x + 1;
          }

          if (endX !== null) {
            elements.push(
              <Line
                key={`x-${y}-${startX}-${endX}`}
                x1={offset.width + startX * cellPx}
                y1={offset.height + y * cellPx}
                x2={offset.width + endX * cellPx}
                y2={offset.height + y * cellPx}
                stroke={insideLinesColor}
                strokeWidth={Sizes.INSIDE_LINES}
                strokeLinecap="round"
              />
            );

            startX = null;
            endX = null;
          }
        }
      }
    }

    //columns
    for (let x = 0; x < width; x++) {
      let startY = null;
      let endY = null;

      for (let y = 0; y < height; y++) {
        if (startY === null && cells[y][x]) {
          startY = y;
          continue;
        }

        if (startY !== null) {
          if (endY === null && !cells[y][x]) {
            endY = y;
          } else if (y === height - 1) {
            endY = y + 1;
          }

          if (endY !== null) {
            elements.push(
              <Line
                key={`y-${x}-${startY}-${endY}`}
                x1={offset.width + x * cellPx}
                y1={offset.height + startY * cellPx}
                x2={offset.width + x * cellPx}
                y2={offset.height + endY * cellPx}
                stroke={insideLinesColor}
                strokeWidth={Sizes.TAKEN_LINES}
                strokeLinecap="round"
              />
            );

            startY = null;
            endY = null;
          }
        }
      }
    }

    return <>{elements}</>;
  },
  shouldMapLayoutUpdate
);

export default connect(mapStateToProps)(InsideLines);
