import getEighthAroundPointer, {
  EightAroundPointerProps,
} from "./getEighthAroundPointer";
import { Point } from "../../../types";
import { Direction } from "../../../constants";

export default (
  { x, y }: Point,
  { pointer, cellPx, offset }: EightAroundPointerProps
) => {
  const eighth = getEighthAroundPointer({ x, y }, { pointer, cellPx, offset });

  switch (eighth) {
    case 0:
      return {
        direction: Direction.Top,
        x: pointer.getCoordinates().x,
        y: pointer.getCoordinates().y,
      };

    case 1:
      return {
        direction: Direction.SteppingUp,
        x: pointer.getCoordinates().x,
        y: pointer.getCoordinates().y - 1,
      };

    case 2:
      return {
        direction: Direction.Right,
        x: pointer.getCoordinates().x - 1,
        y: pointer.getCoordinates().y - 1,
        backwards: true,
      };

    case 3:
      return {
        direction: Direction.CommingDown,
        x: pointer.getCoordinates().x - 1,
        y: pointer.getCoordinates().y - 1,
      };

    case 4:
      return {
        direction: Direction.Top,
        x: pointer.getCoordinates().x - 1,
        y: pointer.getCoordinates().y,
        backwards: true,
      };

    case 5:
      return {
        direction: Direction.SteppingUp,
        x: pointer.getCoordinates().x - 1,
        y: pointer.getCoordinates().y,
        backwards: true,
      };

    case 6:
      return {
        direction: Direction.Right,
        x: pointer.getCoordinates().x - 1,
        y: pointer.getCoordinates().y,
      };

    case 7:
      return {
        direction: Direction.CommingDown,
        x: pointer.getCoordinates().x,
        y: pointer.getCoordinates().y,
        backwards: true,
      };

    default:
      throw new Error(`Eighth around pointer out of range (${eighth})`);
  }
};
