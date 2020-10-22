import { Direction } from "../../constants";
import { GameMap } from "../../types";

//remember that pointer has always one sticking point at least (previous line), except by the start
export default (y: number, x: number, map: GameMap) => {
  const cells = map.cells;

  let points = 0;

  if (cells[y - 1]) {
    //top right from the pointer
    if (cells[y - 1][x - 1]) {
      if (cells[y - 1][x - 1].isLineTaken(Direction.CommingDown)) points++;
      if (cells[y - 1][x - 1].isLineTaken(Direction.Right)) points++;
    }

    //top left from the pointer
    if (cells[y - 1][x]) {
      if (cells[y - 1][x].isLineTaken(Direction.SteppingUp)) points++;
    }
  }

  if (cells[y]) {
    //bottom left from the pointer
    if (cells[y][x - 1]) {
      if (cells[y][x - 1].isLineTaken(Direction.SteppingUp)) points++;
      if (cells[y][x - 1].isLineTaken(Direction.Top)) points++;
      if (cells[y][x - 1].isLineTaken(Direction.Right)) points++;
    }

    //bottom right from the pointer
    if (cells[y][x]) {
      if (cells[y][x].isLineTaken(Direction.CommingDown)) points++;
      if (cells[y][x].isLineTaken(Direction.Top)) points++;
    }
  }

  //checking if pointer is placed on border
  if (map.borders.isOnBorder(y, x)) points++;

  return points;
};
