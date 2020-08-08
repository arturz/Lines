import { Direction } from "../constants";

export interface CellLineProps {
  direction: Direction;
  x: number;
  y: number;
  backwards?: boolean;
}
