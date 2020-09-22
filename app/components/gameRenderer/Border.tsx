import React, { memo } from "react";
import { connect } from "react-redux";
import { Line } from "react-native-svg";
import { GameSizes, MapSeed } from "../../types";
import { Sizes, Colors } from "../../styles";
import { Borders } from "../../classes";
import { shouldMapLayoutUpdate } from "../../utils";

const mapStateToProps = ({
  game: {
    map: { borders, seed },
  },
}) => ({
  borders,
  seed,
});

interface Props extends GameSizes {
  borders: Borders;
  seed: MapSeed;
}

const Border = memo(
  ({ borders, cellPx, offset }: Props) => (
    <>
      {borders.getBorders().map((border, index) => (
        <Line
          key={index}
          x1={offset.width + cellPx * border.from.x}
          y1={offset.height + cellPx * border.from.y}
          x2={offset.width + cellPx * border.to.x}
          y2={offset.height + cellPx * border.to.y}
          stroke={Colors.YELLOW_DARK}
          strokeWidth={Sizes.BORDER}
          strokeLinecap="round"
        />
      ))}
    </>
  ),
  shouldMapLayoutUpdate
);

export default connect(mapStateToProps)(Border);
