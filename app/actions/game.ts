import { Direction } from "../classes/Direction";
import { Color } from "../classes/Color";

export const START_GAME = "START_GAME";
export function startGame(width: number, height: number) {
  return {
    type: START_GAME,
    payload: { width, height },
  };
}

export const FINISH = "FINISH";
export function finish(winner: Color) {
  return { type: FINISH, payload: { winner } };
}

export const TAKE_LINE = "TAKE_LINE";
export function takeLine(y: number, x: number, direction: Direction) {
  return { type: TAKE_LINE, payload: { x, y, direction } };
}

export const CHANGE_COLOR = "CHANGE_COLOR";
export function changeColor() {
  return { type: CHANGE_COLOR };
}
