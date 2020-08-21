import { Cell } from "./Cell";

export class GameMap {
  public readonly cells: Cell[][] = [];

  constructor(
    public readonly width: number,
    public readonly height: number,
    copy: GameMap = null
  ) {
    if (copy) {
      Object.assign(this, copy);
      return;
    }

    for (let i = 0; i < height; i++) {
      this.cells.push([]);
      for (let j = 0; j < width; j++) {
        this.cells[i].push(new Cell());
      }
    }
  }

  getCells() {
    return [...this.cells];
  }
}
