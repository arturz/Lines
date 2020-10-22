import { GameMap } from "../../types";
import getStickingLinesCount from "./getStickingLinesCount";

export default (y: number, x: number, map: GameMap) =>
  getStickingLinesCount(y, x, map) > 1; //there is one line from last move
