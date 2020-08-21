import { Player } from "../constants/Player";
import { Direction } from "../constants/Direction";

class CellLine {
  constructor(
    public readonly direction: Direction,
    private readonly player: Player,
    private readonly backwards?: boolean
  ) {}

  getDirection() {
    return this.direction;
  }

  isBackwards() {
    return Boolean(this.backwards);
  }

  getPlayer() {
    return this.player;
  }

  hasDirection(direction: Direction) {
    return this.direction === direction;
  }
}

export class Cell {
  private readonly takenLines: CellLine[] = [];

  isLineTaken(direction: Direction) {
    return ~this.takenLines.findIndex((cellLine) =>
      cellLine.hasDirection(direction)
    );
  }

  areSomeLinesTaken(...directions: Direction[]) {
    return directions.some((direction: Direction) =>
      this.isLineTaken(direction)
    );
  }

  takeLine(direction: Direction, player: Player, backwards?: boolean) {
    if (this.isLineTaken(direction))
      throw new Error(`Cell line is already taken`);

    this.takenLines.push(new CellLine(direction, player, backwards));
  }

  getTakenLines() {
    return [...this.takenLines];
  }

  hasTakenLines() {
    return this.takenLines.length !== 0;
  }
}
