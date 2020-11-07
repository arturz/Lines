import React, { memo } from "react";
import { connect } from "react-redux";
import { Line } from "react-native-svg";
import { GameSizes } from "../../types";
import { getDrewLineProps } from "../../utils";
import { Colors, Sizes } from "../../styles";
import { RootState } from "../../redux";
import { useDynamicValue } from "react-native-dynamic";
import { Player } from "../../constants";

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

    const red = useDynamicValue(Colors.RED_DYNAMIC);
    const blue = useDynamicValue(Colors.BLUE_DYNAMIC);

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
              stroke={cellLine.getPlayer() === Player.A ? red : blue}
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
