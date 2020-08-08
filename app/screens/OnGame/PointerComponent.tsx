import React, { memo } from "react";
import { connect } from "react-redux";
import { GameSizes } from "../../types";
import { Circle } from "react-native-svg";
import { Pointer } from "../../classes";
import { Colors, Player } from "../../constants";
import getPlayerColor from "../../utils/getPlayerColor";

const mapStateToProps = ({ game: { pointer, player } }) => ({
  pointer,
  player,
});

interface Props extends GameSizes {
  pointer: Pointer;
  player: Player;
}

const PointerComponent = memo(({ pointer, player, cellPx, offset }: Props) => {
  return (
    <Circle
      cx={pointer.getCoordinates().x * cellPx + offset.width}
      cy={pointer.getCoordinates().y * cellPx + offset.height}
      r="6"
      fill={getPlayerColor(player)}
    />
  );
});

export default connect(mapStateToProps)(PointerComponent);
