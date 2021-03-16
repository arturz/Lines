import { Gate } from "./Gate";

export class Gates {
  constructor(public readonly gates: Gate[]) {}

  isOnGate(pointerY: number, pointerX: number) {
    return this.gates.some(
      (gate) =>
        pointerX >= gate.from.x &&
        pointerX <= gate.to.x &&
        pointerY >= gate.from.y &&
        pointerY <= gate.to.y
    );
  }

  getPlayerBelongingToGate(pointerY: number, pointerX: number) {
    return this.gates.find(
      (gate) =>
        pointerX >= gate.from.x &&
        pointerX <= gate.to.x &&
        pointerY >= gate.from.y &&
        pointerY <= gate.to.y
    )?.player;
  }

  getGates() {
    return [...this.gates];
  }
}
