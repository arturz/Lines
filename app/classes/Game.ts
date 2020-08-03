import { GameMapDrawer } from "./GameMapDrawer";
import { store } from "../store";
import { Direction } from "./Direction";
import { startGame, takeLine, finish, changeColor } from "../actions/game";
import { Status } from "./Status";
import reverseColor from "../utils/reverseColor";
import { Alert } from "react-native";

interface TakeLine {
  x: number;
  y: number;
  direction: Direction;
}

export class Game extends GameMapDrawer {
  constructor(
    public width: number,
    public height: number,
    baseCanvas: HTMLCanvasElement,
    animationsCanvas: HTMLCanvasElement,
    overlayCanvas: HTMLCanvasElement
  ) {
    super(width, height, baseCanvas, animationsCanvas, overlayCanvas);

    this.init();
    store.dispatch(startGame(width, height));
    this.emit("startGame");
    Alert.alert("startGame");
  }

  init() {
    this.on("takeLine", ({ x, y, direction }: TakeLine) => {
      if (store.getState().status !== Status.Playing) return;

      if (!this.canBePlaced(y, x, direction)) return;

      store.dispatch(takeLine(y, x, direction));
    });

    store.subscribe(() => {
      if (store.getState().status !== Status.Playing) return;

      if (this.checkWinner()) {
        store.dispatch(finish(reverseColor(store.getState().color)));
        return;
      }

      if (
        !store.getState().changedColor &&
        this.getStickingPoints(
          store.getState().map.pointer.getCoordinates().y,
          store.getState().map.pointer.getCoordinates().x
        ) === 1
      )
        store.dispatch(changeColor());
    });
  }

  //remember that pointer has always one sticking point at least (previous line), except by the start
  getStickingPoints(y: number, x: number) {
    const map = store.getState().map;
    const cells = map.cells;
    let points = 0;
    if (x - 1 >= 0 && y - 1 >= 0) {
      if (cells[y - 1][x - 1].isLineTaken(Direction.CommingDown)) points++;
      if (cells[y - 1][x - 1].isLineTaken(Direction.Right)) points++;
    }
    if (y - 1 >= 0 && x !== map.width) {
      if (cells[y - 1][x].areSomeLinesTaken(Direction.SteppingUp)) points++;
    }
    if (x - 1 >= 0 && y !== map.height) {
      if (cells[y][x - 1].isLineTaken(Direction.SteppingUp)) points++;
      if (cells[y][x - 1].isLineTaken(Direction.Top)) points++;
      if (cells[y][x - 1].isLineTaken(Direction.Right)) points++;
    }

    if (x !== map.width && y !== map.height) {
      if (cells[y][x].areSomeLinesTaken(Direction.CommingDown)) points++;
      if (cells[y][x].areSomeLinesTaken(Direction.Top)) points++;
    }

    if (x === 0 || y === 0 || x === map.width || y === map.height) points++;

    return points;
  }

  checkWinner() {
    const pointer = store.getState().map.pointer.getCoordinates();

    let ways = 0;
    if (this.canBePlaced(pointer.y - 1, pointer.x, Direction.SteppingUp)) {
      ways++;
    }

    if (this.canBePlaced(pointer.y - 1, pointer.x - 1, Direction.CommingDown)) {
      ways++;
    }
    if (this.canBePlaced(pointer.y - 1, pointer.x - 1, Direction.Right)) {
      ways++;
    }

    if (this.canBePlaced(pointer.y, pointer.x - 1, Direction.Top)) {
      ways++;
    }
    if (this.canBePlaced(pointer.y, pointer.x - 1, Direction.SteppingUp)) {
      ways++;
    }
    if (this.canBePlaced(pointer.y, pointer.x - 1, Direction.Right)) {
      ways++;
    }

    if (this.canBePlaced(pointer.y, pointer.x, Direction.CommingDown)) {
      ways++;
    }
    if (this.canBePlaced(pointer.y, pointer.x, Direction.Top)) {
      ways++;
    }

    if (ways === 0) return true;

    return false;
  }
}
