import { MapSize } from "./MapSize";
import { Offset } from "./Offset";

export interface GameSizes extends MapSize {
  cellPx: number;
  offset: Offset;
}
