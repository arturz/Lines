import React, { memo, forwardRef, useRef, MutableRefObject } from "react";
import { Animated } from "react-native";
import { connect } from "react-redux";
import { GameSizes, CellLineProps } from "../../types";
import { Line } from "react-native-svg";
import getDrewLineProps from "./utils/getDrewLineProps";
import getPlayerColor from "../../utils/getPlayerColor";
import { Player } from "../../constants";
import gsap from "gsap";
import AnimatedLine from "../../components/AnimatedLine";

const mapStateToProps = ({ game: { player } }) => ({
  player,
});

interface Props extends GameSizes {
  player: Player;
  forwardedRef: MutableRefObject<any>;
}

const HoverLine = memo(({ cellPx, offset, player, forwardedRef }: Props) => {
  const _line = useRef(null);
  let timeline: gsap.core.Timeline;

  const start = (props: CellLineProps) => {
    if (timeline) {
      timeline.kill();
    }

    timeline = gsap.timeline();
    const state = { length: 0 };
    timeline.to(state, {
      length: 1,
      ease: "power3",
      duration: 0.5,
      onUpdate() {
        _line.current.setNativeProps({
          ...getDrewLineProps(props.y, props.x, props.direction, {
            backwards: Boolean(props.backwards),
            cellPx,
            offset,
            length: state.length,
          }),
          strokeWidth: 4,
        });
      },
    });
  };

  const clear = () => {
    timeline.kill();
    _line.current.setNativeProps({
      strokeWidth: 0,
    });
  };

  if (typeof forwardedRef !== "function")
    forwardedRef.current = {
      start,
      clear,
    };

  return (
    <AnimatedLine
      ref={_line}
      stroke={getPlayerColor(player)}
      strokeLinecap="round"
    />
  );
});

const ConnectedComponent = connect(mapStateToProps)(HoverLine);

export default forwardRef((props, forwardedRef) => (
  <ConnectedComponent {...props} forwardedRef={forwardedRef} />
));
