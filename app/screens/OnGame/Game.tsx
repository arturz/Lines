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
import { Direction } from "../../constants";
import HoverLine from "./HoverLine";
import canBePlaced from "./utils/canBePlaced";
import GatesComponent from "./GatesComponent";

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

  const [hoverLine, setHoverLine] = useState<CellLineProps>(null);

  //for direct manipulation
  const _hoverLineComponent = useRef(null);

  const showHoverLine = (part: number) => {
    let hoverLineProps;
    switch (part) {
      case 0:
        hoverLineProps = {
          direction: Direction.Top,
          x: pointer.getCoordinates().x,
          y: pointer.getCoordinates().y,
        };
        break;

      case 1:
        hoverLineProps = {
          direction: Direction.SteppingUp,
          x: pointer.getCoordinates().x,
          y: pointer.getCoordinates().y - 1,
        };
        break;

      case 2:
        hoverLineProps = {
          direction: Direction.Right,
          x: pointer.getCoordinates().x - 1,
          y: pointer.getCoordinates().y - 1,
          backwards: true,
        };
        break;

      case 3:
        hoverLineProps = {
          direction: Direction.CommingDown,
          x: pointer.getCoordinates().x - 1,
          y: pointer.getCoordinates().y - 1,
        };
        break;

      case 4:
        hoverLineProps = {
          direction: Direction.Top,
          x: pointer.getCoordinates().x - 1,
          y: pointer.getCoordinates().y,
          backwards: true,
        };
        break;

      case 5:
        hoverLineProps = {
          direction: Direction.SteppingUp,
          x: pointer.getCoordinates().x - 1,
          y: pointer.getCoordinates().y,
          backwards: true,
        };
        break;

      case 6:
        hoverLineProps = {
          direction: Direction.Right,
          x: pointer.getCoordinates().x - 1,
          y: pointer.getCoordinates().y,
        };
        break;

      case 7:
        hoverLineProps = {
          direction: Direction.CommingDown,
          x: pointer.getCoordinates().x,
          y: pointer.getCoordinates().y,
          backwards: true,
        };
        break;

      default:
        throw new Error(`Part around pointer out of range (${part})`);
    }

    if (JSON.stringify(hoverLine) === JSON.stringify(hoverLineProps)) return;

    if (
      canBePlaced(
        hoverLineProps.y,
        hoverLineProps.x,
        hoverLineProps.direction,
        { map, pointer }
      )
    ) {
      setHoverLine(hoverLineProps);
      _hoverLineComponent.current.start(hoverLineProps);
    }
  };

  const getPartAroundPointer = ({ x, y }: Point) => {
    const pointerX = pointer.getCoordinates().x * cellPx + offset.width;
    const pointerY = pointer.getCoordinates().y * cellPx + offset.height;

    let deg = (Math.atan2(y - pointerY, x - pointerX) * 180) / Math.PI;
    if (deg < 0) deg = Math.abs(deg);
    else deg = 360 - deg;

    /*
      From 0 (right) to 7 (right-bottom)
    */
    return Math.floor(((deg + 22.5) / 45) % 8);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (e, gestureState) => {
      showHoverLine(
        getPartAroundPointer({
          x: gestureState.x0,
          y: gestureState.y0,
        })
      );
    },
    onPanResponderMove: (e, gestureState) => {
      showHoverLine(
        getPartAroundPointer({
          x: gestureState.moveX,
          y: gestureState.moveY,
        })
      );
    },
    onPanResponderRelease: (e, gestureState) => {
      if (hoverLine !== null) {
        _hoverLineComponent.current.clear();
        onTakeLine(hoverLine);
        setHoverLine(null);
      }
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
