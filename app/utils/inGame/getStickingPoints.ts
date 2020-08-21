import { GameMap } from "../../classes";
import { Direction } from "../../constants";

//remember that pointer has always one sticking point at least (previous line), except by the start
export default (y: number, x: number, { map }: { map: GameMap }) => {
  const cells = map.cells;

  let points = 0;

  //top right from the pointer
  if (x - 1 >= 0 && y - 1 >= 0) {
    if (cells[y - 1][x - 1].isLineTaken(Direction.CommingDown)) points++;
    if (cells[y - 1][x - 1].isLineTaken(Direction.Right)) points++;
  }

  //top left from the pointer
  if (y - 1 >= 0 && x !== map.width) {
    if (cells[y - 1][x].isLineTaken(Direction.SteppingUp)) points++;
  }

  //bottom left from the pointer
  if (x - 1 >= 0 && y !== map.height) {
    if (cells[y][x - 1].isLineTaken(Direction.SteppingUp)) points++;
    if (cells[y][x - 1].isLineTaken(Direction.Top)) points++;
    if (cells[y][x - 1].isLineTaken(Direction.Right)) points++;
  }

  //bottom right from the pointer
  if (x !== map.width && y !== map.height) {
    if (cells[y][x].isLineTaken(Direction.CommingDown)) points++;
    if (cells[y][x].isLineTaken(Direction.Top)) points++;
  }

  //checking if pointer is placed on border
  if (x === 0 || y === 0 || x === map.width || y === map.height) points++;

  return points;
};
