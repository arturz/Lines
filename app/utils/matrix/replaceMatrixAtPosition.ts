import { Array2D } from "../../types";

export default function replaceMatrixAtPosition(
  startAtY: number,
  startAtX: number,
  source: Array2D,
  supply: Array2D
) {
  //copy of source
  const matrix = [];
  for (var i = 0; i < source.length; i++) matrix[i] = source[i].slice();

  for (let y = 0; y < supply.length; y++) {
    for (let x = 0; x < supply[0].length; x++) {
      matrix[startAtY + y][startAtX + x] = supply[y][x];
    }
  }

  return matrix;
}
