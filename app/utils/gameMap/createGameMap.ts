import {
  GameMap,
  MapSeed,
  MapSeedSubstraction,
  MapSeedSubstractionRelative,
} from "../../types";
import { Player } from "../../constants";
import { Gate, Gates, Pointer, Cell } from "../../classes";
import getBorders from "./getBorders";
import { createMatrix, replaceMatrix } from "../matrix";

function isRelativeSubstraction(
  substraction: MapSeedSubstraction
): substraction is MapSeedSubstractionRelative {
  return (substraction as MapSeedSubstractionRelative).position !== undefined;
}

export default (seed): GameMap => {
  const { width, height } = seed;
  let cells = createMatrix(width, height, () => new Cell());

  const pointer = new Pointer(seed.pointer.x, seed.pointer.y);
  const gates = new Gates([
    ...seed.gates.A.map(({ from, to }) => new Gate(from, to, Player.A)),
    ...seed.gates.B.map(({ from, to }) => new Gate(from, to, Player.B)),
  ]);

  if (seed.substractions)
    seed.substractions.forEach((substraction) => {
      if (isRelativeSubstraction(substraction)) {
        cells = replaceMatrix(
          cells,
          createMatrix(substraction.width, substraction.height, null),
          substraction.position
        );
      } else {
        for (let i = 0; i < substraction.width; i++) {
          for (let j = 0; j < substraction.height; j++) {
            cells[substraction.y + j][substraction.x + i] = null;
          }
        }
      }
    });

  const borders = getBorders(cells);

  return {
    width,
    height,
    pointer,
    gates,
    borders,
    cells,
    seed,
  };
};
