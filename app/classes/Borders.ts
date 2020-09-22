import { Border } from "./Border";

export class Borders {
  constructor(public readonly borders: Border[]) {}

  isOnBorder(pointerY: number, pointerX: number) {
    return this.borders.some(
      (gate) =>
        pointerX >= gate.from.x &&
        pointerX <= gate.to.x &&
        pointerY >= gate.from.y &&
        pointerY <= gate.to.y
    );
  }

  getBorders() {
    return [...this.borders];
  }
}
