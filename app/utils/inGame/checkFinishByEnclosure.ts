import { Pointer } from "../../classes";
import { Direction } from "../../constants";
import canBePlaced from "./canBePlaced";
import { GameMap } from "../../types";

//enclosure happens when player can't go in any direction
export default ({ map }: { map: GameMap }) => {
  const { pointer } = map;
  const { x, y } = pointer.getCoordinates();

  let ways = 0;
  if (canBePlaced(y - 1, x, Direction.SteppingUp, map)) {
    ways++;
  }

  if (canBePlaced(y - 1, x - 1, Direction.CommingDown, map)) {
    ways++;
  }
  if (canBePlaced(y - 1, x - 1, Direction.Right, map)) {
    ways++;
  }

  if (canBePlaced(y, x - 1, Direction.Top, map)) {
    ways++;
  }
  if (canBePlaced(y, x - 1, Direction.SteppingUp, map)) {
    ways++;
  }
  if (canBePlaced(y, x - 1, Direction.Right, map)) {
    ways++;
  }

  if (canBePlaced(y, x, Direction.CommingDown, map)) {
    ways++;
  }
  if (canBePlaced(y, x, Direction.Top, map)) {
    ways++;
  }

  if (ways === 0) return true;

  return false;
};
