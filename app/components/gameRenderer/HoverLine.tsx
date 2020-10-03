import React, {
  memo,
  forwardRef,
  useRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
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
  forwardedRef?:
    | React.MutableRefObject<HoverLineHandles>
    | ((instance: HoverLineHandles) => void);
};
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({ game: { player } }: RootState) => ({
  player,
});

export type HoverLineHandles = {
  start: (CellLineProps) => any;
  clear: () => void;
};

const HoverLine: React.FC<ComponentProps> = ({
  cellPx,
  offset,
  player,
  forwardedRef,
}) => {
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

  useImperativeHandle(forwardedRef, () => ({
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
};

const ConnectedComponent = connect(mapStateToProps)(HoverLine);

const ForwardedConnectedComponent: ForwardRefRenderFunction<
  HoverLineHandles,
  ComponentOwnProps
> = (props, ref) => <ConnectedComponent {...props} forwardedRef={ref} />;

export default forwardRef(ForwardedConnectedComponent);
