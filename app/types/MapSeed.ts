import { MapSize } from "./MapSize";
import { Point } from "./Point";
import { MatrixPosition } from "../constants";

export type MapSeedSubstractionAbsolute = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type MapSeedSubstractionRelative = {
  width: number;
  height: number;
  position: MatrixPosition;
};

export type MapSeedSubstraction =
  | MapSeedSubstractionAbsolute
  | MapSeedSubstractionRelative;

type MapSeedGate = {
  from: Point;
  to: Point;
};

export interface MapSeed extends MapSize {
  substractions?: MapSeedSubstraction[];
  gates: {
    A: MapSeedGate[];
    B: MapSeedGate[];
  };
  pointer: Point;
}
