import { Player } from "../constants";
import { Point } from "../types";

class Gate {
  constructor(
    readonly from: Point,
    readonly to: Point,
    readonly player: Player
  ) {}
}

export class Gates {
  gates: Gate[] = [];

  constructor(public width: number, public height: number) {
    this.gates.push(
      new Gate(
        { x: width / 2 - 1, y: 0 },
        { x: width / 2 + 1, y: 0 },
        Player.A
      ),
      new Gate(
        { x: width / 2 - 1, y: height },
        { x: width / 2 + 1, y: height },
        Player.B
      )
    );
  }

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
    ).player;
  }

  getGates() {
    return [...this.gates];
  }
}
