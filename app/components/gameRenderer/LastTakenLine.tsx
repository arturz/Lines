import React, { useRef, useLayoutEffect } from "react";
import { connect } from "react-redux";
import { MapCellsSizes } from "../../types";
import { Line } from "react-native-svg";
import { getDrewLineProps } from "../../utils";
import gsap from "gsap";
import { Colors, Sizes } from "../../styles";
import { RootState } from "../../redux";
import { View } from "react-native";
import { useDynamicValue } from "react-native-dynamic";
import { Player } from "../../constants";

type ComponentProps = ComponentOwnProps & ComponentStoreProps;
type ComponentOwnProps = MapCellsSizes;
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({
  game: {
    map: { lastTakenLine },
  },
}: RootState) => ({
  lastTakenLine,
});

const LastTakenLine: React.FC<ComponentProps> = ({
  cellPx,
  offset,
  lastTakenLine,
}) => {
  const _line = useRef<View>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (timeline.current) {
      timeline.current.kill();
      timeline.current = null;
    }

    _line.current?.setNativeProps({ strokeWidth: 0 });

    if (!lastTakenLine) return;

    const state = { length: 0 };

    timeline.current = gsap.timeline();
    timeline.current.to(state, {
      length: 1,
      ease: "power3",
      duration: 0.5,
      onUpdate() {
        _line.current?.setNativeProps({
          ...getDrewLineProps(
            lastTakenLine.y,
            lastTakenLine.x,
            lastTakenLine.direction,
            {
              backwards: Boolean(lastTakenLine.backwards),
              cellPx,
              offset,
              length: state.length,
            }
          ),
          strokeWidth: Sizes.HOVER_LINES,
        });
      },
    });
  }, [lastTakenLine]);

  return (
    <Line
      ref={_line}
      stroke={
        lastTakenLine?.player === Player.A
          ? useDynamicValue(Colors.RED_DYNAMIC)
          : useDynamicValue(Colors.BLUE_DYNAMIC)
      }
      strokeLinecap="round"
    />
  );
};

export default connect(mapStateToProps)(LastTakenLine);
