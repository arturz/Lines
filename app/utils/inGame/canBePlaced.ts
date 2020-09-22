import { Direction } from "../../constants";
import { GameMap } from "../../types";

export default (y: number, x: number, direction: Direction, map: GameMap) => {
  const { x: nextX, y: nextY } = map.pointer.getNextCoordinates(
    y,
    x,
    direction
  );

  //out of map
  if (!map.cells[y] || !map.cells[y][x]) return false;

  const { x: oldX, y: oldY } = map.pointer.getCoordinates();

  //player can only jump on wall
  if (
    map.borders.isOnBorder(oldY, oldX) &&
    map.borders.isOnBorder(nextY, nextX) &&
    (oldX === nextX || oldY === nextY)
  )
    return false;

  //can't take line where another line is placed
  if (map.cells[y][x].isLineTaken(direction)) return false;

  return true;
};
