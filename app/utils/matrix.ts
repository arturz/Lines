import { MatrixPosition } from "../constants";

type Array2D = any[][];

function replaceMatrixAtPosition(
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

export function replaceMatrix(
  source: Array2D,
  supply: Array2D,
  position: MatrixPosition
) {
  switch (position) {
    case MatrixPosition.TOP_LEFT:
      return replaceMatrixAtPosition(0, 0, source, supply);

    case MatrixPosition.TOP_RIGHT:
      return replaceMatrixAtPosition(
        0,
        source.length - supply.length,
        source,
        supply
      );

    case MatrixPosition.BOTTOM_LEFT:
      return replaceMatrixAtPosition(
        source[0].length - supply[0].length,
        0,
        source,
        supply
      );

    case MatrixPosition.BOTTOM_RIGHT:
      return replaceMatrixAtPosition(
        source[0].length - supply[0].length,
        source.length - supply.length,
        source,
        supply
      );

    case MatrixPosition.CENTER:
      if (
        source.length % 2 !== supply.length % 2 ||
        source[0].length % 2 !== supply[0].length % 2
      )
        throw new Error(`Bad size of arrays`);

      return replaceMatrixAtPosition(
        Math.floor(source[0].length / 2) - 1,
        Math.floor(source.length / 2) - 1,
        source,
        supply
      );

    case MatrixPosition.TOP_CENTER:
      if (source[0].length % 2 !== supply[0].length % 2)
        throw new Error(`Bad size of arrays`);

      return replaceMatrixAtPosition(
        0,
        Math.floor(source.length / 2) - 1,
        source,
        supply
      );

    case MatrixPosition.BOTTOM_CENTER:
      if (source[0].length % 2 !== supply[0].length % 2)
        throw new Error(`Bad size of arrays`);

      return replaceMatrixAtPosition(
        source[0].length - supply[0].length,
        Math.floor(source.length / 2) - 1,
        source,
        supply
      );

    case MatrixPosition.LEFT_CENTER:
      if (source.length % 2 !== supply.length % 2)
        throw new Error(`Bad size of arrays`);

      return replaceMatrixAtPosition(
        Math.floor(source[0].length / 2) - 1,
        0,
        source,
        supply
      );

    case MatrixPosition.RIGHT_CENTER:
      if (source.length % 2 !== supply.length % 2)
        throw new Error(`Bad size of arrays`);

      return replaceMatrixAtPosition(
        Math.floor(source[0].length / 2) - 1,
        source.length - supply.length,
        source,
        supply
      );

    default:
      throw new Error(`replaceMatrix: unknown position (${position})`);
  }
}

export function createMatrix(y: number, x: number, character?: any) {
  const matrix = [];
  for (let i = 0; i < y; i++) {
    const row = [];
    for (let j = 0; j < x; j++) row.push(character);
    matrix.push(row);
  }
  return matrix;
}
