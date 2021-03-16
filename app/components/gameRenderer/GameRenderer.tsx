import React, { useRef } from "react";
import { connect } from "react-redux";
import Svg from "react-native-svg";
import { DisplayResolution, CellLineProps, Point } from "../../types";
import InsideLines from "./InsideLines";
import Border from "./Border";
import PointerComponent from "./PointerComponent";
import TakenLines from "./TakenLines";
import { PanResponder } from "react-native";
import HoverLine, { HoverLineHandles } from "./HoverLine";
import GatesComponent from "./GatesComponent";
import { getHoverLineProps, canBePlaced } from "../../utils";
import { isEqual } from "lodash";
import { getOffsetAndCellPx, POINTER_IS_TOO_FAR } from "../../utils/inGame";
import { GameStatus } from "../../constants";
import { RootState } from "../../redux";
import { HoverLineProps } from "../../utils/inGame/hoverLine/getHoverLineProps";
import LastTakenLine from "./LastTakenLine";
import PowerUps from "./PowerUps";

type ComponentProps = ComponentOwnProps & ComponentStoreProps;
type ComponentOwnProps = DisplayResolution &
  Point & {
    allowTakingLine: boolean;
    onTakeLine: (cellLineProps: CellLineProps) => void;
  };
type ComponentStoreProps = ReturnType<typeof mapStateToProps>;

const mapStateToProps = ({ game: { map, status } }: RootState) => ({
  status,
  map,
});

const Game: React.FC<ComponentProps> = ({
  /* resolution of component */
  widthPx,
  heightPx,
  /* position of component relative to screen (for properly handling touch events) */
  x,
  y,
  status,
  map,
  allowTakingLine,
  onTakeLine,
}) => {
  const { cellPx, offset } = getOffsetAndCellPx({
    width: map.width,
    height: map.height,
    widthPx,
    heightPx,
  });

  /*
    I didn't use useState, so we don't need to rerender whole component only when hover line changes.
  */
  const _hoverLineProps = useRef<Exclude<
    HoverLineProps,
    typeof POINTER_IS_TOO_FAR
  > | null>(null);

  /*
    For direct manipulation.
  */
  const _hoverLineComponent = useRef<HoverLineHandles | null>(null);

  const showHoverLine = ({ x, y }: Point) => {
    const hoverLineProps = getHoverLineProps(
      { x, y },
      { pointer: map.pointer, cellPx, offset }
    );

    if (hoverLineProps === POINTER_IS_TOO_FAR) {
      return POINTER_IS_TOO_FAR;
    }

    if (isEqual(_hoverLineProps.current, hoverLineProps)) return;

    if (
      allowTakingLine &&
      canBePlaced(
        hoverLineProps.y,
        hoverLineProps.x,
        hoverLineProps.direction,
        map
      )
    ) {
      _hoverLineProps.current = hoverLineProps;
      _hoverLineComponent.current?.showHoverLine(hoverLineProps);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gestureState) => {
      showHoverLine({
        x: gestureState.x0 - x,
        y: gestureState.y0 - y,
      });
    },
    onPanResponderMove: (e, gestureState) => {
      if (
        showHoverLine({
          x: gestureState.moveX - x,
          y: gestureState.moveY - y,
        }) === POINTER_IS_TOO_FAR &&
        _hoverLineProps.current !== null
      ) {
        _hoverLineProps.current = null;
        _hoverLineComponent.current?.hideHoverLine();
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      if (_hoverLineProps.current === null) return;

      onTakeLine(_hoverLineProps.current);
      _hoverLineComponent.current?.stopHoverLineAnimation();
      _hoverLineProps.current = null;
    },
  });

  return (
    <Svg
      height={heightPx}
      width={widthPx}
      viewBox={`0 0 ${widthPx} ${heightPx}`}
      {...(status === GameStatus.Playing && panResponder.panHandlers)}
    >
      {/*
        It would work if it wasn't so slow.
      <Defs>
          <LinearGradient id="Gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ffffff00" stopOpacity="0" />
            <Stop offset="1" stopColor="#ffffff00" stopOpacity="1" />
          </LinearGradient>
          <Mask id="Mask" x="0" y="0" width={widthPx} height={heightPx}>
            <Rect
              x="0"
              y="0"
              width={widthPx}
              height={heightPx}
              fill="url(#Gradient)"
            />
          </Mask>
        </Defs>
        <G mask="url(#Mask)">*/}
      <InsideLines
        width={map.width}
        height={map.height}
        cellPx={cellPx}
        offset={offset}
      />
      <HoverLine cellPx={cellPx} offset={offset} ref={_hoverLineComponent} />
      <TakenLines
        width={map.width}
        height={map.height}
        cellPx={cellPx}
        offset={offset}
      />
      <LastTakenLine cellPx={cellPx} offset={offset} />
      <Border cellPx={cellPx} offset={offset} />
      <PointerComponent cellPx={cellPx} offset={offset} />
      <GatesComponent cellPx={cellPx} offset={offset} />
    </Svg>
  );
};

export default connect(mapStateToProps)(Game);
