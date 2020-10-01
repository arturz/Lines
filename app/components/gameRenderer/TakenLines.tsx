import React, { memo } from "react";
import { connect } from "react-redux";
import { Line } from "react-native-svg";
import { GameSizes } from "../../types";
import { getDrewLineProps, getPlayerColor } from "../../utils";
import { Sizes } from "../../styles";
import { RootState } from "../../redux";

type ComponentProps = ComponentOwnProps & ComponentStoreProps;
type ComponentOwnProps = GameSizes;
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({
  game: {
    map: { cells },
  },
}: RootState) => ({
  cells,
});

const TakenLines: React.FC<ComponentProps> = memo(
  ({ cells, width, height, cellPx, offset }) => {
    const elements = [];

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (!cells[i][j]) continue;

        for (const cellLine of cells[i][j].getTakenLines()) {
          elements.push(
            <Line
              key={`${i}${j}${cellLine.getDirection()}`}
              {...getDrewLineProps(i, j, cellLine.getDirection(), {
                cellPx,
                offset,
              })}
              stroke={getPlayerColor(cellLine.getPlayer())}
              strokeWidth={Sizes.TAKEN_LINES}
              strokeLinecap="round"
            />
          );
        }
      }
    }

    return <>{elements}</>;
  }
);

export default connect(mapStateToProps)(TakenLines);
