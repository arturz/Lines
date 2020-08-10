import { Player, Direction } from "../constants";

export const START_GAME = "START_GAME";
export function startGame(width: number, height: number) {
  return {
    type: START_GAME,
    payload: { width, height },
  };
}

export const FINISH = "FINISH";
export function finish(winner: Player) {
  return { type: FINISH, payload: { winner } };
}

export const TAKE_LINE = "TAKE_LINE";
export function takeLine(
  y: number,
  x: number,
  direction: Direction,
  backwards = false
) {
  return { type: TAKE_LINE, payload: { x, y, direction, backwards } };
}

export const TOGGLE_PLAYER = "TOGGLE_PLAYER";
export function togglePlayer() {
  return { type: TOGGLE_PLAYER };
}
