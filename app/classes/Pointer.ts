import { Direction } from "../constants";

export class Pointer {
  constructor(private readonly x: number, private readonly y: number) {}

  getCoordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  getNextCoordinates(lineY: number, lineX: number, direction: Direction) {
    let y = this.y,
      x = this.x;

    switch (direction) {
      case Direction.Right:
        if (lineY >= y) y++;
        else y--;
        break;
      case Direction.Top:
        if (lineX >= x) x++;
        else x--;
        break;
      case Direction.SteppingUp:
        if (lineY >= y) y++;
        else y--;
        if (lineX >= x) x++;
        else x--;
        break;
      case Direction.CommingDown:
        if (lineY >= y) y++;
        else y--;
        if (lineX >= x) x++;
        else x--;
        break;
      default:
        throw new Error(`Unknown direction`);
    }

    return {
      x,
      y,
    };
  }
}
