import React, {
  memo,
  forwardRef,
  useRef,
  useImperativeHandle,
  RefForwardingComponent,
} from "react";
import { connect } from "react-redux";
import { GameSizes, CellLineProps } from "../../types";
import { Line } from "react-native-svg";
import { getPlayerColor, getDrewLineProps } from "../../utils";
import gsap from "gsap";
import { Sizes } from "../../styles";
import { RootState } from "../../redux";

type ComponentProps = ComponentOwnProps & ComponentStoreProps;
type ComponentOwnProps = GameSizes & {
  ref?: React.RefObject<HoverLineHandles>;
};
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({ game: { player } }: RootState) => ({
  player,
});

export type HoverLineHandles = {
  start: (CellLineProps) => any;
  clear: () => void;
};

const HoverLine: React.FC<ComponentProps> = memo(
  ({ cellPx, offset, player, ref }) => {
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
            strokeWidth: Sizes.HOVER_LINES,
          });
        },
      });
    };

    const clear = () => {
      if (timeline) timeline.kill();
      _line.current.setNativeProps({
        strokeWidth: 0,
      });
    };

    useImperativeHandle(ref, () => ({
      get start() {
        return start;
      },
      get clear() {
        return clear;
      },
    }));

    return (
      <Line ref={_line} stroke={getPlayerColor(player)} strokeLinecap="round" />
    );
  }
);

const ConnectedComponent: RefForwardingComponent<
  HoverLineHandles,
  ComponentOwnProps
> = connect(mapStateToProps)(HoverLine);

export default forwardRef(ConnectedComponent);
