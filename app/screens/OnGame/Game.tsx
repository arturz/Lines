import React, { useMemo, useState, useRef } from "react";
import { connect } from "react-redux";
import Svg, { Line } from "react-native-svg";
import {
  DisplayResolution,
  MapSize,
  Offset,
  CellLineProps,
  Point,
} from "../../types";
import InsideLines from "./InsideLines";
import Border from "./Border";
import { GameMap, Pointer } from "../../classes";
import PointerComponent from "./PointerComponent";
import TakenLines from "./TakenLines";
import { PanResponder } from "react-native";
import HoverLine from "./HoverLine";
import canBePlaced from "./utils/canBePlaced";
import GatesComponent from "./GatesComponent";
import getHoverLineProps from "./utils/hoverLine/getHoverLineProps";
import { isEqual } from "lodash";

const mapStateToProps = ({ game: { map, pointer } }) => ({
  map,
  pointer,
});

interface StateProps {
  map: GameMap;
  pointer: Pointer;
}

interface Props extends MapSize, DisplayResolution, StateProps {
  onTakeLine: (CellLineProps) => void;
}

const Game = ({
  width,
  height,
  widthPx,
  heightPx,
  onTakeLine,
  map,
  pointer,
}: Props) => {
  const { cellPx, offset }: { cellPx: number; offset: Offset } = useMemo(() => {
    let cellPx;
    let offset: Offset = {
      height: 0,
      width: 0,
    };
    if (widthPx / (width + 1) < heightPx / (height + 1)) {
      cellPx = widthPx / (width + 1);
      offset.width = (widthPx - width * cellPx) / 2;
      offset.height = (heightPx - height * cellPx) / 2;
    } else {
      cellPx = heightPx / (height + 1);
      offset.width = (widthPx - width * cellPx) / 2;
      offset.height = (heightPx - height * cellPx) / 2;
    }
    return { cellPx, offset };
  }, [width, height, widthPx, heightPx]);

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
      { pointer, cellPx, offset }
    );

    if (isEqual(_hoverLineProps.current, hoverLineProps)) return;

    if (
      canBePlaced(
        hoverLineProps.y,
        hoverLineProps.x,
        hoverLineProps.direction,
        { map, pointer }
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
        x: gestureState.x0,
        y: gestureState.y0,
      });
    },
    onPanResponderMove: (e, gestureState) => {
      showHoverLine({
        x: gestureState.moveX,
        y: gestureState.moveY,
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
      {...panResponder.panHandlers}
    >
      <InsideLines
        width={width}
        height={height}
        cellPx={cellPx}
        offset={offset}
      />
      <TakenLines
        width={width}
        height={height}
        cellPx={cellPx}
        offset={offset}
      />
      <HoverLine
        width={width}
        height={height}
        cellPx={cellPx}
        offset={offset}
        ref={_hoverLineComponent}
      />
      <Border width={width} height={height} cellPx={cellPx} offset={offset} />
      <PointerComponent
        width={width}
        height={height}
        cellPx={cellPx}
        offset={offset}
      />
      <GatesComponent
        width={width}
        height={height}
        cellPx={cellPx}
        offset={offset}
      />
    </Svg>
  );
};

export default connect(mapStateToProps)(Game);
