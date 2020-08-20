import { Direction } from "../../constants";
import { Offset } from "../../types";

interface Props {
  cellPx: number;
  offset: Offset;

  /*
    Those props are used to animate line in right direction. 
    Ex. A -> B instead of B -> A

    Without animation (length = 1) those props are doing nothing.
  */
  backwards?: boolean;
  length?: number;
}

export default (
  y: number,
  x: number,
  direction: Direction,
  { cellPx, offset, backwards = false, length = 1 }: Props
) => {
  let props = null;

  switch (direction) {
    //from top left to top right
    case Direction.Top:
      if (backwards) {
        props = {
          x1: (x + 1) * cellPx + offset.width,
          y1: y * cellPx + offset.height,
          x2: (x + 1 - length) * cellPx + offset.width,
          y2: y * cellPx + offset.height,
        };
      } else {
        props = {
          x1: x * cellPx + offset.width,
          y1: y * cellPx + offset.height,
          x2: (x + length) * cellPx + offset.width,
          y2: y * cellPx + offset.height,
        };
      }
      break;

    //from top right to bottom right
    case Direction.Right:
      if (backwards) {
        props = {
          x1: (x + 1) * cellPx + offset.width,
          y1: (y + 1) * cellPx + offset.height,
          x2: (x + 1) * cellPx + offset.width,
          y2: (y + 1 - length) * cellPx + offset.height,
        };
      } else {
        props = {
          x1: (x + 1) * cellPx + offset.width,
          y1: y * cellPx + offset.height,
          x2: (x + 1) * cellPx + offset.width,
          y2: (y + length) * cellPx + offset.height,
        };
      }
      break;

    case Direction.CommingDown:
      if (backwards) {
        props = {
          x1: x * cellPx + offset.width,
          y1: y * cellPx + offset.height,
          x2: (x + length) * cellPx + offset.width,
          y2: (y + length) * cellPx + offset.height,
        };
      } else {
        props = {
          x1: (x + 1) * cellPx + offset.width,
          y1: (y + 1) * cellPx + offset.height,
          x2: (x + 1 - length) * cellPx + offset.width,
          y2: (y + 1 - length) * cellPx + offset.height,
        };
      }
      break;

    case Direction.SteppingUp:
      if (backwards) {
        props = {
          x1: (x + 1) * cellPx + offset.width,
          y1: y * cellPx + offset.height,
          x2: (x + 1 - length) * cellPx + offset.width,
          y2: (y + length) * cellPx + offset.height,
        };
      } else {
        props = {
          x1: x * cellPx + offset.width,
          y1: (y + 1) * cellPx + offset.height,
          x2: (x + length) * cellPx + offset.width,
          y2: (y + 1 - length) * cellPx + offset.height,
        };
      }
      break;

    default:
      throw new Error(`Undefined direction`);
  }

  return props;
};
