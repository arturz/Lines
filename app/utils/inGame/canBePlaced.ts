import { Direction } from "../../constants";
import { GameMap, Pointer } from "../../classes";

export default (
  y: number,
  x: number,
  direction: Direction,
  { map, pointer }: { map: GameMap; pointer: Pointer }
) => {
  const { x: oldX, y: oldY } = pointer.getCoordinates();

  const { x: nextX, y: nextY } = pointer.getNextCoordinates(y, x, direction);

  if (
    nextX < 0 ||
    nextY < 0 ||
    (nextX === 0 && oldX === 0) ||
    (nextY === 0 && oldY === 0)
  )
    return false;

  if (
    nextX > map.width ||
    nextY > map.height ||
    (nextX === map.width && oldX === map.width) ||
    (nextY === map.height && oldY === map.height)
  )
    return false;

  //corners
  if (
    (x === 0 && y === 0 && direction === Direction.CommingDown) ||
    (x === 0 && y === map.height - 1 && direction === Direction.SteppingUp) ||
    (x === map.width - 1 && y === 0 && direction === Direction.SteppingUp) ||
    (x === map.width - 1 &&
      y === map.height - 1 &&
      direction === Direction.CommingDown)
  )
    return false;

  if (map.cells[y][x].isLineTaken(direction)) return false;

  return true;
};
