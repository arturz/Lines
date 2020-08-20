import { Pointer, GameMap } from "../../classes";
import { Direction } from "../../constants";
import canBePlaced from "./canBePlaced";

export default ({ map, pointer }: { map: GameMap; pointer: Pointer }) => {
  const { x, y } = pointer.getCoordinates();

  let ways = 0;
  if (canBePlaced(y - 1, x, Direction.SteppingUp, { map, pointer })) {
    ways++;
  }

  if (canBePlaced(y - 1, x - 1, Direction.CommingDown, { map, pointer })) {
    ways++;
  }
  if (canBePlaced(y - 1, x - 1, Direction.Right, { map, pointer })) {
    ways++;
  }

  if (canBePlaced(y, x - 1, Direction.Top, { map, pointer })) {
    ways++;
  }
  if (canBePlaced(y, x - 1, Direction.SteppingUp, { map, pointer })) {
    ways++;
  }
  if (canBePlaced(y, x - 1, Direction.Right, { map, pointer })) {
    ways++;
  }

  if (canBePlaced(y, x, Direction.CommingDown, { map, pointer })) {
    ways++;
  }
  if (canBePlaced(y, x, Direction.Top, { map, pointer })) {
    ways++;
  }

  if (ways === 0) return true;

  return false;
};
