import { Cells } from "./Cells";
import { Gates, Pointer, Borders } from "../classes";
import { MapSize } from "./MapSize";
import { MapSeed } from "./MapSeed";

export interface GameMap extends MapSize {
  seed: MapSeed;
  cells: Cells;
  gates: Gates;
  pointer: Pointer;
  borders: Borders;
}
