import React from "react";
import { connect } from "react-redux";
import { Line } from "react-native-svg";
import { GameSizes } from "../../types";
import { Colors, Sizes } from "../../styles";
import { RootState } from "../../redux";
import { useDynamicValue } from "react-native-dynamic";
import { Player } from "../../constants";

type ComponentProps = ComponentOwnProps & ComponentStoreProps;
type ComponentOwnProps = GameSizes;
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({
  game: {
    map: { gates },
  },
}: RootState) => ({
  gates,
});

const GatesComponent: React.FC<ComponentProps> = ({
  cellPx,
  offset,
  gates,
}) => {
  const red = useDynamicValue(Colors.RED_DYNAMIC);
  const blue = useDynamicValue(Colors.BLUE_DYNAMIC);

  return (
    <>
      {gates.getGates().map(({ from, to, player }, index) => (
        <Line
          key={index}
          x1={offset.width + from.x * cellPx}
          y1={offset.height + from.y * cellPx}
          x2={offset.width + to.x * cellPx}
          y2={offset.height + to.y * cellPx}
          stroke={player === Player.A ? red : blue}
          strokeWidth={Sizes.GATE}
          strokeLinecap="round"
        />
      ))}
    </>
  );
};

export default connect(mapStateToProps)(GatesComponent);
