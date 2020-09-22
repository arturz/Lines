import { Point } from "../types";
import { Player } from "../constants";

export class Gate {
  constructor(
    public readonly from: Point,
    public readonly to: Point,
    public readonly player: Player
  ) {}
}
