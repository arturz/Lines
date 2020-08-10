import React, { memo } from "react";
import { connect } from "react-redux";
import { Line } from "react-native-svg";
import { GameSizes } from "../../types";
import { GameMap } from "../../classes/GameMap";
import getDrewLineProps from "./utils/getDrewLineProps";
import getPlayerColor from "../../utils/getPlayerColor";
import { Sizes } from "../../styles";

const mapStateToProps = ({ game: { map } }) => ({
  map,
});

interface Props extends GameSizes {
  map: GameMap;
}

const TakenLines = memo(({ map, width, height, cellPx, offset }: Props) => {
  const elements = [];

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      for (const cellLine of map.cells[i][j].getTakenLines()) {
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
