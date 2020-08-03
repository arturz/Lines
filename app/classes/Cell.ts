import { Color } from "./Color";
import { Direction } from "./Direction";
import { Line } from "./Line";

class CellLine extends Line {
  constructor(public direction: Direction, private color: Color) {
    super(direction);
  }

  getDirection() {
    return this.direction;
  }

  getColor() {
    return this.color;
  }

  hasDirection(direction: Direction) {
    return this.direction === direction;
  }
}

export class Cell {
  private takenLines: CellLine[] = [];

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

  takeLine(direction: Direction, color: Color) {
    if (this.isLineTaken(direction))
      throw new Error(`Cell line is already taken`);

    this.takenLines.push(new CellLine(direction, color));
  }

  getTakenLines() {
    return [...this.takenLines];
  }

  hasTakenLines() {
    return this.takenLines.length !== 0;
  }
}
