import React, { useRef } from "react";
import { connect } from "react-redux";
import Svg from "react-native-svg";
import { DisplayResolution, CellLineProps, Point, GameMap } from "../../types";
import InsideLines from "./InsideLines";
import Border from "./Border";
import PointerComponent from "./PointerComponent";
import TakenLines from "./TakenLines";
import { PanResponder } from "react-native";
import HoverLine from "./HoverLine";
import GatesComponent from "./GatesComponent";
import { getHoverLineProps, canBePlaced } from "../../utils";
import { isEqual } from "lodash";
import { getOffsetAndCellPx } from "../../utils/inGame";
import { GameStatus } from "../../constants";

const mapStateToProps = ({ game: { map, status } }) => ({
  status,
  map,
});

interface StateProps {
  status: GameStatus;
  map: GameMap;
}

interface Props extends DisplayResolution, StateProps, Point {
  allowTakingLine: boolean;
  onTakeLine: (CellLineProps) => void;
}

const Game = ({
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
}: Props) => {
  const { cellPx, offset } = getOffsetAndCellPx({
    width: map.width,
    height: map.height,
    widthPx,
    heightPx,
  });

  /*
    I didn't use useState, so we don't need to rerender whole component only when hover line changes.
  */
  const _hoverLineProps = useRef(null);

  /*
    For direct manipulation.
  */
  const _hoverLineComponent = useRef(null);

  const showHoverLine = ({ x, y }: Point) => {
    const hoverLineProps = getHoverLineProps(
      { x, y },
      { pointer: map.pointer, cellPx, offset }
    );

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
      _hoverLineComponent.current.start(hoverLineProps);
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
      showHoverLine({
        x: gestureState.moveX - x,
        y: gestureState.moveY - y,
      });
    },
    onPanResponderRelease: (e, gestureState) => {
      if (_hoverLineProps.current === null) return;

      onTakeLine(_hoverLineProps.current);
      _hoverLineProps.current = null;
      _hoverLineComponent.current.clear();
    },
  });

  return (
    <Svg
      height={heightPx}
      width={widthPx}
      viewBox={`0 0 ${widthPx} ${heightPx}`}
      {...(status === GameStatus.Playing && panResponder.panHandlers)}
    >
      <InsideLines
        width={map.width}
        height={map.height}
        cellPx={cellPx}
        offset={offset}
      />
      <TakenLines
        width={map.width}
        height={map.height}
        cellPx={cellPx}
        offset={offset}
      />
      <HoverLine
        width={map.width}
        height={map.height}
        cellPx={cellPx}
        offset={offset}
        ref={_hoverLineComponent}
      />
      <Border
        width={map.width}
        height={map.height}
        cellPx={cellPx}
        offset={offset}
      />
      <PointerComponent
        width={map.width}
        height={map.height}
        cellPx={cellPx}
        offset={offset}
      />
      <GatesComponent
        width={map.width}
        height={map.height}
        cellPx={cellPx}
        offset={offset}
      />
    </Svg>
  );
};

export default connect(mapStateToProps)(Game);
