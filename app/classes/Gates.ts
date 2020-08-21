import { Player } from "../constants";
import { Point } from "../types";

class Gate {
  constructor(
    public readonly from: Point,
    public readonly to: Point,
    public readonly player: Player
  ) {}
}

export class Gates {
  public readonly gates: Gate[] = [];

  constructor(public readonly width: number, public readonly height: number) {
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
