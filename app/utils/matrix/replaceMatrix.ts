import { Array2D } from "../../types";
import { MatrixPosition } from "../../constants";
import replaceMatrixAtPosition from "./replaceMatrixAtPosition";

export default function replaceMatrix(
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
        source[0].length - supply[0].length,
        source,
        supply
      );

    case MatrixPosition.BOTTOM_LEFT:
      return replaceMatrixAtPosition(
        source.length - supply.length,
        0,
        source,
        supply
      );

    case MatrixPosition.BOTTOM_RIGHT:
      return replaceMatrixAtPosition(
        source.length - supply.length,
        source[0].length - supply[0].length,
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
        Math.floor(source.length / 2) - Math.floor(supply.length / 2),
        Math.floor(source[0].length / 2) - Math.floor(supply[0].length / 2),
        source,
        supply
      );

    case MatrixPosition.TOP_CENTER:
      if (source[0].length % 2 !== supply[0].length % 2)
        throw new Error(`Bad size of arrays`);

      return replaceMatrixAtPosition(
        0,
        Math.floor(source[0].length / 2) - Math.floor(supply[0].length / 2),
        source,
        supply
      );

    case MatrixPosition.BOTTOM_CENTER:
      if (source[0].length % 2 !== supply[0].length % 2)
        throw new Error(`Bad size of arrays`);

      return replaceMatrixAtPosition(
        source.length - supply.length,
        Math.floor(source[0].length / 2) - Math.floor(supply[0].length / 2),
        source,
        supply
      );

    case MatrixPosition.LEFT_CENTER:
      if (source.length % 2 !== supply.length % 2)
        throw new Error(`Bad size of arrays`);

      return replaceMatrixAtPosition(
        Math.floor(source.length / 2) - Math.floor(supply.length / 2),
        0,
        source,
        supply
      );

    case MatrixPosition.RIGHT_CENTER:
      if (source.length % 2 !== supply.length % 2)
        throw new Error(`Bad size of arrays`);

      return replaceMatrixAtPosition(
        Math.floor(source.length / 2) - Math.floor(supply.length / 2),
        source[0].length - supply[0].length,
        source,
        supply
      );

    default:
      throw new Error(`replaceMatrix: unknown position (${position})`);
  }
}
