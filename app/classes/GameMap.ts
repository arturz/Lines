import { Pointer } from "./Pointer";
import { Cell } from "./Cell";

export class GameMap {
  pointer: Pointer;
  cells: Cell[][] = [];

  constructor(public width: number, public height: number, copied = false) {
    if (copied) return;

    this.pointer = new Pointer(this.width / 2, this.height / 2);

    for (let i = 0; i < height; i++) {
      this.cells.push([]);
      for (let j = 0; j < width; j++) {
        this.cells[i].push(new Cell());
      }
    }
  }

  copy() {
    const _map = new GameMap(this.width, this.height, true);
    Object.assign(_map, this);
    return _map;
  }
}
