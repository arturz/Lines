import { Cell } from "./Cell";
import { cloneObject } from "../utils";
import { Cells } from "../types";

export class GameMap {
  private cells: Cells = [];

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

  //basic immutability for Redux
  getMapWithSetCells(cells: Cells) {
    const _gameMap = cloneObject(this);
    _gameMap.cells = cells;
    return _gameMap;
  }
}
