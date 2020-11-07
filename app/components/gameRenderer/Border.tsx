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
    map: { borders, seed },
  },
}: RootState) => ({
  borders,
  seed,
});

const Border: React.FC<ComponentProps> = memo(({ borders, cellPx, offset }) => {
  const borderColor = useDynamicValue(Colors.BORDERS_DYNAMIC);

  return (
    <>
      {borders.getBorders().map((border, index) => (
        <Line
          key={index}
          x1={offset.width + cellPx * border.from.x}
          y1={offset.height + cellPx * border.from.y}
          x2={offset.width + cellPx * border.to.x}
          y2={offset.height + cellPx * border.to.y}
          stroke={borderColor}
          strokeWidth={Sizes.BORDER}
          strokeLinecap="round"
        />
      ))}
    </>
  );
}, shouldMapLayoutUpdate);

export default connect(mapStateToProps)(Border);
