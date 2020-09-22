import React, { memo } from "react";
import { connect } from "react-redux";
import { Line } from "react-native-svg";
import { GameSizes, GameMap, Cells } from "../../types";
import { getDrewLineProps, getPlayerColor } from "../../utils";
import { Sizes } from "../../styles";

const mapStateToProps = ({
  game: {
    map: { cells },
  },
}) => ({
  cells,
});

interface Props extends GameSizes {
  cells: Cells;
}

const TakenLines = memo(({ cells, width, height, cellPx, offset }: Props) => {
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
});

export default connect(mapStateToProps)(TakenLines);
