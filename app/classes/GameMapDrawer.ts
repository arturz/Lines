import { Direction } from "./Direction";
import { store } from "../store";
import { EventEmitter } from "eventemitter3";
import { Line } from "./Line";
import { AnimationState } from "./AnimationState";
import { PanResponder, PanResponderInstance, Dimensions } from "react-native";

class HoverLine extends Line {
  constructor(public x: number, public y: number, direction: Direction) {
    super(direction);
  }
}

const borderColor = "#f9d56e";
const insideLinesColor = "#f3ecc2";

export class GameMapDrawer extends EventEmitter {
  //lines, taken lines
  private base: CanvasRenderingContext2D;
  //pending animations
  private animations: CanvasRenderingContext2D;
  //borders, pointer
  private overlay: CanvasRenderingContext2D;

  private cellPx = 40;
  private offset;
  private lineWidth;
  private hoverLine: HoverLine;
  public panResponder: PanResponderInstance;

  constructor(
    public width: number,
    public height: number,
    private baseCanvas: HTMLCanvasElement,
    private animationsCanvas: HTMLCanvasElement,
    private overlayCanvas: HTMLCanvasElement
  ) {
    super();

    this.base = this.baseCanvas.getContext("2d");
    this.animations = this.animationsCanvas.getContext("2d");
    this.overlay = this.overlayCanvas.getContext("2d");
    //this.overlayCanvas.addEventListener("pointermove", this.onPointerMove);
    //this.overlayCanvas.addEventListener("pointerdown", this.onPointerDown);

    this.offset = this.cellPx / 2;
    this.lineWidth = this.offset / 10;

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => {
        return true;
      },
      onPanResponderGrant: (e, gestureState) => {
        console.log("onPanResponderGrant", gestureState.x0, gestureState.y0);
        const offsetX = gestureState.moveX;
        const offsetY = gestureState.moveY;
        this.onPointerDown({ offsetX, offsetY });
      },
      onPanResponderMove: (e, gestureState) => {
        console.log("onPanResponderMove", gestureState);
        const offsetX = gestureState.moveX;
        const offsetY = gestureState.moveY;
        this.onPointerMove({ offsetX, offsetY });
      },
    });

    store.subscribe(() => {
      if (store.getState().map) {
        this.drawOverlay();
      }
    });

    this.drawAnimations();
    this.on("startGame", () => {
      this.cellPx = Math.min(
        Dimensions.get("window").width / (store.getState().map.width + 1),
        Dimensions.get("window").height / (store.getState().map.height + 1)
      );
      this.drawBase();
      this.drawOverlay();
    });
  }

  clear(ctx: CanvasRenderingContext2D) {
    //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  drawBase() {
    this.clear(this.base);
    const map = store.getState().map;

    //inside lines
    this.base.beginPath();
    this.base.lineWidth = this.lineWidth * 2;
    this.base.lineCap = "round";
    this.base.strokeStyle = insideLinesColor;
    for (let i = 0; i < map.height; i++) {
      for (let j = 0; j < map.width; j++) {
        this.base.moveTo(
          j * this.cellPx + this.offset,
          i * this.cellPx + this.offset
        );
        this.base.lineTo(
          (j + 1) * this.cellPx + this.offset,
          i * this.cellPx + this.offset
        );

        this.base.moveTo(
          j * this.cellPx + this.offset,
          i * this.cellPx + this.offset
        );
        this.base.lineTo(
          j * this.cellPx + this.offset,
          (i + 1) * this.cellPx + this.offset
        );
      }
    }
    this.base.stroke();

    //taken lines with finished animations
    for (let i = 0; i < map.height; i++) {
      for (let j = 0; j < map.width; j++) {
        for (const cellLine of map.cells[i][j].getTakenLines()) {
          if (cellLine.getAnimationState() !== AnimationState.Finish) continue;

          this.drawLine(
            this.base,
            i,
            j,
            cellLine.getDirection(),
            cellLine.getColor(),
            1
          );
        }
      }
    }
  }

  drawAnimations() {
    const map = store.getState().map;
    if (!map) {
      window.requestAnimationFrame(() => this.drawAnimations());
      return;
    }

    this.clear(this.animations);

    //hoverline
    if (this.hoverLine) {
      this.hoverLine.startAnimation();

      this.drawLine(
        this.animations,
        this.hoverLine.y,
        this.hoverLine.x,
        this.hoverLine.direction,
        store.getState().color,
        this.hoverLine.getLength(),
        true
      );
    }

    //taken lines with pending animations
    for (let i = 0; i < map.height; i++) {
      for (let j = 0; j < map.width; j++) {
        for (const cellLine of map.cells[i][j].getTakenLines()) {
          if (cellLine.getAnimationState() === AnimationState.Ready)
            cellLine.startAnimation({
              onComplete: () => {
                this.drawLine(
                  this.base,
                  i,
                  j,
                  cellLine.getDirection(),
                  cellLine.getColor(),
                  cellLine.getLength()
                );
              },
            });

          if (cellLine.getAnimationState() === AnimationState.Pending)
            this.drawLine(
              this.animations,
              i,
              j,
              cellLine.getDirection(),
              cellLine.getColor(),
              cellLine.getLength()
            );
        }
      }
    }

    window.requestAnimationFrame(() => this.drawAnimations());
  }

  drawOverlay() {
    this.clear(this.overlay);
    const map = store.getState().map;

    //borders
    this.overlay.beginPath();
    this.overlay.lineWidth = this.lineWidth * 3;
    this.overlay.lineCap = "round";
    this.overlay.strokeStyle = borderColor;

    this.overlay.moveTo(0 + this.offset, 0 + this.offset);
    this.overlay.lineTo(map.width * this.cellPx + this.offset, 0 + this.offset);

    this.overlay.moveTo(map.width * this.cellPx + this.offset, 0 + this.offset);
    this.overlay.lineTo(
      map.width * this.cellPx + this.offset,
      map.height * this.cellPx + this.offset
    );

    this.overlay.moveTo(
      map.width * this.cellPx + this.offset,
      map.height * this.cellPx + this.offset
    );
    this.overlay.lineTo(
      0 + this.offset,
      map.height * this.cellPx + this.offset
    );

    this.overlay.moveTo(
      0 + this.offset,
      map.height * this.cellPx + this.offset
    );
    this.overlay.lineTo(0 + this.offset, 0 + this.offset);

    this.overlay.stroke();

    //pointer
    const { x, y } = map.pointer.getCoordinates();
    this.overlay.beginPath();
    this.overlay.fillStyle = store.getState().color;
    this.overlay.arc(
      x * this.cellPx + this.offset,
      y * this.cellPx + this.offset,
      this.lineWidth * 2.5,
      0,
      2 * Math.PI
    );
    this.overlay.fill();
  }

  drawLine(
    ctx: CanvasRenderingContext2D,
    y: number,
    x: number,
    direction: Direction,
    rawColor: string,
    length = 1,
    reverseAnimation = false
  ) {
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth * 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = rawColor;

    let sameX = store.getState().map.pointer.getCoordinates().x === x;
    let sameY = store.getState().map.pointer.getCoordinates().y === y;

    if (reverseAnimation) {
      sameX = !sameX;
      sameY = !sameY;
    }

    switch (direction) {
      case Direction.Top:
        if (sameX) {
          ctx.moveTo(
            (x + 1) * this.cellPx + this.offset,
            y * this.cellPx + this.offset
          );
          ctx.lineTo(
            (x + 1 - length) * this.cellPx + this.offset,
            y * this.cellPx + this.offset
          );
        } else {
          ctx.moveTo(
            x * this.cellPx + this.offset,
            y * this.cellPx + this.offset
          );
          ctx.lineTo(
            (x + length) * this.cellPx + this.offset,
            y * this.cellPx + this.offset
          );
        }
        break;

      case Direction.Right:
        if (sameY) {
          ctx.moveTo(
            (x + 1) * this.cellPx + this.offset,
            (y + 1) * this.cellPx + this.offset
          );
          ctx.lineTo(
            (x + 1) * this.cellPx + this.offset,
            (y + 1 - length) * this.cellPx + this.offset
          );
        } else {
          ctx.moveTo(
            (x + 1) * this.cellPx + this.offset,
            y * this.cellPx + this.offset
          );
          ctx.lineTo(
            (x + 1) * this.cellPx + this.offset,
            (y + length) * this.cellPx + this.offset
          );
        }
        break;

      case Direction.CommingDown:
        if (sameX) {
          ctx.moveTo(
            (x + 1) * this.cellPx + this.offset,
            (y + 1) * this.cellPx + this.offset
          );
          ctx.lineTo(
            (x + 1 - length) * this.cellPx + this.offset,
            (y + 1 - length) * this.cellPx + this.offset
          );
        } else {
          ctx.moveTo(
            x * this.cellPx + this.offset,
            y * this.cellPx + this.offset
          );
          ctx.lineTo(
            (x + length) * this.cellPx + this.offset,
            (y + length) * this.cellPx + this.offset
          );
        }
        break;

      case Direction.SteppingUp:
        if (sameX) {
          ctx.moveTo(
            (x + 1) * this.cellPx + this.offset,
            y * this.cellPx + this.offset
          );
          ctx.lineTo(
            (x + 1 - length) * this.cellPx + this.offset,
            (y + length) * this.cellPx + this.offset
          );
        } else {
          ctx.moveTo(
            x * this.cellPx + this.offset,
            (y + 1) * this.cellPx + this.offset
          );
          ctx.lineTo(
            (x + length) * this.cellPx + this.offset,
            (y + 1 - length) * this.cellPx + this.offset
          );
        }
        break;
    }

    ctx.stroke();
  }

  onPointerMove = (e: PointerEvent) => {
    const map = store.getState().map;
    const { x, y } = map.pointer.getCoordinates();
    const diffX = x * this.cellPx + this.offset - e.offsetX;
    const diffY = y * this.cellPx + this.offset - e.offsetY;
    const degree = Math.atan(diffY / diffX) * (180 / Math.PI);

    if (
      Math.abs(diffX) > 3 * this.cellPx ||
      Math.abs(diffY) > 3 * this.cellPx
    ) {
      this.hoverLine = null;
      return;
    }

    let _hoverLine = null;
    if (diffX >= 0) {
      //left
      if (degree > 90 - 22.5) {
        _hoverLine = new HoverLine(x - 1, y - 1, Direction.Right);
      } else if (degree > 90 - 45 - 22.5) {
        _hoverLine = new HoverLine(x - 1, y - 1, Direction.CommingDown);
      } else if (degree > -22.5) {
        _hoverLine = new HoverLine(x - 1, y, Direction.Top);
      } else if (degree > -22.5 - 45) {
        _hoverLine = new HoverLine(x - 1, y, Direction.SteppingUp);
      } else {
        _hoverLine = new HoverLine(x - 1, y, Direction.Right);
      }
    } else {
      if (degree > 90 - 22.5) {
        _hoverLine = new HoverLine(x - 1, y, Direction.Right);
      } else if (degree > 90 - 45 - 22.5) {
        _hoverLine = new HoverLine(x, y, Direction.CommingDown);
      } else if (degree > -22.5) {
        _hoverLine = new HoverLine(x, y, Direction.Top);
      } else if (degree > -22.5 - 45) {
        _hoverLine = new HoverLine(x, y - 1, Direction.SteppingUp);
      } else {
        _hoverLine = new HoverLine(x - 1, y - 1, Direction.Right);
      }
    }

    if (!this.canBePlaced(_hoverLine.y, _hoverLine.x, _hoverLine.direction)) {
      this.hoverLine = null;
      return;
    }

    //no need to update
    if (
      this.hoverLine &&
      this.hoverLine.x === _hoverLine.x &&
      this.hoverLine.y === _hoverLine.y &&
      this.hoverLine.direction === _hoverLine.direction
    )
      return;

    this.hoverLine = _hoverLine;
  };

  onPointerDown = () => {
    if (!this.hoverLine) return;

    this.emit("takeLine", {
      x: this.hoverLine.x,
      y: this.hoverLine.y,
      direction: this.hoverLine.direction,
    });
    this.hoverLine = null;
  };

  canBePlaced(y: number, x: number, direction: Direction) {
    const { x: oldX, y: oldY } = store.getState().map.pointer.getCoordinates();

    const {
      x: nextX,
      y: nextY,
    } = store.getState().map.pointer.getNextCoordinates(y, x, direction);

    if (
      nextX < 0 ||
      nextY < 0 ||
      (nextX === 0 && oldX === 0) ||
      (nextY === 0 && oldY === 0)
    )
      return false;

    if (
      nextX > this.width ||
      nextY > this.height ||
      (nextX === this.width && oldX === this.width) ||
      (nextY === this.height && oldY === this.height)
    )
      return false;

    //corners
    if (
      (x === 0 && y === 0 && direction === Direction.CommingDown) ||
      (x === 0 &&
        y === this.height - 1 &&
        direction === Direction.SteppingUp) ||
      (x === this.width - 1 && y === 0 && direction === Direction.SteppingUp) ||
      (x === this.width - 1 &&
        y === this.height - 1 &&
        direction === Direction.CommingDown)
    )
      return false;

    if (store.getState().map.cells[y][x].isLineTaken(direction)) return false;

    return true;
  }
}
