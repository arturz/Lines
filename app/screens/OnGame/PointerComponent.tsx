import React, { memo, useRef, useEffect, useLayoutEffect } from "react";
import { connect } from "react-redux";
import { GameSizes } from "../../types";
import { Circle } from "react-native-svg";
import { Pointer } from "../../classes";
import { Player } from "../../constants";
import getPlayerColor from "../../utils/getPlayerColor";
import gsap from "gsap";
import { Sizes } from "../../styles";

const mapStateToProps = ({ game: { pointer, player } }) => ({
  pointer,
  player,
});

interface Props extends GameSizes {
  pointer: Pointer;
  player: Player;
}

const PointerComponent = memo(({ pointer, player, cellPx, offset }: Props) => {
  const _circle = useRef(null);

  useLayoutEffect(() => {
    const timeline = gsap.timeline();
    const state = { radius: 0 };
    timeline.to(state, {
      radius: Sizes.POINTER,
      ease: "power3",
      duration: 1,
      onUpdate() {
        _circle.current.setNativeProps({
          r: state.radius,
        });
      },
    });
  }, [pointer]);

  return (
    <Circle
      ref={_circle}
      cx={pointer.getCoordinates().x * cellPx + offset.width}
      cy={pointer.getCoordinates().y * cellPx + offset.height}
      fill={getPlayerColor(player)}
      r={0}
    />
  );
});

export default connect(mapStateToProps)(PointerComponent);
