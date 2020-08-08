import React from "react";
import { connect } from "react-redux";
import { Line } from "react-native-svg";
import { GameSizes } from "../../types";
import { Gates } from "../../classes/Gates";
import { getPlayerColor } from "../../utils";

const mapStateToProps = ({ game: { gates } }) => ({
  gates,
});

interface Props extends GameSizes {
  gates: Gates;
}

const GatesComponent = ({ cellPx, offset, gates }: Props) => (
  <>
    {gates.getGates().map(({ from, to, player }, index) => (
      <Line
        key={index}
        x1={offset.width + from.x * cellPx}
        y1={offset.height + from.y * cellPx}
        x2={offset.width + to.x * cellPx}
        y2={offset.height + to.y * cellPx}
        stroke={getPlayerColor(player)}
        strokeWidth={10}
        strokeLinecap="round"
      />
    ))}
  </>
);

export default connect(mapStateToProps)(GatesComponent);
