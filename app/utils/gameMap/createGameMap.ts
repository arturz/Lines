import { GameMap } from "../../types";
import { Player } from "../../constants";
import { Gate, Gates, Pointer, Cell } from "../../classes";
import getBorders from "./getBorders";

export default (width: number, height: number): GameMap => {
  /*const cells = [];

  for (let i = 0; i < height; i++) {
    cells.push([]);
    for (let j = 0; j < width; j++) {
      cells[i].push(new Cell());
    }
  }

  cells[0][0] = null;
  cells[1][0] = null;
  cells[0][1] = null;
  cells[1][1] = null;

  cells[2][2] = null;
  cells[2][3] = null;
  cells[3][2] = null;
  cells[3][3] = null;

  const gates = [
    new Gate({ x: width / 2 - 1, y: 0 }, { x: width / 2 + 1, y: 0 }, Player.A),
    new Gate(
      { x: width / 2 - 1, y: height },
      { x: width / 2 + 1, y: height },
      Player.B
    ),
  ];

  const pointer = new Pointer(width / 2, height / 2);*/

  const data = `
    CCCCCCXXCCCCCC
    CCCCCCCCCCCCCC
    CCCCCCCCCCCXCC
    CCCCCCCCCCCCCC
    CCCCCCXXCCCCCC
    CCCCCCXXCCCCCC
    CCCCCCXXCCCCCC
    CCCCCCXXCCCCCC
    CCCCCCXXCCCCCC
    XXXXXXXXCCCCXX
    XXXXXXXXCCCCXX
    CCCCCCXXCCCCCC
    CCCCCCXXCCCCCC
    CCCCCCXXCCCCCC
    CCCCCCXXCCCCCC
    CCCCCCXXCCCCCC
    CCCCCCCCCCCCCC
    CCCCCCCCCCCXCC
    CCCCCCCCCCCCCC
    CCCCCCXXCCCCCC
  `;

  const cells = [];
  const gates = [];
  const pointer = new Pointer(11, 7);

  data
    .split(/(\s+)/)
    .filter((e) => e.trim().length > 0)
    .forEach((row, y) => {
      cells.push([]);

      for (let x = 0; x < row.length; x++) {
        switch (row[x]) {
          case "C":
            cells[cells.length - 1].push(new Cell());
            break;

          case "X":
            cells[cells.length - 1].push(null);
            break;
        }
      }
    });

  const borders = getBorders(cells);

  height = cells.length;
  width = cells[0].length;

  return {
    cells,
    gates: new Gates(gates),
    borders,
    pointer,
    width,
    height,
    seed: Math.random().toString(),
  };
};
