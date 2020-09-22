import { Cells } from "../../types";
import { Border, Borders } from "../../classes";

export default (cells: Cells) => {
  const borders: Border[] = [];

  for (let y = 0; y < cells.length; y++) {
    for (let x = 0; x < cells[y].length; x++) {
      const cell = cells[y][x];

      //cell may be empty, we need to wrap non-empty cells with borders
      if (cell) {
        //above
        if (!cells[y - 1] || !cells[y - 1][x]) {
          borders.push(new Border({ y: y, x }, { y, x: x + 1 }));
        }

        //below
        if (!cells[y + 1] || !cells[y + 1][x]) {
          borders.push(new Border({ y: y + 1, x }, { y: y + 1, x: x + 1 }));
        }

        //left from cell
        if (!cells[y][x - 1]) {
          borders.push(new Border({ y, x }, { y: y + 1, x }));
        }

        //right from cell
        if (!cells[y][x + 1]) {
          borders.push(new Border({ y, x: x + 1 }, { y: y + 1, x: x + 1 }));
        }
      }
    }
  }

  return new Borders(borders);
};
