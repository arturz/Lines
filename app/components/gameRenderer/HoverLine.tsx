import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  MutableRefObject,
  useEffect,
} from "react";
import { connect } from "react-redux";
import { CellLineProps, MapCellsSizes } from "../../types";
import { Line } from "react-native-svg";
import { getDrewLineProps } from "../../utils";
import gsap from "gsap";
import { Colors, Sizes } from "../../styles";
import { RootState } from "../../redux";
import { View } from "react-native";
import { useDynamicValue } from "react-native-dynamic";
import { Player } from "../../constants";

//To animate fill and stroke, you might have thought you could just setNativeProps({fill:”somecolorstring”}).
//react-native-svg takes your fill and stroke props and turns them into an array
import extractBrush from "react-native-svg/src/lib/extract/extractBrush";

type ComponentProps = ComponentOwnProps &
  ComponentStoreProps & {
    forwardedRef?: Ref;
  };

type ComponentOwnProps = MapCellsSizes & {
  ref?: Ref;
};
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({
  game: {
    player,
    map: { seed },
  },
}: RootState) => ({
  player,
  seed,
});

export type HoverLineHandles = {
  readonly showHoverLine: (cellLineProps: CellLineProps) => void;
  readonly hideHoverLine: () => void;
  readonly stopHoverLineAnimation: () => void;
};

type Ref =
  | ((instance: HoverLineHandles | null) => void)
  | MutableRefObject<HoverLineHandles | null>
  | null;

const HoverLine: React.FC<ComponentProps> = ({
  cellPx,
  offset,
  player,
  seed,
  forwardedRef,
}) => {
  const _line = useRef<View>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const red = useDynamicValue(Colors.RED_DYNAMIC);
  const blue = useDynamicValue(Colors.BLUE_DYNAMIC);

  const stopHoverLineAnimation = () => {
    if (timeline.current) {
      timeline.current.kill();
      timeline.current = null;
    }
  };

  const showHoverLine = (props: CellLineProps) => {
    stopHoverLineAnimation();

    const stroke = extractBrush(player === Player.A ? red : blue);
    const state = { length: 0 };

    timeline.current = gsap.timeline();
    timeline.current.to(state, {
      length: 1,
      ease: "power3",
      duration: 0.5,
      onUpdate() {
        _line.current?.setNativeProps({
          ...getDrewLineProps(props.y, props.x, props.direction, {
            backwards: Boolean(props.backwards),
            cellPx,
            offset,
            length: state.length,
          }),
          strokeWidth: Sizes.HOVER_LINES,
          stroke,
        });
      },
    });
  };

  const hideHoverLine = () => {
    stopHoverLineAnimation();
    _line.current?.setNativeProps({ strokeWidth: 0 });
  };

  useImperativeHandle(forwardedRef, () => ({
    showHoverLine,
    hideHoverLine,
    stopHoverLineAnimation,
  }));

  //make sure there is no visible hover line in a new game
  useEffect(hideHoverLine, [seed]);

  return (
    <Line
      opacity={0.5}
      ref={_line}
      stroke="transparent"
      strokeLinecap="round"
    />
  );
};

const ConnectedComponent = connect(mapStateToProps)(HoverLine);

const ForwardedConnectedComponent: ForwardRefRenderFunction<
  HoverLineHandles,
  ComponentOwnProps
> = (props, ref) => <ConnectedComponent {...props} forwardedRef={ref} />;

export default forwardRef(ForwardedConnectedComponent);
