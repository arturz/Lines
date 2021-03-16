import { Cells } from "./Cells";
import { Gates, Pointer, Borders } from "../classes";
import { MapSize } from "./MapSize";
import { MapSeed } from "./MapSeed";
import { Direction, Player } from "../constants";
import { PowerUp } from "./PowerUp";

export interface GameMap extends MapSize {
  seed: MapSeed;
  cells: Cells;
  lastTakenLine: {
    x: number;
    y: number;
    direction: Direction;
    backwards: boolean;
    player: Player;
  };
  gates: Gates;
  pointer: Pointer;
  borders: Borders;
  powerUps: PowerUp[];
}
